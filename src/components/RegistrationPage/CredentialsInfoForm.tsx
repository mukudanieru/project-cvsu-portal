import { useFormContext } from 'react-hook-form'
import TitleSection from '../AuthedRoute/TitleSection'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import type {
  RegisterFormInput,
  RegisterFormValues,
} from '#/lib/schema/register.schema'
import PasswordInput from '../password-input'

const CredentialsInfoForm = ({
  onSubmit,
  onBack,
}: {
  onSubmit: (values: RegisterFormValues) => Promise<void>
  onBack: () => void
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterFormInput, unknown, RegisterFormValues>()

  // TODO: replace with a server function returning a real candidate
  // student number (count-based per year, per the earlier plan)
  function handleGenerateStudentNumber() {
    const prefix = '202'
    const randomSuffix = Math.floor(100000 + Math.random() * 900000)
    setValue('studentNumber', `${prefix}${randomSuffix}`, {
      shouldValidate: true,
    })
  }

  return (
    <div className="relative z-10 flex w-full max-w-4xl min-h-dvh flex-col justify-center border-0 bg-card p-6 lg:min-h-fit lg:rounded-xl lg:border lg:p-10 lg:shadow-lg">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
        <div className="flex flex-col gap-2 sm:max-w-xs">
          <TitleSection title="Account Credentials" />
          <p className="text-sm">
            Generate your student number and set a password to complete your
            registration.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-8 lg:w-2/3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field data-invalid={errors.studentNumber ? true : false}>
                  <FieldLabel htmlFor="student-number">
                    Student Number
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="student-number"
                      readOnly
                      placeholder="Generate a number"
                      {...register('studentNumber')}
                      aria-invalid={errors.studentNumber ? true : false}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        variant="secondary"
                        onClick={handleGenerateStudentNumber}
                      >
                        Generate
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription
                    className={errors.studentNumber ? `text-destructive` : ``}
                  >
                    {errors.studentNumber?.message ??
                      'Generate your own student number.'}
                  </FieldDescription>
                </Field>
              </div>

              <Field data-invalid={errors.password ? true : false}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  {...register('password')}
                  aria-invalid={errors.password ? true : false}
                />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={errors.confirmPassword ? true : false}>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <PasswordInput
                  id="confirm-password"
                  {...register('confirmPassword')}
                  aria-invalid={errors.confirmPassword ? true : false}
                />
                {errors.confirmPassword && (
                  <FieldDescription className="text-destructive">
                    {errors.confirmPassword.message}
                  </FieldDescription>
                )}
              </Field>
            </div>
          </FieldGroup>

          <div className="mt-4 flex justify-between">
            <Button
              size={'lg'}
              variant={'outline'}
              type="button"
              onClick={onBack}
            >
              Back
            </Button>
            <Button size={'lg'} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CredentialsInfoForm
