import { Link, useRouterState } from "@tanstack/react-router"
import {
  CalendarDaysIcon,
  CalendarPlusIcon,
  ClockIcon,
  StethoscopeIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"
import type { ComponentType } from "react"
import { useTranslation } from "react-i18next"

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { UserMenu } from "@/components/layout/UserMenu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { Role } from "@/api/types"
import type { AuthUser } from "@/lib/auth"

interface NavItem {
  to: string
  labelKey: string
  icon: ComponentType
}


const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  PATIENT: [
    {
      to: "/patient/book-appointment",
      labelKey: "nav.bookAppointment",
      icon: CalendarPlusIcon,
    },
    {
      to: "/patient/appointments",
      labelKey: "nav.myAppointments",
      icon: CalendarDaysIcon,
    },
  ],
  DOCTOR: [
    {
      to: "/doctor/timeslots",
      labelKey: "nav.generateTimeslots",
      icon: ClockIcon,
    },
    {
      to: "/doctor/appointments",
      labelKey: "nav.appointments",
      icon: CalendarDaysIcon,
    },
  ],
  ADMIN: [
    { to: "/admin/doctors", labelKey: "nav.doctors", icon: UsersIcon },
    { to: "/admin/doctors/new", labelKey: "nav.newDoctor", icon: UserPlusIcon },
  ],
}

export function AppSidebar({ user }: { user: AuthUser }) {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link to="/" />}
            >
              <StethoscopeIcon className="size-5!" />
              <span className="text-base font-semibold">{t("app.name")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_BY_ROLE[user.role].map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    isActive={pathname === item.to}
                    render={<Link to={item.to} />}
                  >
                    <item.icon />
                    <span>{t(item.labelKey)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-start px-2">
          <LanguageSwitcher />
        </div>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
