// grades.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { getGradesQuery } from './grades.server'
import { getCurrentUserFromSession } from '../auth/auth.server'
import { groupGradesByYearAndTerm } from './grades.util'
import type { GroupedGrades } from '#/lib/utils/grades'
import type { ErrorInterface } from '#/lib/utils/error'

export const getGradesForCurrentUser = createServerFn({
  method: 'GET',
}).handler(async (): Promise<GroupedGrades | ErrorInterface> => {
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

    const studentGrades = await getGradesQuery(currentUser.studentID)

    if (studentGrades.length === 0) {
      return {
        error: {
          type: 'general',
          title: 'No Grades Found',
          description:
            "You haven't entered any grades yet. Once enrolled, you can input grades to see them here.",
        },
      }
    }

    return groupGradesByYearAndTerm(studentGrades)
  } catch {
    return {
      error: {
        type: 'general',
        title: 'Something Went Wrong',
        description:
          "We couldn't load your grades right now. Please try again in a moment.",
      },
    }
  }
})
