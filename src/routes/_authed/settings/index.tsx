import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  getProfileSettings,
  updateProfileSettings,
} from '#/server/settings/settings.functions'
import { profileFields } from '#/lib/schema/settings.schema'

import type {
  ProfileFieldsInput,
  ProfileFieldsValues,
} from '#/lib/schema/settings.schema'

export const Route = createFileRoute('/_authed/settings/')({
  loader: async () => {
    const profile = await getProfileSettings()

    if ('error' in profile) {
      throw redirect({ to: '/' })
    }

    return profile
  },
  component: ProfileSettings,
})

function ProfileSettings() {
  const profile = Route.useLoaderData()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFieldsInput, unknown, ProfileFieldsValues>({
    resolver: zodResolver(profileFields),
    defaultValues: {
      address: profile.address,
      sex: profile.sex,
      birthday: profile.birthday,
      citizenship: profile.citizenship,
      relationshipStatus: profile.relationshipStatus ?? 'single',
      guardian: profile.guardian ?? '',
    },
  })

  const onSubmit = async (data: ProfileFieldsValues) => {
    const result = await updateProfileSettings({
      data: {
        ...data,
        birthday: data.birthday.toISOString(),
      },
    })

    if ('error' in result) {
      toast.error(result.error.title, {
        description: result.error.description,
      })
      return
    }

    toast.success('Profile updated')
    router.invalidate()
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your address, sex, birthday, citizenship, relationship status,
          and guardian.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6 max-w-2xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor="address">Full Address</FieldLabel>
              <Textarea
                id="address"
                placeholder="123 Main St, Brgy. San Jose..."
                className="resize-none"
                rows={3}
                {...register('address')}
                aria-invalid={!!errors.address}
              />
              {errors.address && (
                <FieldDescription className="text-destructive">
                  {errors.address.message}
                </FieldDescription>
              )}
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.sex}>
                <FieldLabel htmlFor="sex">Sex</FieldLabel>
                <Controller
                  control={control}
                  name="sex"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="sex"
                        className="w-full"
                        aria-invalid={!!errors.sex}
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

              <Field data-invalid={!!errors.birthday}>
                <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
                <Input
                  id="birthday"
                  type="date"
                  {...register('birthday')}
                  aria-invalid={!!errors.birthday}
                />
                {errors.birthday && (
                  <FieldDescription className="text-destructive">
                    {errors.birthday.message}
                  </FieldDescription>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.citizenship}>
                <FieldLabel htmlFor="citizenship">Citizenship</FieldLabel>
                <Input
                  id="citizenship"
                  type="text"
                  placeholder="Filipino"
                  {...register('citizenship')}
                  aria-invalid={!!errors.citizenship}
                />
                {errors.citizenship && (
                  <FieldDescription className="text-destructive">
                    {errors.citizenship.message}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.relationshipStatus}>
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
                        className="w-full"
                        aria-invalid={!!errors.relationshipStatus}
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
            </div>

            <Field data-invalid={!!errors.guardian}>
              <FieldLabel htmlFor="guardian">Guardian Name</FieldLabel>
              <Input
                id="guardian"
                type="text"
                placeholder="Maria Dela Cruz"
                {...register('guardian')}
                aria-invalid={!!errors.guardian}
              />
              {errors.guardian && (
                <FieldDescription className="text-destructive">
                  {errors.guardian.message}
                </FieldDescription>
              )}
            </Field>
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
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
