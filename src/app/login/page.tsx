
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { handleLogin, handleSignUp } from './actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import Logo from '@/components/layout/logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

function SubmitButton({ isSignUp, isPending }: { isSignUp?: boolean, isPending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isSignUp ? 'Sign Up' : 'Sign In'}
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
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Let the server handle cookie setting via form action
        const result = await handleLogin(formData);
        if (result?.error) {
            setError(result.error);
        } else {
           router.push('/dashboard');
        }
    } catch(e: any) {
        setError('Invalid email or password.');
    } finally {
        setIsPending(false);
    }
  };
  
  const clientSignUp = async (formData: FormData) => {
    setIsPending(true);
    setError(undefined);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Let server action create the user in Admin SDK and set cookie
      const result = await handleSignUp(formData);
       if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError('This email is already taken. Please sign in.');
      } else if (e.code === 'auth/weak-password') {
        setError('The password is too weak. Please use at least 6 characters.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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

      <Tabs defaultValue="signin" className="w-full max-w-sm">
        <div className="flex justify-center mb-6 text-primary">
            <Logo className="h-12 w-12" />
        </div>
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={clientLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-signin">Email</Label>
                            <Input id="email-signin" name="email" type="email" placeholder="user@example.com" required defaultValue="user@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-signin">Password</Label>
                            <Input id="password-signin" name="password" type="password" required defaultValue="Aperio"/>
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
        </TabsContent>
        <TabsContent value="signup">
            <Card>
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create a new account to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={clientSignUp} className="space-y-4">
                        <div className="space-y-2">
                             <Label htmlFor="email-signup">Email</Label>
                            <Input id="email-signup" name="email" type="email" placeholder="user@example.com" required />
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="password-signup">Password</Label>
                            <Input id="password-signup" name="password" type="password" required />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Sign-up Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <SubmitButton isSignUp isPending={isPending} />
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
