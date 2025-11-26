
'use server';

import { redirect } from 'next/navigation';
import { getFirebaseAdmin } from '@/firebase/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/constants';
import { AuthError } from 'firebase/auth';

async function setAuthCookie(token: string) {
    cookies().set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: '/',
    });
}

function mapFirebaseError(error: { code: string }): string {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'This email is already taken. Please sign in.';
        case 'auth/weak-password':
            return 'The password is too weak. Please use at least 6 characters.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}

async function createSession(uid: string) {
  const { auth } = getFirebaseAdmin();
  const sessionCookie = await auth.createSessionCookie(uid, {
    expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
  });
  await setAuthCookie(sessionCookie);
}


export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }
  
  try {
    // The user is authenticated on the client, we just need to create the session
    const { auth } = getFirebaseAdmin();
    // This is a stand-in for client-side token verification, in a real app
    // you'd pass the ID token from the client.
    const user = await auth.getUserByEmail(email);
    
    await createSession(user.uid);
    
  } catch (e: any) {
    return { error: mapFirebaseError(e) };
  }
  
  redirect('/dashboard');
}

export async function handleSignUp(formData: FormData) {
  const { auth } = getFirebaseAdmin();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const userCredential = await auth.createUser({ email, password });
    await createSession(userCredential.uid);
  } catch (error) {
    return { error: mapFirebaseError(error as AuthError) };
  }

  redirect('/dashboard');
}


export async function handleLogout() {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect('/login');
}
