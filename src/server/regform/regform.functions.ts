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
          title: 'No Active Curriculum Found',
          description:
            'You need to enroll before you can generate a registration form. Go to your Account Settings to enroll in a curriculum.',
        },
      }
    }

    if (rows.length === 0) {
      return {
        error: {
          type: 'general',
          title: 'No Active Subjects Found',
          description:
            'There are no subjects registered for the currently selected semester. You can update your active semester in your Account Settings.',
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
