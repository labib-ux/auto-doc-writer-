
export interface Repo {
  id: number;
  name: string;
  desc: string;
  isPrivate: boolean;
  isActive: boolean;
  lastUpdate: string;
  branch: string;
  docCount: number;
  files?: any[];
}

export interface ActivityItem {
  id: number;
  type: 'push' | 'gen' | 'error' | 'system' | 'create';
  repo: string;
  time: string;
  message: string;
  user?: string;
}

export interface Document {
  id: number;
  name: string;
  repo: string;
  type: string;
  size: string;
  date: string;
  status: 'Ready' | 'Review' | 'Failed';
  content: string;
}

export interface User {
  name: string;
  email: string;
  handle: string;
  initials: string;
}

export interface AvailableRepo {
  id: number;
  name: string;
  desc: string;
  isPrivate: boolean;
  language: string;
  stars: number;
}

const STORAGE_PREFIX = 'autodoc_v3_';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class ApiClient {
  private getStorageKey(key: string): string {
    const user = this.getCurrentUser();
    const userSuffix = user ? `_${user.handle.toLowerCase()}` : '_guest';
    return `${STORAGE_PREFIX}${key}${userSuffix}`;
  }

  private getFromStorage<T>(key: string): T {
    const data = localStorage.getItem(this.getStorageKey(key));
    return data ? JSON.parse(data) : [] as unknown as T;
  }

  private saveToStorage(key: string, data: any) {
    localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
  }

  // REPOSITORIES
  async getRepos(): Promise<Repo[]> {
    await delay(300);
    const repos = this.getFromStorage<Repo[]>('repos');
    // If empty, provide a single onboarding repo for new users
    if (repos.length === 0) {
      const user = this.getCurrentUser();
      const initial = [{ 
        id: Date.now(), 
        name: `${user?.handle || 'new-user'}-docs-example`, 
        desc: 'Sample repository to explore documentation generation.', 
        isPrivate: true, 
        isActive: true, 
        lastUpdate: 'Just now', 
        branch: 'main', 
        docCount: 0 
      }];
      this.saveToStorage('repos', initial);
      return initial;
    }
    return repos;
  }

  async addRepo(repo: Partial<Repo>): Promise<Repo> {
    await delay(800);
    const repos = this.getFromStorage<Repo[]>('repos');
    const newRepo: Repo = {
      id: Date.now(),
      name: repo.name || 'Untitled',
      desc: repo.desc || '',
      isPrivate: repo.isPrivate ?? false,
      isActive: true,
      lastUpdate: 'Just now',
      branch: 'main',
      docCount: 0,
      ...repo
    };
    this.saveToStorage('repos', [newRepo, ...repos]);
    this.logActivity({
      type: 'create',
      repo: newRepo.name,
      message: 'Repository imported from GitHub'
    });
    return newRepo;
  }

  async updateRepo(id: number, updates: Partial<Repo>): Promise<Repo> {
    const repos = this.getFromStorage<Repo[]>('repos');
    const idx = repos.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Repo not found");
    repos[idx] = { ...repos[idx], ...updates };
    this.saveToStorage('repos', repos);
    return repos[idx];
  }

  // GITHUB SIMULATION
  async getAvailableGithubRepos(handle: string): Promise<AvailableRepo[]> {
    await delay(1000);
    const importedRepos = this.getFromStorage<Repo[]>('repos').map(r => r.name);
    
    // Generate deterministic repos based on handle
    const seeds = ['api', 'ui', 'core', 'utils', 'engine', 'plugin', 'app', 'tool'];
    const langs = ['TypeScript', 'Python', 'Go', 'Rust', 'JavaScript'];
    
    const generated: AvailableRepo[] = seeds.map((seed, i) => ({
      id: i + 100,
      name: `${handle.toLowerCase()}-${seed}`,
      desc: `A powerful ${seed} component for building modern software architectures.`,
      isPrivate: i % 2 === 0,
      language: langs[i % langs.length],
      stars: Math.floor(Math.random() * 500)
    }));

    // Filter out ones already imported
    return generated.filter(g => !importedRepos.includes(g.name));
  }

  // DOCUMENTS
  async getDocs(): Promise<Document[]> {
    await delay(300);
    return this.getFromStorage<Document[]>('docs');
  }

  async addDoc(doc: Partial<Document>): Promise<Document> {
    const docs = this.getFromStorage<Document[]>('docs');
    const newDoc: Document = {
      id: Date.now(),
      name: doc.name || 'Untitled Doc',
      repo: doc.repo || 'Unknown',
      type: doc.type || 'Markdown',
      size: doc.size || '12 KB',
      date: new Date().toLocaleString(),
      status: 'Ready',
      content: doc.content || '',
      ...doc
    };
    this.saveToStorage('docs', [newDoc, ...docs]);
    
    const repos = this.getFromStorage<Repo[]>('repos');
    const repoIdx = repos.findIndex(r => r.name === newDoc.repo);
    if (repoIdx !== -1) {
      repos[repoIdx].docCount += 1;
      repos[repoIdx].lastUpdate = 'Just now';
      this.saveToStorage('repos', repos);
    }

    this.logActivity({
      type: 'gen',
      repo: newDoc.repo,
      message: `Documentation generated: ${newDoc.name}`
    });

    return newDoc;
  }

  // ACTIVITY
  async getActivity(): Promise<ActivityItem[]> {
    return this.getFromStorage<ActivityItem[]>('activity');
  }

  private logActivity(item: Partial<ActivityItem>) {
    const activity = this.getFromStorage<ActivityItem[]>('activity');
    const currentUser = this.getCurrentUser();
    const newItem: ActivityItem = {
      id: Date.now(),
      time: 'Just now',
      repo: item.repo || '-',
      type: item.type || 'system',
      message: item.message || '',
      user: currentUser?.handle.toLowerCase() || 'system',
      ...item
    };
    this.saveToStorage('activity', [newItem, ...activity].slice(0, 50));
  }

  // AUTH
  setSession(user: User) {
    localStorage.setItem(`${STORAGE_PREFIX}session`, JSON.stringify(user));
  }
  
  getSession() {
    return localStorage.getItem(`${STORAGE_PREFIX}session`);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(`${STORAGE_PREFIX}session`);
    return data ? JSON.parse(data) : null;
  }

  clearSession() {
    localStorage.removeItem(`${STORAGE_PREFIX}session`);
  }
}

export const api = new ApiClient();
