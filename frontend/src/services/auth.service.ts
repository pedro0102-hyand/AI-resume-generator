import api from './api';
import type { AuthTokens } from '../types';

export const authService = {
  async register(email: string, password: string): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/register', {
      email,
      password,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/login-json', {
      email,
      password,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  },
};
