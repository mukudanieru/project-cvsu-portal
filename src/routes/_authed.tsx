import { AppSidebar } from '@/components/AuthedRoute/AppSidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '@/server/auth'

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 h-6">
            <SidebarTrigger size="icon-lg" className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-full" />
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
