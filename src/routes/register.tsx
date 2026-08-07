import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import ProjectDisclaimerDialog from '#/components/LoginPage/ProjectDisclaimerDialog'
import IdentityInfoForm from '#/components/RegistrationPage/IdentityInfoForm'
import PersonalInfoForm from '#/components/RegistrationPage/PersonalInfoForm'
import CredentialsInfoForm from '#/components/RegistrationPage/CredentialsInfoForm'
import RegisterSkeleton from '#/components/RegistrationPage/RegisterSkeleton'
import { ModeToggle } from '#/components/mode-toggle'
import {
  registerSchema,
  registerSteps,
  stepFieldMap,
} from '#/lib/schema/register.schema'
import type {
  RegisterFormValues,
  RegisterFormInput,
  RegisterStep,
} from '#/lib/schema/register.schema'

// server fn
import { getCourses } from '#/server/register/register.functions'

const DRAFT_KEY = 'register-draft'

export const Route = createFileRoute('/register')({
  validateSearch: z.object({
    step: z.enum(registerSteps).default('identity'),
  }),
  loader: async () => {
    const result = await getCourses()
    return {
      courses: 'error' in result ? [] : result,
      coursesUnavailable: 'error' in result,
    }
  },
  component: RouteComponent,
})

function loadDraft(): Partial<RegisterFormInput> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function RouteComponent() {
  const { step } = Route.useSearch()
  const { courses, coursesUnavailable } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const stepIndex = registerSteps.indexOf(step)

  const form = useForm<RegisterFormInput, unknown, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      universityEmail: '',
      courseId: undefined,
      sectionId: undefined,
      sex: undefined,
      relationshipStatus: 'single',
      birthday: undefined,
      citizenship: '',
      address: '',
      guardian: '',
      studentNumber: '',
      password: '',
      confirmPassword: '',
    },
  })

  const [isRestoring, setIsRestoring] = useState(true)

  useEffect(() => {
    const draft = loadDraft()
    if (Object.keys(draft).length > 0) form.reset(draft)
    setIsRestoring(false)
  }, [])

  useEffect(() => {
    const subscription = form.watch((values) => {
      const { password, confirmPassword, ...draft } = values
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    })
    return () => subscription.unsubscribe()
  }, [form])

  function goToStep(next: RegisterStep) {
    navigate({ search: (prev) => ({ ...prev, step: next }) })
  }

  async function handleNext() {
    const valid = await form.trigger(stepFieldMap[step])
    if (valid) goToStep(registerSteps[stepIndex + 1])
  }

  function handleBack() {
    if (stepIndex > 0) goToStep(registerSteps[stepIndex - 1])
  }

  async function onSubmit(values: RegisterFormValues) {
    // Server function wiring comes later — placeholder for now
    console.log('submitting', values)

    localStorage.removeItem(DRAFT_KEY)
    navigate({ to: '/' })
  }

  return (
    <div className="flex-1 overflow-hidden flex min-h-dvh justify-center items-center p-0 lg:p-10 bg-black lg:bg-transparent">
      <div className="absolute inset-0 bg-[url(/background.jpg)] bg-cover bg-center blur-[3px] hidden lg:block" />
      <div className="absolute inset-0 bg-background/2 dark:bg-background/20 hidden lg:block" />

      <div className="absolute top-4 right-4 z-50 flex gap-2 justify-center items-center">
        <ProjectDisclaimerDialog />
        <ModeToggle />
      </div>

      {isRestoring ? (
        <RegisterSkeleton />
      ) : (
        <FormProvider {...form}>
          {step === 'identity' && (
            <IdentityInfoForm
              onNext={handleNext}
              courses={courses}
              coursesUnavailable={coursesUnavailable}
            />
          )}
          {step === 'personal' && (
            <PersonalInfoForm onNext={handleNext} onBack={handleBack} />
          )}
          {step === 'credentials' && (
            <CredentialsInfoForm onSubmit={onSubmit} onBack={handleBack} />
          )}
        </FormProvider>
      )}
    </div>
  )
}
