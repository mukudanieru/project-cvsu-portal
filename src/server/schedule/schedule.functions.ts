import { createServerFn } from '@tanstack/react-start'
import { getSubjectOfferingSchedules } from './schedule.server'
import { getCurrentUserFromSession } from '../auth/auth.server'

export const getSubjectOfferingSchedulesForCurrentUser = createServerFn({
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

  const studentSchedules = await getSubjectOfferingSchedules(
    currentUser.studentID,
  )

  if (studentSchedules.length === 0) {
    return {
      error: {
        title: 'No Schedule Available',
        description:
          'Your subjects have no assigned schedule yet. Check back later or contact your department for more information.',
      },
    }
  }

  return studentSchedules
})
