import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '#/server/auth'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const account = await getCurrentUserFn()

    if (!account) {
      throw redirect({ to: '/' })
    }

    return { account }
  },

  component: AuthedComponent,
})

function AuthedComponent() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
