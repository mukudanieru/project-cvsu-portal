import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ModeToggle } from '.././mode-toggle'
import { Spinner } from '@/components/ui/spinner'
import AlertDestructive from './ErrorMessage'
import type { AlertDestructiveProps } from './ErrorMessage'

import { useState } from 'react'
import { loginFn } from '#/server/auth/auth.functions'

type Props = {
  onSuccess?: () => void | Promise<void>
}

const LoginPage = ({ onSuccess }: Props) => {
  const [studentNumber, setStudentNumber] = useState('')
  const [password, setPassword] = useState('')
  const [studentNumberError, setStudentNumberError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [error, setError] = useState<AlertDestructiveProps | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.SubmitEvent) {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const result = await loginFn({
      data: { studentNumber, password },
    })

    if (result.error) {
      setError(result.error)

      if (result.error.description === 'Student number not found.') {
        setStudentNumberError(true)
      }

      setPasswordError(true)
    } else {
      await onSuccess?.()
    }

    setLoading(false)
  }

  return (
    <>
      <div className="absolute inset-0 bg-[url(/background.jpg)] bg-cover bg-center blur-[3px]" />
      <div className="absolute inset-0 bg-white/20 dark:bg-black/20" />

      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <Card className="relative z-10 w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-14 h-14 md:w-16 md:h-16 drop-shadow-lg">
              <img src="./logo.png" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-start md:items-start">
              <div className="text-primary text-sm sm:text-lg md:text-xl font-semibold">
                Cavite State University
              </div>
              <div className="text-amber-600/90 text-xs sm:text-sm md:text-base">
                Truth • Excellence • Service
              </div>
            </div>
          </div>

          <div className="text-center flex flex-col gap-1">
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Don't let your grades define you</CardDescription>
          </div>

          {error && <AlertDestructive {...error} />}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field data-invalid={studentNumberError}>
                <FieldLabel htmlFor="studentNumber">Student Number</FieldLabel>

                <Input
                  aria-invalid={studentNumberError}
                  id="studentNumber"
                  name="studentNumber"
                  type="text"
                  placeholder="2********"
                  required
                  onChange={(e) => {
                    setStudentNumber(e.target.value)
                    setStudentNumberError(false)
                    setPasswordError(false)
                  }}
                />
              </Field>
              <Field data-invalid={passwordError}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  aria-invalid={passwordError}
                  id="password"
                  type="password"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError(false)
                  }}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner data-icon="inline-start" /> : 'Login'}
                </Button>
                <FieldDescription className="text-center">
                  Having issues with your account?{' '}
                  <a
                    className="hover:text-foreground! transition-colors"
                    href="#"
                  >
                    Get assistance
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default LoginPage
