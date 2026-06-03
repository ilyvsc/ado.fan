const repository = "https://github.com/ilyvsc/ado.fan";

export const githubLinks = {
  repository,
  stars: `${repository}/stargazers`,
  forks: `${repository}/forks`,
  issues: `${repository}/issues`,
  license: `${repository}/blob/develop/LICENSE`,
  commits: `${repository}/commits/develop`,
} as const;
