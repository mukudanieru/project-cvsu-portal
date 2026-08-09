import { useEffect, useState } from 'react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type {
  RegisterFormInput,
  RegisterFormValues,
} from '#/lib/schema/register.schema'

// server fn
import { getSectionsByCourseId } from '#/server/register/register.functions'
import { Info } from 'lucide-react'

type Course = { id: number; courseName: string }
type Section = {
  sectionId: number
  courseCode: string
  yearLevel: number
  sectionNumber: number
}

const IdentityInfoForm = ({
  onNext,
  courses,
  coursesUnavailable,
}: {
  onNext: () => void
  courses: Course[]
  coursesUnavailable: boolean
}) => {
  const {
    register,
    control,
    watch,
    resetField,
    formState: { errors },
  } = useFormContext<RegisterFormInput, unknown, RegisterFormValues>()

  const courseId = watch('courseId')

  const [sections, setSections] = useState<Section[]>([])
  const [sectionsLoading, setSectionsLoading] = useState(false)
  const [sectionsUnavailable, setSectionsUnavailable] = useState(false)

  const noSectionsForCourse =
    !!courseId &&
    !sectionsLoading &&
    !sectionsUnavailable &&
    sections.length === 0

  useEffect(() => {
    if (!courseId) {
      setSections([])
      return
    }

    resetField('sectionId')
    setSectionsLoading(true)
    setSectionsUnavailable(false)

    getSectionsByCourseId({ data: { courseId: Number(courseId) } })
      .then((result) => {
        if ('error' in result) {
          setSectionsUnavailable(true)
          setSections([])
        } else {
          setSections(result)
        }
      })
      .catch(() => {
        setSectionsUnavailable(true)
        setSections([])
      })
      .finally(() => setSectionsLoading(false))
  }, [courseId])

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

        <form className="flex w-full flex-col gap-8 lg:w-2/3">
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
                    disabled={coursesUnavailable}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger
                      id="course"
                      aria-invalid={errors.courseId ? true : false}
                    >
                      <SelectValue
                        placeholder={
                          coursesUnavailable
                            ? 'No courses available'
                            : 'Select a course'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={String(course.id)}>
                          {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {coursesUnavailable ? (
                <FieldDescription className="text-destructive">
                  Courses couldn't be loaded. Try refreshing the page.
                </FieldDescription>
              ) : (
                errors.courseId && (
                  <FieldDescription className="text-destructive">
                    {errors.courseId.message}
                  </FieldDescription>
                )
              )}
            </Field>

            <Field data-invalid={errors.sectionId ? true : false}>
              <FieldLabel
                htmlFor="section"
                className="flex items-center gap-1.5"
              >
                Section <span className="text-destructive">*</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Section enrollment info"
                    >
                      <Info size={12} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-56 text-xs">
                      You will be enrolled in the most advanced year level of
                      the selected section.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>
              <Controller
                control={control}
                name="sectionId"
                render={({ field }) => (
                  <Select
                    disabled={
                      !courseId ||
                      sectionsLoading ||
                      sectionsUnavailable ||
                      noSectionsForCourse
                    }
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger
                      id="section"
                      aria-invalid={errors.sectionId ? true : false}
                    >
                      <SelectValue
                        placeholder={
                          !courseId
                            ? 'Select a course first'
                            : sectionsLoading
                              ? 'Loading sections…'
                              : sectionsUnavailable
                                ? 'No sections available'
                                : noSectionsForCourse
                                  ? 'No sections for this course'
                                  : 'Select a section'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem
                          key={section.sectionId}
                          value={String(section.sectionId)}
                        >
                          {`${section.courseCode} ${section.yearLevel}-${section.sectionNumber}`}
                        </SelectItem>
                      ))}
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
            <Button
              size={'lg'}
              type="button"
              onClick={onNext}
              disabled={coursesUnavailable}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IdentityInfoForm
