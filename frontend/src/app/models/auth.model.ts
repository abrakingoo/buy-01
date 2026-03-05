export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'SELLER' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'CLIENT' | 'SELLER';
}

export interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
  iat: number;
}
