import { createServerFn } from '@tanstack/react-start'
import { getStudentProfileQuery, updateStudentProfile } from './settings.server'
import { profileFields } from '#/lib/schema/settings.schema'
import { getCurrentUserFn } from '../auth/auth.functions'
import type { StudentProfile } from './settings.server'

type GeneralError = {
  error: { type: 'general'; title: string; description: string }
}

export const getProfileSettings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<StudentProfile | GeneralError> => {
    try {
      const currentUser = await getCurrentUserFn()

      if (!currentUser) {
        return {
          error: {
            type: 'general',
            title: 'Unauthorized',
            description: 'You must be logged in to access this resource.',
          },
        }
      }

      const profile = await getStudentProfileQuery(currentUser.studentID)

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!profile) {
        return {
          error: {
            type: 'general',
            title: 'Profile not found',
            description: 'We could not find your student profile.',
          },
        }
      }

      return profile
    } catch {
      return {
        error: {
          type: 'general',
          title: 'Something went wrong',
          description: 'Failed to load your profile. Please try again.',
        },
      }
    }
  },
)

export const updateProfileSettings = createServerFn({ method: 'POST' })
  .inputValidator(profileFields)
  .handler(async ({ data }): Promise<{ success: true } | GeneralError> => {
    try {
      const currentUser = await getCurrentUserFn()

      if (!currentUser) {
        return {
          error: {
            type: 'general',
            title: 'Unauthorized',
            description: 'You must be logged in to access this resource.',
          },
        }
      }

      await updateStudentProfile(currentUser.studentID, data)

      return { success: true }
    } catch {
      return {
        error: {
          type: 'general',
          title: 'Update failed',
          description: 'We could not update your profile. Please try again.',
        },
      }
    }
  })
