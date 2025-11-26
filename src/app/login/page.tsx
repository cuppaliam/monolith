
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { handleLogin } from './actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import Logo from '@/components/layout/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useRouter } from 'next/navigation';

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Sign In
    </Button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const clientLogin = async (formData: FormData) => {
    setIsPending(true);
    setError(undefined);
    
    // First, verify the password on the server
    const result = await handleLogin(formData);

    if (result?.error) {
        setError(result.error);
        setIsPending(false);
        return;
    }

    try {
        // If password is correct, sign in anonymously on the client
        await signInAnonymously(auth);
        // Then redirect
        router.push('/dashboard');
    } catch(e: any) {
        setError('An unexpected error occurred during login.');
    } finally {
        setIsPending(false);
    }
  };
  
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-background');

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {loginBg && (
        <Image
          src={loginBg.imageUrl}
          alt={loginBg.description}
          fill
          className="object-cover -z-10"
          data-ai-hint={loginBg.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />

      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6 text-primary">
            <Logo className="h-12 w-12" />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Welcome to Monolith</CardTitle>
                <CardDescription>Enter the password to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={clientLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password-signin">Password</Label>
                        <Input id="password-signin" name="password" type="password" required />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Access Denied</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <SubmitButton isPending={isPending} />
                </form>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
