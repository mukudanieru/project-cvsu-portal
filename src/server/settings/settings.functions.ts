import { createServerFn } from '@tanstack/react-start'
import {
  getStudentProfileQuery,
  updateStudentProfile,
  updateStudentPassword,
  deleteStudentAccount,
} from './settings.server'
import {
  getSelectedPeriodQuery,
  getEnrolledPeriodsQuery,
} from '../academic.server'
import {
  settingsFields,
  passwordFields,
  deleteAccountField,
} from '#/lib/schema/settings.schema'
import { getCurrentUserFn } from '../auth/auth.functions'
import type { StudentProfile } from './settings.server'
import type { EnrolledPeriod } from '../academic.server'
import type {
  DeleteAccountFieldValues,
  PasswordFieldsValues,
} from '#/lib/schema/settings.schema'
import { useAppSession } from '#/lib/session'

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

type FieldError = {
  error: {
    type: 'field'
    field: 'currentPassword'
    message: string
  }
}

export const updatePasswordSettings = createServerFn({ method: 'POST' })
  .inputValidator(passwordFields)
  .handler(
    async ({
      data,
    }: {
      data: PasswordFieldsValues
    }): Promise<{ success: true } | GeneralError | FieldError> => {
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

        await updateStudentPassword(currentUser.studentID, data)

        return { success: true }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'INVALID_CURRENT_PASSWORD'
        ) {
          return {
            error: {
              type: 'field',
              field: 'currentPassword',
              message: 'Current password is incorrect',
            },
          }
        }

        return {
          error: {
            type: 'general',
            title: 'Update failed',
            description: 'We could not update your password. Please try again.',
          },
        }
      }
    },
  )

export const deleteAccountSettings = createServerFn({ method: 'POST' })
  .inputValidator(deleteAccountField)
  .handler(
    async ({
      data,
    }: {
      data: DeleteAccountFieldValues
    }): Promise<{ success: true } | GeneralError | FieldError> => {
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

        await deleteStudentAccount(currentUser.studentID, data)

        const session = await useAppSession()
        await session.clear()

        return { success: true }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'INVALID_CURRENT_PASSWORD'
        ) {
          return {
            error: {
              type: 'field',
              field: 'currentPassword',
              message: 'Current password is incorrect',
            },
          }
        }

        return {
          error: {
            type: 'general',
            title: 'Delete failed',
            description: 'We could not delete your account. Please try again.',
          },
        }
      }
    },
  )
