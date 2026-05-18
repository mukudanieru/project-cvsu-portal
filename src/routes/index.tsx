import { createFileRoute, useRouter } from '@tanstack/react-router'
import LoginPage from '#/components/LoginPage'
import { Button } from '#/components/ui/button'
import { getCurrentUserFn, logoutFn } from '#/server/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const user = await getCurrentUserFn()

    return { user }
  },

  component: App,
})

function App() {
  const { user } = Route.useRouteContext()
  const router = useRouter()

  async function handleLogout() {
    await logoutFn()
    router.invalidate()
  }

  async function handleLoginSucess() {
    await router.invalidate()
  }

  if (user) {
    return (
      <main className="relative min-h-screen">
        <h1>Welcome, {user.universityEmail}!</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-6 md:p-10">
      <LoginPage onSuccess={handleLoginSucess} />
    </main>
  )
}
