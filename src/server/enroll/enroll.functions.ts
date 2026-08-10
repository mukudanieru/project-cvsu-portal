import {
  getAvailableOfferingsForStudentQuery,
  getStudentEnrollmentInfoQuery,
  insertEnrollmentRecords,
} from './enroll.server'
import { getCurrentUserFn } from '../auth/auth.functions'
import { groupOfferingsByTerm } from '#/lib/utils/enroll'
import { createServerFn } from '@tanstack/react-start'

type GeneralError = {
  error: { type: 'general'; title: string; description: string }
}

type OfferingsResult =
  | GeneralError
  | { isEnrolled: boolean; terms: ReturnType<typeof groupOfferingsByTerm> }

export const getAvailableOfferingsForStudent = createServerFn({
  method: 'GET',
}).handler(async (): Promise<OfferingsResult> => {
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

    const rows = await getAvailableOfferingsForStudentQuery(student.sectionId)

    return {
      isEnrolled: student.isEnrolled,
      terms: groupOfferingsByTerm(rows),
    }
  } catch {
    return {
      error: {
        type: 'general',
        title: 'Could not load available subjects',
        description: 'Something went wrong fetching the subject list.',
      },
    }
  }
})

type EnrollResult = GeneralError | { success: true }

export const enrollStudent = createServerFn({ method: 'POST' }).handler(
  async (): Promise<EnrollResult> => {
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
      if (!student) {
        return {
          error: {
            type: 'general',
            title: 'Student not found',
            description: 'No student record is linked to this account.',
          },
        }
      }

      if (student.isEnrolled) {
        return {
          error: {
            type: 'general',
            title: 'Already enrolled',
            description:
              'This account is already enrolled for the current period.',
          },
        }
      }

      await insertEnrollmentRecords(currentUser.studentID, student.sectionId)

      return { success: true }
    } catch (err) {
      if (err instanceof Error && err.message === 'NO_OFFERINGS') {
        return {
          error: {
            type: 'general',
            title: 'Nothing to enroll in',
            description:
              'No subjects are currently available for your section.',
          },
        }
      }

      return {
        error: {
          type: 'general',
          title: 'Enrollment failed',
          description: 'Something went wrong while processing your enrollment.',
        },
      }
    }
  },
)
