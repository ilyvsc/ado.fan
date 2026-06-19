export interface GitHubRepoStats {
  stars: number;
  forks: number;
  openIssuesAndPullRequests: number;
  updatedAt: string | null;
}

export interface GitHubContributor {
  login: string;
  avatarUrl: string;
  profileUrl: string;
  contributions: number;
}

export interface GitHubData {
  stats: GitHubRepoStats | null;
  contributors: GitHubContributor[];
}

const GITHUB_REPO_URL = "https://github.com/ilyvsc/ado.fan";
const GITHUB_REPO_API_URL = "https://api.github.com/repos/ilyvsc/ado.fan";
const GITHUB_API_REVALIDATE_SECONDS = 3600;

export const githubLinks = {
  repository: GITHUB_REPO_URL,
  stars: `${GITHUB_REPO_URL}/stargazers`,
  forks: `${GITHUB_REPO_URL}/forks`,
  issues: `${GITHUB_REPO_URL}/issues`,
  license: `${GITHUB_REPO_URL}/blob/develop/LICENSE`,
  commits: `${GITHUB_REPO_URL}/commits/develop`,
} as const;

async function fetchGitHubJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: GITHUB_API_REVALIDATE_SECONDS },
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function getRepositoryStats(): Promise<GitHubRepoStats | null> {
  const repository = await fetchGitHubJson<{
    stargazers_count?: number;
    forks_count?: number;
    open_issues_count?: number;
    updated_at?: string | null;
  }>(GITHUB_REPO_API_URL);

  if (!repository) return null;

  return {
    stars: repository.stargazers_count ?? 0,
    forks: repository.forks_count ?? 0,
    openIssuesAndPullRequests: repository.open_issues_count ?? 0,
    updatedAt: repository.updated_at ?? null,
  };
}

async function getRepositoryContributors(): Promise<GitHubContributor[]> {
  const contributors = await fetchGitHubJson<
    {
      login?: string;
      avatar_url?: string;
      html_url?: string;
      contributions?: number;
    }[]
  >(`${GITHUB_REPO_API_URL}/contributors?per_page=6`);

  if (!Array.isArray(contributors)) return [];

  return contributors.flatMap((contributor) => {
    const { login, avatar_url: avatarUrl, html_url: profileUrl } = contributor;
    if (!login || !avatarUrl || !profileUrl) return [];

    return [
      {
        login,
        avatarUrl,
        profileUrl,
        contributions: contributor.contributions ?? 0,
      },
    ];
  });
}

export async function getGitHubFooterData(): Promise<GitHubData> {
  const [stats, contributors] = await Promise.all([
    getRepositoryStats(),
    getRepositoryContributors(),
  ]);

  return { stats, contributors };
}
