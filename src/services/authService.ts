import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthResponse, LoginData, RegisterData, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
      const response = await authAPI.post<AuthResponse>('/auth/login', data);
      
      const { token, refreshToken } = response.data;
      const expires = data.rememberMe ? 30 : 1; // 30日 または 1日
      
      Cookies.set('auth_token', token, { expires });
      Cookies.set('refresh_token', refreshToken, { expires: 30 });
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // モックデータでのログイン処理（開発用）
      if (data.email === 'demo@coral.com' && data.password === 'demo123') {
        const mockResponse: AuthResponse = {
          user: {
            id: '1',
            email: 'demo@coral.com',
            username: 'demo_user',
            displayName: 'デモユーザー',
            avatar: '/images/man.png',
            bio: 'CORALコミュニティのデモユーザーです',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: true,
            preferences: {
              notifications: {
                eventReminders: true,
                newsletter: true,
                eventRecommendations: true,
              },
              privacy: {
                showProfile: true,
                showEventHistory: true,
              },
            },
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        };
        
        Cookies.set('auth_token', mockResponse.token, { expires: data.rememberMe ? 30 : 1 });
        Cookies.set('refresh_token', mockResponse.refreshToken, { expires: 30 });
        
        return mockResponse;
      }
      
      throw new Error(error.response?.data?.message || 'ログインに失敗しました');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authAPI.post<AuthResponse>('/auth/register', data);
      
      const { token, refreshToken } = response.data;
      Cookies.set('auth_token', token, { expires: 1 });
      Cookies.set('refresh_token', refreshToken, { expires: 30 });
      
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      
      // モックデータでの登録処理（開発用）
      const mockResponse: AuthResponse = {
        user: {
          id: Date.now().toString(),
          email: data.email,
          username: data.username,
          displayName: data.displayName,
          avatar: '/images/she.png',
          bio: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: false,
          preferences: {
            notifications: {
              eventReminders: true,
              newsletter: true,
              eventRecommendations: true,
            },
            privacy: {
              showProfile: true,
              showEventHistory: true,
            },
          },
        },
        token: 'mock-jwt-token-new',
        refreshToken: 'mock-refresh-token-new',
      };
      
      Cookies.set('auth_token', mockResponse.token, { expires: 1 });
      Cookies.set('refresh_token', mockResponse.refreshToken, { expires: 30 });
      
      return mockResponse;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await authAPI.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      
      // モックユーザーデータを返す（開発用）
      const token = Cookies.get('auth_token');
      if (token === 'mock-jwt-token') {
        return {
          id: '1',
          email: 'demo@coral.com',
          username: 'demo_user',
          displayName: 'デモユーザー',
          avatar: '/images/man.png',
          bio: 'CORALコミュニティのデモユーザーです',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: true,
          preferences: {
            notifications: {
              eventReminders: true,
              newsletter: true,
              eventRecommendations: true,
            },
            privacy: {
              showProfile: true,
              showEventHistory: true,
            },
          },
        };
      }
      
      throw error;
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await authAPI.put<User>('/auth/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('プロフィールの更新に失敗しました');
    }
  },

  async refreshAccessToken(): Promise<{ token: string }> {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) {
      throw new Error('リフレッシュトークンがありません');
    }
    
    try {
      const response = await authAPI.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });
      return response.data;
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