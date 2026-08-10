import {
  getAvailableOfferingsForStudentQuery,
  getStudentSectionIdQuery,
} from './enroll.server'
import { getCurrentUserFn } from '../auth/auth.functions'
import { groupOfferingsByTerm } from '#/lib/utils/enroll'
import { createServerFn } from '@tanstack/react-start'

export const getAvailableOfferingsForStudent = createServerFn({
  method: 'GET',
}).handler(async () => {
  const currentUser = await getCurrentUserFn()

  if (!currentUser) {
    return {
      error: {
        title: 'Unauthorized',
        description: 'You must be logged in to access this resource.',
      },
    }
  }

  try {
    const studentSectionId = await getStudentSectionIdQuery(
      currentUser.studentID,
    )

    if (!studentSectionId) {
      return {
        error: {
          title: 'Student not found',
          description: 'No student record is linked to this account.',
        },
      }
    }

    const rows = await getAvailableOfferingsForStudentQuery(studentSectionId)
    return groupOfferingsByTerm(rows)
  } catch {
    return {
      error: {
        title: 'Could not load available subjects',
        description: 'Something went wrong fetching the subject list.',
      },
    }
  }
})
