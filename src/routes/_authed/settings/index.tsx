import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import ProfileSkeleton from '#/components/SettingsPage/ProfileSkeleton'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '#/components/ui/spinner'
import { Button } from '#/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Info } from 'lucide-react'
import { toast } from 'sonner'

import {
  getProfileSettings,
  updateProfileSettings,
} from '#/server/settings/settings.functions'
import { settingsFields } from '#/lib/schema/settings.schema'
import type {
  SettingsFieldsInput,
  SettingsFieldsValues,
} from '#/lib/schema/settings.schema'

const termLabels = {
  first: 'First Term',
  second: 'Second Term',
  summer: 'Summer Term',
} as const

export const Route = createFileRoute('/_authed/settings/')({
  loader: async () => {
    const profile = await getProfileSettings()

    if ('error' in profile) {
      throw redirect({ to: '/account' })
    }

    return profile
  },
  pendingComponent: ProfileSkeleton,
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
  } = useForm<SettingsFieldsInput, unknown, SettingsFieldsValues>({
    resolver: zodResolver(settingsFields),
    defaultValues: {
      address: profile.address,
      sex: profile.sex,
      birthday: profile.birthday,
      citizenship: profile.citizenship,
      relationshipStatus: profile.relationshipStatus ?? 'single',
      guardian: profile.guardian ?? '',
      periodId: profile.selectedPeriodId ?? undefined,
    },
  })

  const onSubmit = async (data: SettingsFieldsValues) => {
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

            <Field data-invalid={!!errors.periodId}>
              <FieldLabel htmlFor="periodSelection">
                Period Selection
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
                      By default, the curriculum's final term/semester is
                      selected.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>
              <Controller
                control={control}
                name="periodId"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : undefined}
                    disabled={profile.periodOptions.length === 0}
                  >
                    <SelectTrigger id="periodSelection" className="w-full">
                      <SelectValue
                        placeholder={
                          profile.periodOptions.length === 0
                            ? 'No enrollment history yet'
                            : 'Select a term to display'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {profile.periodOptions.map((period) => (
                        <SelectItem key={period.id} value={String(period.id)}>
                          {termLabels[period.term]} (AC {period.startYear}-
                          {period.endYear})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>
                Feel free to select any term above to explore your past or
                current schedules and subjects. This only controls which term's
                data shows up on your Subjects, Schedules, and Registration Form
                pages - it doesn't change your actual enrollment records.
              </FieldDescription>
              {errors.periodId && (
                <FieldDescription className="text-destructive">
                  {errors.periodId.message}
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
