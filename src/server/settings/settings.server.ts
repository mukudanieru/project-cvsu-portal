import { accounts, students } from '#/db/schema'
import { db } from '#/db/drizzle'
import { eq } from 'drizzle-orm'
import type { Transaction } from '../academic.server'
import { upsertSelectedPeriodQuery } from '../academic.server'
import { hashPassword, verifyPassword } from '#/lib/password'
import type {
  SettingsFieldsValues,
  PasswordFieldsValues,
  DeleteAccountFieldValues,
} from '#/lib/schema/settings.schema'

export async function getStudentProfileQuery(studentId: string) {
  const rows = await db
    .select({
      address: students.address,
      sex: students.sex,
      birthday: students.birthday,
      citizenship: students.citizenship,
      relationshipStatus: students.relationshipStatus,
      guardian: students.guardian,
    })
    .from(students)
    .where(eq(students.id, studentId))

  return rows[0] ?? null
}

export type StudentProfile = Awaited<ReturnType<typeof getStudentProfileQuery>>

export async function updateStudentProfileQuery(
  tx: Transaction,
  studentId: string,
  data: Omit<SettingsFieldsValues, 'periodId'>,
) {
  const [updated] = await tx
    .update(students)
    .set({
      address: data.address,
      sex: data.sex,
      birthday: data.birthday.toISOString().slice(0, 10),
      citizenship: data.citizenship,
      relationshipStatus: data.relationshipStatus,
      guardian: data.guardian,
    })
    .where(eq(students.id, studentId))
    .returning()

  return updated
}

export async function updateStudentProfile(
  studentId: string,
  data: SettingsFieldsValues,
) {
  const { periodId, ...profileData } = data

  return await db.transaction(async (tx) => {
    const updated = await updateStudentProfileQuery(tx, studentId, profileData)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!updated) {
      throw new Error('STUDENT_NOT_FOUND')
    }

    if (periodId !== undefined) {
      await upsertSelectedPeriodQuery(tx, studentId, periodId)
    }

    return updated
  })
}

// Kept here per your file-count constraint. Under normal circumstances this
// would live in a feature-neutral accounts.server.ts alongside other
// account-table lookups, since it's not really "settings" business logic —
// flagging in case that file exists elsewhere and this should move there.
export async function getAccountPasswordHashQuery(studentId: string) {
  const rows = await db
    .select({ passwordHash: accounts.passwordHash })
    .from(accounts)
    .where(eq(accounts.studentId, studentId))

  return rows[0] ?? null
}

export async function updateAccountPasswordQuery(
  studentId: string,
  passwordHash: string,
) {
  const [updated] = await db
    .update(accounts)
    .set({ passwordHash })
    .where(eq(accounts.studentId, studentId))
    .returning()

  return updated
}

export async function updateStudentPassword(
  studentId: string,
  data: PasswordFieldsValues,
) {
  const account = await getAccountPasswordHashQuery(studentId)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!account) {
    throw new Error('ACCOUNT_NOT_FOUND')
  }

  const isCurrentPasswordValid = await verifyPassword(
    data.currentPassword,
    account.passwordHash,
  )

  if (!isCurrentPasswordValid) {
    throw new Error('INVALID_CURRENT_PASSWORD')
  }

  const passwordHash = await hashPassword(data.newPassword)
  const updated = await updateAccountPasswordQuery(studentId, passwordHash)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!updated) {
    throw new Error('ACCOUNT_NOT_FOUND')
  }

  return updated
}

export async function deleteStudentAccountQuery(studentId: string) {
  const [deleted] = await db
    .delete(students)
    .where(eq(students.id, studentId))
    .returning({ id: students.id })

  return deleted
}

export async function deleteStudentAccount(
  studentId: string,
  data: DeleteAccountFieldValues,
) {
  const account = await getAccountPasswordHashQuery(studentId)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!account) {
    throw new Error('ACCOUNT_NOT_FOUND')
  }

  const isPasswordValid = await verifyPassword(
    data.currentPassword,
    account.passwordHash,
  )

  if (!isPasswordValid) {
    throw new Error('INVALID_CURRENT_PASSWORD')
  }

  const deleted = await deleteStudentAccountQuery(studentId)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!deleted) {
    throw new Error('ACCOUNT_NOT_FOUND')
  }

  return deleted
}
