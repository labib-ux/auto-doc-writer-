
export interface Repo {
  id: number;
  name: string;
  desc: string;
  isPrivate: boolean;
  isActive: boolean;
  lastUpdate: string;
  branch: string;
  docCount: number;
  files?: any[]; // Simulating file structure
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

const STORAGE_KEYS = {
  REPOS: 'autodoc_repos',
  ACTIVITY: 'autodoc_activity',
  DOCS: 'autodoc_docs',
  USER: 'autodoc_user'
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class ApiClient {
  // Initialization with default data if empty
  constructor() {
    if (!localStorage.getItem(STORAGE_KEYS.REPOS)) {
      const initialRepos: Repo[] = [
        { id: 1, name: 'autodoc-writer-core', desc: 'Core logic for documentation generation engine.', isPrivate: true, isActive: true, lastUpdate: '2m ago', branch: 'main', docCount: 1 },
        { id: 2, name: 'react-three-fiber-experiments', desc: 'Visual experiments and 3D scenes.', isPrivate: false, isActive: false, lastUpdate: '1d ago', branch: 'dev', docCount: 0 },
      ];
      localStorage.setItem(STORAGE_KEYS.REPOS, JSON.stringify(initialRepos));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCS)) {
      localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify([]));
    }
  }

  private getFromStorage<T>(key: string): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // REPOSITORIES
  async getRepos(): Promise<Repo[]> {
    await delay(500);
    return this.getFromStorage<Repo[]>(STORAGE_KEYS.REPOS);
  }

  async addRepo(repo: Partial<Repo>): Promise<Repo> {
    await delay(1000);
    const repos = this.getFromStorage<Repo[]>(STORAGE_KEYS.REPOS);
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
    this.saveToStorage(STORAGE_KEYS.REPOS, [newRepo, ...repos]);
    this.logActivity({
      type: 'create',
      repo: newRepo.name,
      message: 'Repository imported successfully'
    });
    return newRepo;
  }

  async updateRepo(id: number, updates: Partial<Repo>): Promise<Repo> {
    const repos = this.getFromStorage<Repo[]>(STORAGE_KEYS.REPOS);
    const idx = repos.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Repo not found");
    repos[idx] = { ...repos[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.REPOS, repos);
    return repos[idx];
  }

  // DOCUMENTS
  async getDocs(): Promise<Document[]> {
    await delay(400);
    return this.getFromStorage<Document[]>(STORAGE_KEYS.DOCS);
  }

  async addDoc(doc: Partial<Document>): Promise<Document> {
    const docs = this.getFromStorage<Document[]>(STORAGE_KEYS.DOCS);
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
    this.saveToStorage(STORAGE_KEYS.DOCS, [newDoc, ...docs]);
    
    // Update repo doc count
    const repos = this.getFromStorage<Repo[]>(STORAGE_KEYS.REPOS);
    const repoIdx = repos.findIndex(r => r.name === newDoc.repo);
    if (repoIdx !== -1) {
      repos[repoIdx].docCount += 1;
      repos[repoIdx].lastUpdate = 'Just now';
      this.saveToStorage(STORAGE_KEYS.REPOS, repos);
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
    return this.getFromStorage<ActivityItem[]>(STORAGE_KEYS.ACTIVITY);
  }

  private logActivity(item: Partial<ActivityItem>) {
    const activity = this.getFromStorage<ActivityItem[]>(STORAGE_KEYS.ACTIVITY);
    const newItem: ActivityItem = {
      id: Date.now(),
      time: 'Just now',
      repo: item.repo || '-',
      type: item.type || 'system',
      message: item.message || '',
      user: 'johndoe',
      ...item
    };
    this.saveToStorage(STORAGE_KEYS.ACTIVITY, [newItem, ...activity].slice(0, 50));
  }

  // AUTH SIMULATION
  setSession(user: any) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
  getSession() {
    return localStorage.getItem(STORAGE_KEYS.USER);
  }
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export const api = new ApiClient();
