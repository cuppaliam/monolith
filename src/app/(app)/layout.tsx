'use client';

import { useEffect } from 'react';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        initiateAnonymousSignIn(auth);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen p-4 sm:p-6 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
