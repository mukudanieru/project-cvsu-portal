import { z } from 'zod'

const identityFields = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  universityEmail: z.email({ error: 'Enter a valid email address' }),
  courseId: z.coerce
    .number({ error: 'Select a course' })
    .int()
    .positive('Select a course'),
  sectionId: z.coerce
    .number({ error: 'Select a section' })
    .int()
    .positive('Select a section'),
})

const personalFields = z.object({
  sex: z.enum(['male', 'female'], { error: 'Select a sex' }),
  relationshipStatus: z
    .enum(['single', 'in_relationship', 'married'], {
      error: 'Relationship status is required',
    })
    .default('single'),
  birthday: z
    .string({ error: 'Birthday is required' })
    .min(1, 'Birthday is required')
    .pipe(z.coerce.date()),
  citizenship: z.string().min(1, 'Citizenship is required'),
  address: z.string().min(1, 'Address is required'),
  guardian: z.string().min(1, 'Guardian name is required'),
})

const credentialFields = z.object({
  studentNumber: z.string().min(1, 'Generate a student number'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
})

export const registerSchema = z
  .object({
    ...identityFields.shape,
    ...personalFields.shape,
    ...credentialFields.shape,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: "Passwords don't match",
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterFormValues = z.infer<typeof registerSchema> // output: courseId: number, birthday: Date, ...
export type RegisterFormInput = z.input<typeof registerSchema> // input: courseId: unknown, birthday: unknown, ...

export const registerSteps = ['identity', 'personal', 'credentials'] as const

export type RegisterStep = (typeof registerSteps)[number]

export const stepFieldMap: Record<RegisterStep, (keyof RegisterFormValues)[]> =
  {
    identity: [
      'firstName',
      'lastName',
      'middleName',
      'universityEmail',
      'courseId',
      'sectionId',
    ],
    personal: [
      'sex',
      'relationshipStatus',
      'birthday',
      'citizenship',
      'address',
      'guardian',
    ],
    credentials: ['studentNumber', 'password', 'confirmPassword'],
  }
