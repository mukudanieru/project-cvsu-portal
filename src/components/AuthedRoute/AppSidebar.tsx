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
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/account">
                <div className="w-6 h-6 md:w-7 md:h-8 drop-shadow-lg">
                  <img
                    src="./logo.png"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-semibold">CvSU Portal</span>
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
