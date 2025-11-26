
'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';
import Logo from './logo';
import UserNav from './user-nav';

export default function AppNavbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={toggleSidebar}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex items-center gap-2 text-primary flex-1">
        <Logo className="h-7 w-7" />
        <h1 className="text-lg font-heading font-semibold">Monolith</h1>
      </div>
      <UserNav />
    </header>
  );
}
