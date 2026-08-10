import { createServerFn } from '@tanstack/react-start'
import { getRegFormForStudent } from './regform.server'
import { getCurrentUserFromSession } from '../auth/auth.server'
import { buildRegForm } from '#/lib/utils/regform'
import type { RegFormData } from '#/lib/utils/regform'
import type { ErrorInterface } from '#/lib/utils/error'

export const getRegFormInformationForCurrentUser = createServerFn({
  method: 'GET',
}).handler(async (): Promise<RegFormData | ErrorInterface> => {
  try {
    const currentUser = await getCurrentUserFromSession()

    if (!currentUser) {
      return {
        error: {
          type: 'general',
          title: 'Unauthorized',
          description: 'You must be logged in to access this resource.',
        },
      }
    }

    const { period, rows } = await getRegFormForStudent(currentUser.studentID)

    if (!period) {
      return {
        error: {
          type: 'general',
          title: 'No Semester Selected',
          description:
            "You haven't selected an academic period yet. Please enroll for a semester from your Account page.",
        },
      }
    }

    if (rows.length === 0) {
      return {
        error: {
          type: 'general',
          title: 'No Enrollment Found',
          description:
            'You are not currently enrolled for this academic period.',
        },
      }
    }

    return buildRegForm(rows)
  } catch {
    return {
      error: {
        type: 'general',
        title: 'Something Went Wrong',
        description:
          "We couldn't load your registration form right now. Please try again in a moment.",
      },
    }
  }
})
