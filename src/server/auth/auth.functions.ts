import { createServerFn } from '@tanstack/react-start'
import { verifyPassword } from '@/lib/password'
import { useAppSession } from '@/lib/session'
import { z } from 'zod'

import {
  findStudentByStudentNumber,
  getCurrentUserFromSession,
} from './auth.server'

const loginSchema = z.object({
  studentNumber: z.string(),
  password: z.string(),
})

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const studentAccount = await findStudentByStudentNumber(data.studentNumber)

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
    await session.update({ accountID: studentAccount.account.id })
    console.log(session.data.accountID)

    return { success: true }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()

  return { sucess: true }
})

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  getCurrentUserFromSession,
)
