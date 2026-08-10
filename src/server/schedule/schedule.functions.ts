import { createServerFn } from '@tanstack/react-start'
import { getSchedulesForStudent } from './schedule.server'
import type { OfferingSchedule } from './schedule.server'
import { getCurrentUserFromSession } from '../auth/auth.server'

export type GetSchedulesResult =
  | { error: { type: 'general'; title: string; description: string } }
  | Array<OfferingSchedule>

export const getSubjectOfferingSchedulesForCurrentUser = createServerFn({
  method: 'GET',
}).handler(async (): Promise<GetSchedulesResult> => {
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

    const { period, schedules } = await getSchedulesForStudent(
      currentUser.studentID,
    )

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

    if (schedules.length === 0) {
      return {
        error: {
          type: 'general',
          title: 'No Schedule Available',
          description:
            'Your subjects have no assigned schedule yet. Check back later or contact your department for more information.',
        },
      }
    }

    return schedules
  } catch {
    return {
      error: {
        type: 'general',
        title: 'Something Went Wrong',
        description:
          "We couldn't load your schedule right now. Please try again in a moment.",
      },
    }
  }
})
