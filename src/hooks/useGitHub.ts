import { useQuery } from '@tanstack/react-query';
import { githubService, GitHubIssue, GitHubProject } from '../services/githubService';

export const useGitHubIssues = () => {
  return useQuery<GitHubIssue[]>({
    queryKey: ['github', 'issues'],
    queryFn: () => githubService.getIssues(),
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
    refetchInterval: 10 * 60 * 1000, // 10分ごとに自動更新
  });
};

export const useGitHubProjects = () => {
  return useQuery<GitHubProject[]>({
    queryKey: ['github', 'projects'],
    queryFn: () => githubService.getProjects(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useGitHubRepository = () => {
  return useQuery({
    queryKey: ['github', 'repository'],
    queryFn: () => githubService.getRepositoryInfo(),
    staleTime: 30 * 60 * 1000, // 30分間はキャッシュを使用
  });
};