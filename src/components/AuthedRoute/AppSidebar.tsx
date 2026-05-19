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

import { Link } from '@tanstack/react-router'

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
    url: '/registration_form',
    icon: FileText,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/home">
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
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
