const BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api/v1';

class ApiError extends Error {
  constructor(public status: number, public data: any) {
    super(data?.message || 'API request failed');
  }
}

export const apiClient = {
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('zenvy_token');
    
    // Inject Authorization header if we have a token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    // Handle 401 Unauthorized globally by clearing token and redirecting to login
    // unless the endpoint itself is the login/register endpoint.
    if (response.status === 401 && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/register')) {
      localStorage.removeItem('zenvy_token');
      window.dispatchEvent(new Event('zenvy:logout')); // Notify AuthContext
      // If we are strictly relying on React Router, we shouldn't use window.location directly
      // but emitting an event works perfectly to trigger state updates in AuthContext!
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new ApiError(response.status, data);
    }

    // We assume the backend sends { success: true, data: T } or { statusCode, message }
    return data?.data !== undefined ? data.data : data; 
  },

  get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T = any>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  patch<T = any>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  },

  delete<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
};
