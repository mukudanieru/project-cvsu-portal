import { getAccountInformation } from '#/server/account/account.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/account')({
  loader: async () => {
    const accountInformation = await getAccountInformation()
    return accountInformation
  },

  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
