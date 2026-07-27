import { createServerFn } from '@tanstack/react-start'
import { getRegFormInformation } from './regform.server'
import { getCurrentUserFromSession } from '../auth/auth.server'
import { buildRegForm } from '#/lib/utils/regform'
import type { RegFormData } from '#/lib/utils/regform'
import type { ErrorInterface } from '#/lib/utils/error'

export const getRegFormInformationForCurrentUser = createServerFn({
  method: 'GET',
}).handler(async (): Promise<RegFormData | ErrorInterface> => {
  const currentUser = await getCurrentUserFromSession()

  if (!currentUser) {
    return {
      error: {
        title: 'Unauthorized',
        description: 'You must be logged in to access this resource.',
      },
    }
  }

  const studentRegForm = await getRegFormInformation(currentUser.studentID)

  if (studentRegForm.length === 0) {
    return {
      error: {
        title: 'No Enrollment Found',
        description: 'You are not currently enrolled for this academic period.',
      },
    }
  }

  return buildRegForm(studentRegForm)
})
