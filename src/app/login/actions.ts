
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, APP_PASSWORD } from '@/lib/constants';

async function setAuthCookie() {
    cookies().set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
}


export async function handleLogin(formData: FormData) {
  const password = formData.get('password') as string;

  if (password !== APP_PASSWORD) {
    return { error: 'Invalid password.' };
  }
  
  await setAuthCookie();
  
  // The redirect will be handled on the client-side after anonymous sign-in
}

export async function handleLogout() {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect('/login');
}
