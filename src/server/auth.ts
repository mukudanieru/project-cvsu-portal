import { createServerFn } from '@tanstack/react-start'
import { students, accounts } from '@/db/schema'
import { verifyPassword } from '@/lib/password'
import { useAppSession } from '@/lib/session'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const loginSchema = z.object({
  studentNumber: z.string(),
  password: z.string(),
})

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const studentAccount = await db.query.students.findFirst({
      where: eq(students.studentNumber, data.studentNumber),
      with: {
        account: true,
      },
    })

    if (!studentAccount) {
      return {
        error: {
          title: 'Login failed',
          description: 'Student number not found.',
        },
      }
    }

    const passwordMatch = await verifyPassword(
      data.password,
      studentAccount.account.passwordHash,
    )

    if (!passwordMatch) {
      return {
        error: {
          title: 'Login failed',
          description: 'Password is incorrect.',
        },
      }
    }

    const session = await useAppSession()
    await session.update({ accountID: String(studentAccount.id) })

    return { success: true }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()

  return { sucess: true }
})

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()

    if (!session.data.accountID) return null

    const accountID = Number(session.data.accountID)

    const [studentAccount] = await db
      .select({
        universityEmail: accounts.universityEmail,
      })
      .from(accounts)
      .where(eq(accounts.id, accountID))
      .limit(1)

    return studentAccount
  },
)
