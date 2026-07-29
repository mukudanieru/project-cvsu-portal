import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMain } from './NavMain'
import {
  CircleUserRound,
  Book,
  Calendar,
  Captions,
  FileText,
} from 'lucide-react'
import AlertDestructive from '@/components/ErrorComponents/ErrorMessage'

import { Link } from '@tanstack/react-router'
import { NavUser } from './NavUser'

const navMain = [
  {
    title: 'Account',
    url: '/account',
    icon: CircleUserRound,
  },
  {
    title: 'Subjects',
    url: '/subjects',
    icon: Book,
  },
  {
    title: 'Schedules',
    url: '/schedules',
    icon: Calendar,
  },
  {
    title: 'Grades',
    url: '/grades',
    icon: Captions,
  },
  {
    title: 'Virtual Reg Form',
    url: '/registration-form',
    icon: FileText,
  },
]

type User = {
  name: string
  studentNumber: string
  avatar: string
}

type NavUserProps = {
  user: User | null
  error: { title: string; description: string } | null
  handleLogout: () => Promise<void>
}

export function AppSidebar({ user, error, handleLogout }: NavUserProps) {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-2! h-auto"
            >
              <Link to="/account" className="flex items-center gap-2.5">
                <div className="w-10 h-10">
                  <img
                    src="/logo.png"
                    alt="CvSU seal"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-primary text-base font-semibold leading-tight">
                    Cavite State University
                  </span>
                  <span className="text-amber-600/90 text-xs leading-tight">
                    Truth • Excellence • Service
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {error ? (
          <div className="p-4">
            <AlertDestructive {...error} />
          </div>
        ) : (
          <NavMain items={navMain} />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} handleLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
