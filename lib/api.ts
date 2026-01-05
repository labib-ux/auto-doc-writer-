
export interface Repo {
  id: number;
  name: string;
  desc: string;
  isPrivate: boolean;
  isActive: boolean;
  lastUpdate: string;
  branch: string;
  docCount: number;
}

export interface ActivityItem {
  id: number;
  type: 'push' | 'gen' | 'error' | 'system' | 'create';
  repo: string;
  time: string;
  message: string;
  user?: string;
}

// In a real environment, this would come from an environment variable
const BASE_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000/api' : '';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // If no backend is connected yet, we handle logic in the frontend for "Ready to Use" status
    if (!BASE_URL) {
      console.warn(`API call to ${endpoint} intercepted: No backend URL configured. Using local logic.`);
      throw new Error("BACKEND_NOT_CONFIGURED");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  async getRepos(): Promise<Repo[]> {
    return this.request<Repo[]>('/repos');
  }

  async generateDocs(repoId: number, config: any): Promise<any> {
    return this.request(`/repos/${repoId}/generate`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }
}

export const api = new ApiClient();
