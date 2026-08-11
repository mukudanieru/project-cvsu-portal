import {
  getEnrollmentsForGradingQuery,
  insertTermGrades,
} from './encode.server'
import { getStudentEnrollmentInfoQuery } from '../academic.server'
import { getCurrentUserFn } from '../auth/auth.functions'
import { groupEnrollmentsByTerm, GRADE_VALUES } from '#/lib/utils/encode'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

type GeneralError = {
  error: { type: 'general'; title: string; description: string }
}

type GradeEntryResult =
  | GeneralError
  | { isEnrolled: false }
  | { isEnrolled: true; terms: ReturnType<typeof groupEnrollmentsByTerm> }

export const getGradeEntryData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<GradeEntryResult> => {
  const currentUser = await getCurrentUserFn()

  if (!currentUser) {
    return {
      error: {
        type: 'general',
        title: 'Unauthorized',
        description: 'You must be logged in to access this resource.',
      },
    }
  }

  try {
    const student = await getStudentEnrollmentInfoQuery(currentUser.studentID)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!student) {
      return {
        error: {
          type: 'general',
          title: 'Student not found',
          description: 'No student record is linked to this account.',
        },
      }
    }

    if (!student.isEnrolled) {
      return { isEnrolled: false }
    }

    const rows = await getEnrollmentsForGradingQuery(currentUser.studentID)

    return { isEnrolled: true, terms: groupEnrollmentsByTerm(rows) }
  } catch {
    return {
      error: {
        type: 'general',
        title: 'Could not load grade entry',
        description: 'Something went wrong fetching your subjects.',
      },
    }
  }
})

const submitTermGradesSchema = z.object({
  periodId: z.number().int().positive(),
  grades: z
    .array(
      z.object({
        enrollmentId: z.number().int().positive(),
        grade: z.union(GRADE_VALUES.map((v) => z.literal(v))),
      }),
    )
    .min(1),
})

type SubmitResult = GeneralError | { success: true }

export const submitTermGrades = createServerFn({ method: 'POST' })
  .inputValidator(submitTermGradesSchema)
  .handler(async ({ data }): Promise<SubmitResult> => {
    const currentUser = await getCurrentUserFn()

    if (!currentUser) {
      return {
        error: {
          type: 'general',
          title: 'Unauthorized',
          description: 'You must be logged in to perform this action.',
        },
      }
    }

    try {
      const student = await getStudentEnrollmentInfoQuery(currentUser.studentID)

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!student?.isEnrolled) {
        return {
          error: {
            type: 'general',
            title: 'Not enrolled',
            description: 'You must be enrolled before submitting grades.',
          },
        }
      }

      await insertTermGrades(currentUser.studentID, data.periodId, data.grades)

      return { success: true }
    } catch (err) {
      if (err instanceof Error && err.message === 'ALREADY_SUBMITTED') {
        return {
          error: {
            type: 'general',
            title: 'Already submitted',
            description: 'Grades for this term have already been recorded.',
          },
        }
      }

      if (err instanceof Error && err.message === 'INCOMPLETE_SUBMISSION') {
        return {
          error: {
            type: 'general',
            title: 'Incomplete submission',
            description:
              'Every subject in this term needs a grade before submitting.',
          },
        }
      }

      return {
        error: {
          type: 'general',
          title: 'Submission failed',
          description: 'Something went wrong while saving your grades.',
        },
      }
    }
  })
