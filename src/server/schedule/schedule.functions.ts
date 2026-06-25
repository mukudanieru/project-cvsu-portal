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
        title: 'No Subjects Found',
        description: 'You are not enrolled in any subjects.',
      },
    }
  }

  return studentSchedules
})
