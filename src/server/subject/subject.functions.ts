import { createServerFn } from '@tanstack/react-start'
import { getEnrolledSubjectsForStudent } from './subject.server'
import type { SelectedPeriod, EnrolledSubject } from './subject.server'
import { getCurrentUserFromSession } from '../auth/auth.server'

export type GetEnrolledSubjectsResult =
  | { error: { type: 'general'; title: string; description: string } }
  | { currentPeriod: SelectedPeriod; studentSubjects: Array<EnrolledSubject> }

export type EnrolledSubjectsSuccess = Extract<
  GetEnrolledSubjectsResult,
  { currentPeriod: unknown }
>

export const getEnrolledSubjectsForCurrentUser = createServerFn({
  method: 'GET',
}).handler(async (): Promise<GetEnrolledSubjectsResult> => {
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

    const { period, studentSubjects } = await getEnrolledSubjectsForStudent(
      currentUser.studentID,
    )

    if (!period) {
      return {
        error: {
          type: 'general',
          title: 'No Active Curriculum Found',
          description:
            'You need to enroll before you can view your subjects. Go to your Account Settings to enroll in a curriculum.',
        },
      }
    }

    if (studentSubjects.length === 0) {
      return {
        error: {
          type: 'general',
          title: 'No Active Subjects Found',
          description:
            'There are no subjects registered for the currently selected semester. You can update your active semester in your Account Settings.',
        },
      }
    }

    return { currentPeriod: period, studentSubjects }
  } catch {
    return {
      error: {
        type: 'general',
        title: 'Something Went Wrong',
        description:
          "We couldn't load your subjects right now. Please try again in a moment.",
      },
    }
  }
})
