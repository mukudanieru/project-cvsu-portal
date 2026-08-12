import { z } from 'zod'

// Profile tab
export const profileFields = z.object({
  address: z.string().min(1, 'Address is required'),
  sex: z.enum(['male', 'female'], { error: 'Select a sex' }),
  birthday: z
    .string({ error: 'Birthday is required' })
    .min(1, 'Birthday is required')
    .pipe(z.coerce.date()),
  citizenship: z.string().min(1, 'Citizenship is required'),
  relationshipStatus: z.enum(['single', 'in_relationship', 'married'], {
    error: 'Relationship status is required',
  }),
  guardian: z.string().min(1, 'Guardian name is required'),
})

export const periodSelectionField = z.object({
  // Optional: a never-enrolled student has no periods to pick from yet.
  periodId: z.coerce.number().int().positive().optional(),
})

export const settingsFields = z.object({
  ...profileFields.shape,
  ...periodSelectionField.shape,
})

export type SettingsFieldsInput = z.input<typeof settingsFields>
export type SettingsFieldsValues = z.infer<typeof settingsFields>

// Auth tab
export const passwordFields = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type PasswordFieldsInput = z.input<typeof passwordFields>
export type PasswordFieldsValues = z.infer<typeof passwordFields>

// Delete tab
export const deleteAccountField = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
})

export type DeleteAccountFieldInput = z.input<typeof deleteAccountField>
export type DeleteAccountFieldValues = z.infer<typeof deleteAccountField>
