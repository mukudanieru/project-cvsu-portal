import { Controller, useFormContext } from 'react-hook-form'
import TitleSection from '../AuthedRoute/TitleSection'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type {
  RegisterFormInput,
  RegisterFormValues,
} from '#/lib/schema/register.schema'

const PersonalInfoForm = ({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegisterFormInput, unknown, RegisterFormValues>()

  return (
    <div className="relative z-10 flex w-full max-w-4xl min-h-dvh flex-col justify-center border-0 bg-card p-6 lg:min-h-fit lg:rounded-xl lg:border lg:p-10 lg:shadow-lg">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
        <div className="flex flex-col gap-2 sm:max-w-xs">
          <TitleSection title="Personal Information" />
          <p className="text-sm">
            Provide your demographic details, permanent address, and guardian
            information.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-8 lg:w-2/3"
          // onSubmit={(e) => {
          //   e.preventDefault()
          //   onNext()
          // }}
        >
          <FieldGroup>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field data-invalid={errors.sex ? true : false}>
                <FieldLabel htmlFor="sex">Sex</FieldLabel>
                <Controller
                  control={control}
                  name="sex"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="sex"
                        aria-invalid={errors.sex ? true : false}
                      >
                        <SelectValue placeholder="Select a sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.sex && (
                  <FieldDescription className="text-destructive">
                    {errors.sex.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={errors.relationshipStatus ? true : false}>
                <FieldLabel htmlFor="relationship-status">
                  Relationship Status
                </FieldLabel>
                <Controller
                  control={control}
                  name="relationshipStatus"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="relationship-status"
                        aria-invalid={errors.relationshipStatus ? true : false}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="in_relationship">
                          In a relationship
                        </SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.relationshipStatus && (
                  <FieldDescription className="text-destructive">
                    {errors.relationshipStatus.message}
                  </FieldDescription>
                )}
              </Field>

              <div className="sm:col-span-2">
                <Field data-invalid={errors.birthday ? true : false}>
                  <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
                  <Input
                    id="birthday"
                    type="date"
                    {...register('birthday')}
                    aria-invalid={errors.birthday ? true : false}
                  />
                  {errors.birthday && (
                    <FieldDescription className="text-destructive">
                      {errors.birthday.message}
                    </FieldDescription>
                  )}
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field data-invalid={errors.address ? true : false}>
                  <FieldLabel htmlFor="address">Full Address</FieldLabel>
                  <Textarea
                    id="address"
                    placeholder="123 Main St, Brgy. San Jose..."
                    className="resize-none"
                    rows={3}
                    {...register('address')}
                    aria-invalid={errors.address ? true : false}
                  />
                  {errors.address && (
                    <FieldDescription className="text-destructive">
                      {errors.address.message}
                    </FieldDescription>
                  )}
                </Field>
              </div>

              <Field data-invalid={errors.citizenship ? true : false}>
                <FieldLabel htmlFor="citizenship">Citizenship</FieldLabel>
                <Input
                  id="citizenship"
                  type="text"
                  placeholder="Filipino"
                  {...register('citizenship')}
                  aria-invalid={errors.citizenship ? true : false}
                />
                {errors.citizenship && (
                  <FieldDescription className="text-destructive">
                    {errors.citizenship.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={errors.guardian ? true : false}>
                <FieldLabel htmlFor="guardian">Guardian Name</FieldLabel>
                <Input
                  id="guardian"
                  type="text"
                  placeholder="Maria Dela Cruz"
                  {...register('guardian')}
                  aria-invalid={errors.guardian ? true : false}
                />
                {errors.guardian && (
                  <FieldDescription className="text-destructive">
                    {errors.guardian.message}
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
            <Button size={'lg'} type="button" onClick={onNext}>
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfoForm
