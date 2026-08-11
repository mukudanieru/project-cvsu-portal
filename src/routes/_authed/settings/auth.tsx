import { createFileRoute } from '@tanstack/react-router'
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
import PasswordInput from '#/components/password-input'
import { Spinner } from '#/components/ui/spinner'
import { Button } from '#/components/ui/button'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { updatePasswordSettings } from '#/server/settings/settings.functions'
import { passwordFields } from '#/lib/schema/settings.schema'
import type {
  PasswordFieldsInput,
  PasswordFieldsValues,
} from '#/lib/schema/settings.schema'

export const Route = createFileRoute('/_authed/settings/auth')({
  component: SecuritySettings,
})

function SecuritySettings() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFieldsInput, unknown, PasswordFieldsValues>({
    resolver: zodResolver(passwordFields),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: PasswordFieldsValues) => {
    const result = await updatePasswordSettings({ data })

    if ('error' in result) {
      if (result.error.type === 'field') {
        setError(result.error.field, { message: result.error.message })
        return
      }

      toast.error(result.error.title, {
        description: result.error.description,
      })
      return
    }

    toast.success('Password changed')
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth</CardTitle>
        <CardDescription>Change your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6 max-w-2xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field data-invalid={errors.currentPassword ? true : false}>
              <FieldLabel htmlFor="current-password">
                Current Password
              </FieldLabel>
              <PasswordInput
                id="current-password"
                {...register('currentPassword')}
                aria-invalid={errors.currentPassword ? true : false}
              />
              {errors.currentPassword && (
                <FieldDescription className="text-destructive">
                  {errors.currentPassword.message}
                </FieldDescription>
              )}
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={errors.newPassword ? true : false}>
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                <PasswordInput
                  id="new-password"
                  {...register('newPassword')}
                  aria-invalid={errors.newPassword ? true : false}
                />
                {errors.newPassword && (
                  <FieldDescription className="text-destructive">
                    {errors.newPassword.message}
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

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto self-end hover:cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                Changing...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Change Password
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
