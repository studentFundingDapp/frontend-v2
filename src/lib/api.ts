import axios, { AxiosError } from 'axios';

// =================================================================================
// #region Utility Types and Interfaces
// =================================================================================

/**
 * A generic, type-safe wrapper for API responses.
 * Distinguishes between successful and failed outcomes.
 */
export type ApiResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

/**
 * Represents the structure of a validation error from the API (HTTP 422).
 */
interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * Represents the error response body from the API.
 */
interface ApiErrorResponse {
  detail?: string | ValidationErrorDetail[];
}

// --- Request Body Interfaces ---

export interface WalletConnectRequest {
  wallet_address: string;
  signature: string;
  message: string;
}

export interface StudentRegistrationRequest {
  email: string;
  password: string;
  username: string;
  full_name: string;
  institution: string;
  student_id: string;
  field_of_study: string;
  year_of_study: number;
}

export interface StudentProfileUpdateRequest {
  full_name?: string;
  institution?: string;
  field_of_study?: string;
  year_of_study?: number;
}

export interface DonorRegistrationRequest {
  email: string;
  password: string;
  username: string;
  full_name: string;
  organization?: string;
  preferred_categories?: string[];
}

export interface ProjectCreateRequest {
  title: string;
  description: string;
  objectives: string;
  deliverables: string;
  category: string;
  target_amount: number;
  deadline: string; // ISO 8601 date-time string
  media_urls?: string[];
}

export interface ProjectUpdateRequest {
  title?: string;
  description?: string;
  objectives?: string;
  deliverables?: string;
  category?: string;
  target_amount?: number;
  deadline?: string;
  media_urls?: string[];
}

export interface FundingRecordRequest {
    project_id: string;
    amount: number;
    transaction_hash: string;
    message?: string;
}


// --- Response Data Interfaces ---

export interface AuthResponse {
  access_token: string;
  token_type: 'bearer'; // Typically included in OAuth2 responses
  refresh_token?: string;
}

export interface StudentProfile {
    id: string;
    full_name: string;
    institution: string;
    field_of_study: string;
    year_of_study: number;
    email: string;
    username: string;
    is_verified: boolean;
}

export interface DonorProfile {
    id: string;
    full_name: string;
    organization?: string;
    email: string;
    username: string;
    preferred_categories: string[];
}

export interface Project {
    project_id: string;
    student_id: string;
    title: string;
    description: string;
    category: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
    status: 'open' | 'funded' | 'completed' | 'closed';
    created_at: string;
}

export interface FundingTransaction {
    id: string;
    project_id: string;
    donor_id: string;
    amount: number;
    transaction_hash: string;
    message?: string;
    timestamp: string;
}

// #endregion
// =================================================================================

// =================================================================================
// #region Axios Configuration and Error Handling
// =================================================================================

const API_BASE_URL = 'https://api.yourdomain.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject the JWT token
api.interceptors.request.use((config) => {
  // Use a modern approach to avoid potential SSR issues with localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access globally
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Optional: Redirect to login page
        // window.location.href = '/login';
        console.error('Unauthorized access - logging out.');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Parses an error from an API call into a user-friendly string.
 * @param error The error object caught in a try-catch block.
 * @returns A string representing the error message.
 */
function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    
    if (errorData?.detail) {
      if (typeof errorData.detail === 'string') {
        return errorData.detail;
      }
      // Handle validation error array
      if (Array.isArray(errorData.detail)) {
        return errorData.detail.map(d => `${d.loc.join('.')} - ${d.msg}`).join('; ');
      }
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}

// #endregion
// =================================================================================


// =================================================================================
// #region API Service Definitions
// =================================================================================

// --- Authentication API ---
export const authApi = {
  /**
   * Logs in a user with email and password.
   * NOTE: This endpoint is inferred from the OAuth2 security scheme.
   */
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
      localStorage.setItem('access_token', response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  /**
   * Connects a blockchain wallet for authentication.
   */
  connectWallet: async (data: WalletConnectRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/connect-wallet', data);
      localStorage.setItem('access_token', response.data.access_token);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  /**
   * Logs out the user and clears tokens from storage.
   */
  logout: async (): Promise<ApiResponse<null>> => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { success: true, data: null };
    } catch (error) {
      // Even if logout fails server-side, clear client-side tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { success: false, error: handleApiError(error) };
    }
  },
};

// --- Student API ---
export const studentApi = {
  register: async (data: StudentRegistrationRequest): Promise<ApiResponse<null>> => {
    try {
      // Expects a 201 Created with no significant body
      await api.post('/api/students/register', data);
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getProfile: async (): Promise<ApiResponse<StudentProfile>> => {
    try {
      const response = await api.get<StudentProfile>('/api/students/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  updateProfile: async (data: StudentProfileUpdateRequest): Promise<ApiResponse<null>> => {
    try {
      await api.put('/api/students/profile', data);
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getDashboard: async (): Promise<ApiResponse<unknown>> => { // Replace 'unknown' with a specific Dashboard interface
    try {
      const response = await api.get('/api/students/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

// --- Donor API ---
export const donorApi = {
  register: async (data: DonorRegistrationRequest): Promise<ApiResponse<null>> => {
    try {
      await api.post('/api/donors/register', data);
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getProfile: async (): Promise<ApiResponse<DonorProfile>> => {
    try {
      const response = await api.get<DonorProfile>('/api/donors/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getRecommendations: async (): Promise<ApiResponse<Project[]>> => {
    try {
      const response = await api.get<Project[]>('/api/donors/recommendations');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

// --- Project API ---
export const projectApi = {
  create: async (data: ProjectCreateRequest): Promise<ApiResponse<Project>> => { // Assuming the created project is returned
    try {
      const response = await api.post<Project>('/api/projects', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  list: async (params: { status?: string; category?: string; page?: number; limit?: number } = {}): Promise<ApiResponse<Project[]>> => {
    try {
      const response = await api.get<Project[]>('/api/projects', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  get: async (projectId: string): Promise<ApiResponse<Project>> => {
    try {
      const response = await api.get<Project>(`/api/projects/${projectId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  update: async (projectId: string, data: ProjectUpdateRequest): Promise<ApiResponse<Project>> => {
    try {
        const response = await api.put<Project>(`/api/projects/${projectId}`, data);
        return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  delete: async (projectId: string): Promise<ApiResponse<null>> => {
    try {
      await api.delete(`/api/projects/${projectId}`);
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

// --- Funding API ---
export const fundingApi = {
  record: async (data: FundingRecordRequest): Promise<ApiResponse<null>> => {
    try {
      await api.post('/api/fundings', data);
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getDonorHistory: async (params: { page?: number; limit?: number } = {}): Promise<ApiResponse<FundingTransaction[]>> => {
    try {
      const response = await api.get<FundingTransaction[]>('/api/fundings/donor', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getStudentHistory: async (params: { page?: number; limit?: number } = {}): Promise<ApiResponse<FundingTransaction[]>> => {
    try {
      const response = await api.get<FundingTransaction[]>('/api/fundings/student', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

// #endregion
// =================================================================================