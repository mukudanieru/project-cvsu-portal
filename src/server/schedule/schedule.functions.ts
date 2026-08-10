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
          title: 'No Active Curriculum Found',
          description:
            'You need to enroll before you can view your schedule. Go to your Account Settings to enroll in a curriculum.',
        },
      }
    }

    if (schedules.length === 0) {
      return {
        error: {
          type: 'general',
          title: 'No Schedule Available',
          description:
            'There are no subjects with a schedule for the currently selected semester. You can update your active semester in your Account Settings.',
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
