'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { APP_PASSWORD, AUTH_COOKIE_NAME } from '@/lib/constants';

export async function handleLogin(password: string) {
  if (password === APP_PASSWORD) {
    cookies().set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    redirect('/dashboard');
  } else {
    return { error: 'Invalid password' };
  }
}

export async function handleLogout() {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect('/login');
}
