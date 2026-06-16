import AccountCard from '@/components/AccountPage/AccountCard'

import { getAccountInformation } from '#/server/account/account.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'

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
    <>
      <AccountCard student={data} />
    </>
  )
}
