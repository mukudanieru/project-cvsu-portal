import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '#/components/LoginPage'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-6 md:p-10">
      <LoginPage />
    </main>
  )
}
