import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
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
import { Input } from '#/components/ui/input'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-6 md:p-10">
      <div className="absolute inset-0 bg-[url(/background.jpg)] bg-cover bg-center blur-sm" />
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30" />

      <Card className="relative z-10 w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-14 h-14 md:w-16 md:h-16 drop-shadow-lg">
              <img src="./logo.png" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-start md:items-start">
              <div className="text-green-700 text-sm sm:text-lg md:text-xl font-semibold">
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
        </CardHeader>

        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="studentNumber">Student Number</FieldLabel>

                <Input
                  id="studentNumber"
                  name="studentNumber"
                  type="text"
                  placeholder="2********"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Having issues with your account?{' '}
                  <a href="#">Get assistance</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
