import { createServerFn } from '@tanstack/react-start'
import { getStudentProfileQuery, updateStudentProfile } from './settings.server'
import {
  getSelectedPeriodQuery,
  getEnrolledPeriodsQuery,
} from '../academic.server'
import { settingsFields } from '#/lib/schema/settings.schema'
import { getCurrentUserFn } from '../auth/auth.functions'

import type { StudentProfile } from './settings.server'
import type { EnrolledPeriod } from '../academic.server'

type GeneralError = {
  error: { type: 'general'; title: string; description: string }
}

type ProfileSettingsData = NonNullable<StudentProfile> & {
  selectedPeriodId: number | null
  periodOptions: EnrolledPeriod[]
}

export const getProfileSettings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ProfileSettingsData | GeneralError> => {
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

      const [profile, selectedPeriod, periodOptions] = await Promise.all([
        getStudentProfileQuery(currentUser.studentID),
        getSelectedPeriodQuery(currentUser.studentID),
        getEnrolledPeriodsQuery(currentUser.studentID),
      ])

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

      return {
        ...profile,
        selectedPeriodId: selectedPeriod[0]?.id ?? null,
        periodOptions,
      }
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
  .inputValidator(settingsFields)
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
