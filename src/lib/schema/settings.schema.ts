import { z } from 'zod'

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

export type ProfileFieldsInput = z.input<typeof profileFields>
export type ProfileFieldsValues = z.infer<typeof profileFields>
