import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import PasswordInput from '#/components/password-input'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'

import { deleteAccountSettings } from '#/server/settings/settings.functions'
import { deleteAccountField } from '#/lib/schema/settings.schema'
import type {
  DeleteAccountFieldInput,
  DeleteAccountFieldValues,
} from '#/lib/schema/settings.schema'

export const Route = createFileRoute('/_authed/settings/delete')({
  component: DeleteAccountSettings,
})

function DeleteAccountSettings() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountFieldInput, unknown, DeleteAccountFieldValues>({
    resolver: zodResolver(deleteAccountField),
    defaultValues: { currentPassword: '' },
  })

  // Validate first, open the dialog only once the password field is
  // actually filled — keeps a validation error visible on the page
  // instead of surfacing behind an already-closed dialog.
  const handleRequestDelete = handleSubmit(() => {
    setOpen(true)
  })

  const onConfirmDelete = handleSubmit(async (data) => {
    const result = await deleteAccountSettings({ data })

    if ('error' in result) {
      setOpen(false)

      if (result.error.type === 'field') {
        setError(result.error.field, { message: result.error.message })
        return
      }

      toast.error(result.error.title, {
        description: result.error.description,
      })
      return
    }

    toast.success('Account deleted')
    await router.invalidate()
    navigate({ to: '/' })
  })

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6">
          <FieldGroup>
            <Field data-invalid={!!errors.currentPassword}>
              <FieldLabel htmlFor="current-password">
                Current Password
              </FieldLabel>
              <PasswordInput
                id="current-password"
                {...register('currentPassword')}
                aria-invalid={!!errors.currentPassword}
              />
              {errors.currentPassword && (
                <FieldDescription className="text-destructive">
                  {errors.currentPassword.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <Button
            variant="destructive"
            type="button"
            size="lg"
            className="w-full sm:w-auto self-end hover:cursor-pointer"
            disabled={isSubmitting}
            onClick={handleRequestDelete}
          >
            <Trash2 className="size-4" />
            Delete Account
          </Button>
        </form>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all associated
                data — enrollments, grades, and profile information. This cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Cancel
              </AlertDialogCancel>
              <Button
                className="hover:cursor-pointer"
                variant="destructive"
                disabled={isSubmitting}
                onClick={onConfirmDelete}
              >
                {isSubmitting ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Deleting...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
