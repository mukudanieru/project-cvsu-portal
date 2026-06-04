import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = Route.useRouteContext()

  return (
    <div className="">
      <h1>Welcome, {account}!</h1>
    </div>
  )
}
