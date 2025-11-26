
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import { handleLogout } from '@/app/login/actions';
import { useUser } from '@/firebase';
import { useSidebar } from '../ui/sidebar';

export default function UserNav() {
  const { user } = useUser();
  const { state } = useSidebar();

  const getInitials = () => 'A';
  
  if (state === 'collapsed') {
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                Admin
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                monolith-user
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleLogout()}>
            <LogOut className="mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">
             Admin
            </p>
             <p className="text-xs text-muted-foreground truncate">
              monolith-user
            </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLogout()}>
            <LogOut />
        </Button>
    </div>
  );
}
