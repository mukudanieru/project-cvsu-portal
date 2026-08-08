import { registerSchema } from '#/lib/schema/register.schema'
import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from '#/lib/session'
import {
  generateUniqueStudentNumber,
  getCoursesQuery,
  getSectionsByCourseIdQuery,
  insertStudentAccount,
  isStudentNumberTakenQuery,
  isUniversityEmailTakenQuery,
} from './register.server'
import z from 'zod'
import type { RegisterResult } from './register.utils'

export const getCourses = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const courses = await getCoursesQuery()
      return courses
    } catch {
      return {
        error: {
          title: 'Could not load courses',
          description: 'Something went wrong fetching the course list.',
        },
      }
    }
  },
)

export const getSectionsByCourseId = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ courseId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    try {
      const sectionsByCourseId = await getSectionsByCourseIdQuery(data.courseId)

      console.log(sectionsByCourseId)

      return sectionsByCourseId
    } catch {
      return {
        error: {
          title: 'Could not load sections',
          description: 'Something went wrong fetching the section list.',
        },
      }
    }
  })

export const generateStudentNumber = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const studentNumber = await generateUniqueStudentNumber()
      return { studentNumber }
    } catch {
      return {
        error: {
          title: 'Could not generate a student number',
          description: 'Please try again.',
        },
      }
    }
  },
)

export const registerStudent = createServerFn({
  method: 'GET',
})
  .inputValidator(registerSchema)
  .handler(async ({ data }): Promise<RegisterResult> => {
    try {
      if (await isUniversityEmailTakenQuery(data.universityEmail)) {
        return {
          error: {
            type: 'field',
            field: 'universityEmail',
            message: 'This email is already registered.',
          },
        }
      }

      if (await isStudentNumberTakenQuery(data.studentNumber)) {
        return {
          error: {
            type: 'field',
            field: 'studentNumber',
            message: 'This student number was just taken — generate a new one.',
          },
        }
      }

      const { studentId, accountId } = await insertStudentAccount(data)

      const session = await useAppSession()
      await session.update({ accountID: accountId, studentID: studentId })

      return { success: true }
    } catch (error) {
      console.log(error)

      return {
        error: {
          type: 'general',
          title: 'Registration failed',
          description:
            'Something went wrong creating your account. Please try again.',
        },
      }
    }
  })
