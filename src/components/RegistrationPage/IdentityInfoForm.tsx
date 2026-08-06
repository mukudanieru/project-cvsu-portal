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
import type {
  RegisterFormInput,
  RegisterFormValues,
} from '#/lib/schema/register.schema'

const IdentityInfoForm = ({ onNext }: { onNext: () => void }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegisterFormInput, unknown, RegisterFormValues>()

  return (
    <div className="relative z-10 flex w-full max-w-4xl min-h-dvh flex-col justify-center border-0 bg-card p-6 lg:min-h-fit lg:rounded-xl lg:border lg:p-10 lg:shadow-lg">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
        <div className="flex flex-col gap-2 sm:max-w-xs">
          <TitleSection title="Identity Information" />
          <p className="text-sm">
            Enter your name, university email, and your target course and
            section to set up your simulated student profile.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-8 lg:w-2/3"
          // onSubmit={(e) => {
          //   e.preventDefault()
          //   onNext()
          // }}
        >
          <FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field data-invalid={errors.firstName ? true : false}>
              <FieldLabel htmlFor="first-name">
                First Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="first-name"
                type="text"
                placeholder="Juan"
                aria-invalid={errors.firstName ? true : false}
                {...register('firstName')}
              />
              {errors.firstName && (
                <FieldDescription className="text-destructive">
                  {errors.firstName.message}
                </FieldDescription>
              )}
            </Field>

            <Field data-invalid={errors.lastName ? true : false}>
              <FieldLabel htmlFor="last-name">
                Last Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="last-name"
                type="text"
                placeholder="Dela Cruz"
                aria-invalid={errors.lastName ? true : false}
                {...register('lastName')}
              />
              {errors.lastName && (
                <FieldDescription className="text-destructive">
                  {errors.lastName.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="middle-name">Middle Name</FieldLabel>
              <Input
                id="middle-name"
                type="text"
                placeholder="Rizal"
                {...register('middleName')}
              />
            </Field>

            <Field data-invalid={errors.universityEmail ? true : false}>
              <FieldLabel htmlFor="university-email">
                University Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="university-email"
                type="email"
                placeholder="juan.delacruz@email.edu.ph"
                aria-invalid={errors.universityEmail ? true : false}
                {...register('universityEmail')}
              />
              {errors.universityEmail && (
                <FieldDescription className="text-destructive">
                  {errors.universityEmail.message}
                </FieldDescription>
              )}
            </Field>

            <Field data-invalid={errors.courseId ? true : false}>
              <FieldLabel htmlFor="course">
                Course <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="courseId"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger
                      id="course"
                      aria-invalid={errors.courseId ? true : false}
                    >
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* placeholder — swap for real seeded courses via a loader */}
                      <SelectItem value="1">BS Computer Science</SelectItem>
                      <SelectItem value="2">
                        BS Information Technology
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.courseId && (
                <FieldDescription className="text-destructive">
                  {errors.courseId.message}
                </FieldDescription>
              )}
            </Field>

            <Field data-invalid={errors.sectionId ? true : false}>
              <FieldLabel htmlFor="section">
                Section <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="sectionId"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger
                      id="section"
                      aria-invalid={errors.sectionId ? true : false}
                    >
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* placeholder — should filter by selected courseId */}
                      <SelectItem value="1">BSCS 1</SelectItem>
                      <SelectItem value="2">BSCS 2</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sectionId && (
                <FieldDescription className="text-destructive">
                  {errors.sectionId.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <div className="mt-4 flex justify-end">
            <Button size={'lg'} type="button" onClick={onNext}>
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IdentityInfoForm
