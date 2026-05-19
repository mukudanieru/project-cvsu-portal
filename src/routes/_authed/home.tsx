import { createFileRoute, useRouter } from '@tanstack/react-router'
import { logoutFn } from '#/server/auth'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authed/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = Route.useRouteContext()
  const router = useRouter()

  async function handleLogout() {
    await logoutFn()
    await router.invalidate()
  }

  return (
    <div className="">
      <h1>Welcome, {account.universityEmail}!</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}
