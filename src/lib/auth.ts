import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export interface UserSession {
  id: string;
  email: string;
  role: string;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production'
    ) as UserSession;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'Admin') {
    throw new Error('Unauthorized');
  }
  return session;
}
