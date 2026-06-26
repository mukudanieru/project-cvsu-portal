import { createServerFn } from '@tanstack/react-start'
import { getCurrentPeriod, getEnrolledSubjects } from './subject.server'
import { getCurrentUserFromSession } from '../auth/auth.server'

export const getEnrolledSubjectsForCurrentUser = createServerFn({
  method: 'GET',
}).handler(async () => {
  const currentUser = await getCurrentUserFromSession()

  if (!currentUser) {
    return {
      error: {
        title: 'Unauthorized',
        description: 'You must be logged in to access this resource.',
      },
    }
  }

  const currentPeriod = await getCurrentPeriod()

  if (currentPeriod.length === 0) {
    return {
      error: {
        title: 'Academic Period Unavailable',
        description:
          'The current academic period has not been configured yet. Please contact the Registrar for assistance.',
      },
    }
  }

  const studentSubjects = await getEnrolledSubjects(currentUser.studentID)

  if (studentSubjects.length === 0) {
    return {
      error: {
        title: 'No Subjects Enrolled',
        description:
          'You have no subjects enrolled for the current semester. Please contact your registrar if you believe this is a mistake.',
      },
    }
  }

  return { currentPeriod: currentPeriod[0], studentSubjects }
})
