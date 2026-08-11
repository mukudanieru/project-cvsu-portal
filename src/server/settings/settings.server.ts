import { students } from '#/db/schema'
import { db } from '#/db/drizzle'
import { eq } from 'drizzle-orm'
import type { SettingsFieldsValues } from '#/lib/schema/settings.schema'
import type { Transaction } from '../academic.server'
import { upsertSelectedPeriodQuery } from '../academic.server'

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
