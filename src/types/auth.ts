export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'educator' | 'admin';
  isVerified: boolean;
  institutionId?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'educator';
  institutionId?: string;
}

export interface AccessLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
}

export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAccess: (requiredRole: string) => boolean;
}