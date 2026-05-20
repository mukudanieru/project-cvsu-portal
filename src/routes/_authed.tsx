import { AppSidebar } from '@/components/AuthedRoute/AppSidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/mode-toggle'

import {
  createFileRoute,
  Outlet,
  useRouter,
  redirect,
} from '@tanstack/react-router'
import { getCurrentUserFn, logoutFn } from '#/server/auth/auth.functions'
import { getNavInformation } from '#/server/account/account.functions'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const account = await getCurrentUserFn()

    if (!account) {
      throw redirect({ to: '/' })
    }

    return { account }
  },

  loader: async () => {
    const navInformation = await getNavInformation()

    return {
      name: navInformation.fullName,
      studentNumber: navInformation.studentNumber,
      avatar: 'https://github.com/shadcn.png',
    }
  },

  component: AuthedComponent,
})

function AuthedComponent() {
  const router = useRouter()
  const user = Route.useLoaderData()

  async function handleLogout() {
    await logoutFn()
    await router.invalidate()
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} handleLogout={handleLogout} />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 h-6">
            <SidebarTrigger size="icon-lg" className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-full" />
          </div>

          <div className="flex items-center gap-2 px-4 h-6">
            <ModeToggle />
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
