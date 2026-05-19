import { createFileRoute, useRouter, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '@/server/auth'
import LoginPage from '@/components/LoginPage/LoginPage'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const account = await getCurrentUserFn()

    if (account) {
      throw redirect({ to: '/home' })
    }
  },

  component: App,
})

function App() {
  const router = useRouter()

  async function handleLoginSucess() {
    await router.invalidate()
  }

  return (
    <main className="relative flex-1 overflow-hidden flex items-center justify-center p-6 md:p-10">
      <LoginPage onSuccess={handleLoginSucess} />
    </main>
  )
}
