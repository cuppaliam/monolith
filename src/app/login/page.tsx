'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleLogin } from './actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import Logo from '@/components/layout/logo';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Unlock
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    const password = formData.get('password') as string;
    return await handleLogin(password);
  }, undefined);

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
        />
      )}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />

      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center text-primary">
          <Logo className="h-12 w-12" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold">Monolith</h1>
          <p className="text-muted-foreground">Enter the password to access your dashboard.</p>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="h-12 text-center text-lg"
            />
          </div>
          {state?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
