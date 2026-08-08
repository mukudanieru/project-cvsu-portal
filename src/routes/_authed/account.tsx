import AccountCard from '@/components/AccountPage/AccountCard'

import { getAccountInformation } from '#/server/account/account.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Pencil, UserPlus } from 'lucide-react'

export const Route = createFileRoute('/_authed/account')({
  loader: async () => {
    const accountInformation = await getAccountInformation()

    if ('error' in accountInformation) {
      throw redirect({
        to: '/',
      })
    }

    return accountInformation
  },

  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <AccountCard student={data} />

      <div className="w-full max-w-2xl flex justify-end gap-2">
        <Button className="gap-2" size={'lg'} variant="outline">
          <Pencil className="size-3" />
          Edit
        </Button>
        <Button className="gap-2" size={'lg'}>
          <UserPlus className="size-3" />
          Enroll
        </Button>
      </div>
    </div>
  )
}
