export interface User {
  id: string;
  email: string;
  password?: string; // Only used during creation/update
  hashedPassword: string;
  role: 'admin' | 'user';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLoginAt?: string;
  loginCount: number;
  failedLoginAttempts: number;
  lastFailedLoginAt?: string;
}