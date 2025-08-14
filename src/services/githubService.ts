export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
}

export interface GitHubProject {
  id: number;
  name: string;
  body: string | null;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}

class GitHubService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly owner = 'NPO-OpenCoralNetwork';
  private readonly repo = 'global-project';

  async getIssues(): Promise<GitHubIssue[]> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub issues:', error);
      return [];
    }
  }

  async getIssueById(issueNumber: number): Promise<GitHubIssue | null> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues/${issueNumber}`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub issue:', error);
      return null;
    }
  }

  async getProjects(): Promise<GitHubProject[]> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/projects`, {
        headers: {
          'Accept': 'application/vnd.github.inertia-preview+json'
        }
      });
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub projects:', error);
      return [];
    }
  }

  async getRepositoryInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch repository info:', error);
      return null;
    }
  }

  getRepositoryUrl(): string {
    return `https://github.com/${this.owner}/${this.repo}`;
  }

  getIssuesUrl(): string {
    return `${this.getRepositoryUrl()}/issues`;
  }

  getProjectsUrl(): string {
    return `${this.getRepositoryUrl()}/projects`;
  }
}

export const githubService = new GitHubService();