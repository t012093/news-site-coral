import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthResponse, LoginData, RegisterData, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://news-site-coral-production.up.railway.app/api';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

authAPI.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await refreshAccessToken();
          Cookies.set('auth_token', response.token, { expires: 1 });
          originalRequest.headers.Authorization = `Bearer ${response.token}`;
          return authAPI(originalRequest);
        } catch (refreshError) {
          logout();
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await authAPI.post('/auth/login', data);
      
      // バックエンドのレスポンス構造に合わせる
      const apiResponse = response.data;
      const authResponse: AuthResponse = {
        user: apiResponse.data.user,
        token: apiResponse.data.token,
        refreshToken: apiResponse.data.refreshToken,
      };
      
      const expires = data.rememberMe ? 30 : 1; // 30日 または 1日
      
      Cookies.set('auth_token', authResponse.token, { expires });
      Cookies.set('refresh_token', authResponse.refreshToken, { expires: 30 });
      
      return authResponse;
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || 'ログインに失敗しました';
      throw new Error(errorMessage);
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authAPI.post('/auth/register', data);
      
      // バックエンドのレスポンス構造に合わせる
      const apiResponse = response.data;
      const authResponse: AuthResponse = {
        user: apiResponse.data.user,
        token: apiResponse.data.token,
        refreshToken: apiResponse.data.refreshToken,
      };
      
      Cookies.set('auth_token', authResponse.token, { expires: 1 });
      Cookies.set('refresh_token', authResponse.refreshToken, { expires: 30 });
      
      return authResponse;
    } catch (error: any) {
      console.error('Register error:', error);
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || '登録に失敗しました';
      throw new Error(errorMessage);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await authAPI.get('/auth/me');
      
      // バックエンドのレスポンス構造に合わせる
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await authAPI.put('/auth/profile', data);
      
      // バックエンドのレスポンス構造に合わせる
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || 'プロフィールの更新に失敗しました';
      throw new Error(errorMessage);
    }
  },

  async refreshAccessToken(): Promise<{ token: string }> {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) {
      throw new Error('リフレッシュトークンがありません');
    }
    
    try {
      const response = await authAPI.post('/auth/refresh', {
        refreshToken,
      });
      
      // バックエンドのレスポンス構造に合わせる
      const apiResponse = response.data;
      return {
        token: apiResponse.data.token
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  logout(): void {
    Cookies.remove('auth_token');
    Cookies.remove('refresh_token');
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('auth_token');
  },
};

const refreshAccessToken = authService.refreshAccessToken;
const logout = authService.logout;