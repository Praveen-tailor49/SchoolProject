import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.88.154.67:9000/api/school-admin'; // Updated to use correct port 9000

export interface LoginRequest {
  user_email: string;
  user_password: string;
}

export interface SignupRequest {
  user_email: string;
  user_password: string;
  full_name: string;
  school_name: string;
  created_at: Date;
}

export interface AuthResponse {
  token: string;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    school_name: string;
  };
}

export interface DashboardStats {
  totalClasses: number;
  totalSections: number;
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  promotedStudents: number;
  totalInquiries: number;
  activeInquiries: number;
  transferredOut: number;
  transferredIn: number;
  totalAdmins: number;
  totalRoles: number;
  totalStaff: number;
  activeStaff: number;
  totalBooks: number;
  libraryCards: number;
  booksIssued: number;
  returnPending: number;
  publishedTimetables: number;
  publishedAdmitCards: number;
  publishedResults: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      this.token = token;
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  private async removeToken() {
    try {
      this.token = null;
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    customBaseUrl?: string
  ): Promise<{ data: T; status: number }> {
    const baseUrl = customBaseUrl || API_BASE_URL;
    const url = `${baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    console.log('API Request:', { url, method: options.method, headers });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();
      
      console.log('API Response:', { status: response.status, data });

      // Handle token expiration
      if (response.status === 401 && data.expired) {
        console.log('Token expired, logging out...');
        await this.removeToken();
        // You might want to emit an event or use a callback to notify the app
        throw new Error('Token expired');
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data, status } = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (status === 200 && data.token) {
      await this.saveToken(data.token);
    }

    return data;
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const { data, status } = await this.request<AuthResponse>('/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    return data;
  }

  async logout() {
    await this.removeToken();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await this.request<DashboardStats>('/stats', {
      method: 'GET',
    }, 'http://10.88.154.67:9000/api/dashboard');
    return data;
  }

  async getStudents(): Promise<any[]> {
    const { data } = await this.request<any[]>('/', {
      method: 'GET',
    }, 'http://10.88.154.67:9000/api/students');
    return data;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();
