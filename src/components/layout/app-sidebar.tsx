'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Clock,
  ListTodo,
  Repeat,
  BarChart3,
  Settings,
  PanelLeft,
  Notebook,
} from 'lucide-react';
import Logo from './logo';
import UserNav from './user-nav';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/time', icon: Clock, label: 'Time' },
  { href: '/tasks', icon: ListTodo, label: 'Tasks' },
  { href: '/habits', icon: Repeat, label: 'Habits' },
  { href: '/notes', icon: Notebook, label: 'Notes' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {state === 'expanded' ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-primary">
              <Logo />
            </Button>
            <h1 className="text-lg font-heading font-semibold">Monolith</h1>
            <div className="grow" />
            <SidebarTrigger className="hidden md:flex" />
          </div>
        ) : (
          <SidebarMenuButton
            size="lg"
            className="h-10 w-10"
            onClick={toggleSidebar}
            tooltip="Toggle Sidebar"
          >
            <PanelLeft />
          </SidebarMenuButton>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                  size="lg"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter className="hidden md:flex flex-col gap-4 p-2">
         <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/settings" passHref>
                    <SidebarMenuButton
                      isActive={pathname.startsWith('/settings')}
                      tooltip="Settings"
                      size="lg"
                    >
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="group-data-[state=expanded]:p-2">
            <UserNav />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
