'use server'

import { cookies } from 'next/headers'

export async function logoutAction() {
  const cookieStore = await cookies();
  // This removes the cookie from the browser
  cookieStore.delete('refreshToken');
}