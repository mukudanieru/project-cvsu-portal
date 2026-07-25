import { createServerFn } from '@tanstack/react-start'
import { getGrades } from './grades.server'
import { getCurrentUserFromSession } from '../auth/auth.server'
import { groupGradesByYearAndTerm } from './grades.util'

export const getGradesForCurrentUser = createServerFn({
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

  const studentGrades = await getGrades(currentUser.studentID)

  if (studentGrades.length === 0) {
    return {
      error: {
        title: 'No Grades Found',
        description: 'No grades are currently available for your account.',
      },
    }
  }

  return groupGradesByYearAndTerm(studentGrades)
})
