// Server-only: reads GITHUB_SYNC_TOKEN. Only imported by server actions and the cron route.
import type { FixtureFile } from "@/db/export/serialize-fixtures";

const GITHUB_API_VERSION = "2026-03-10";

// Server actions run serially per browser tab, so a hung GitHub call would
// silently freeze every other action until it resolves.
const GITHUB_TIMEOUT_MS = 15_000;

interface SyncConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  base: string;
}

export function getSyncConfig(): SyncConfig {
  const token = process.env.GITHUB_SYNC_TOKEN;
  const repo = process.env.GITHUB_SYNC_REPO; // "owner/repo"

  if (!token || !repo) {
    throw new Error("GITHUB_SYNC_TOKEN and GITHUB_SYNC_REPO must be set.");
  }

  const [owner, name] = repo.split("/");
  if (!owner || !name) throw new Error(`Invalid GITHUB_SYNC_REPO: ${repo}`);

  return {
    token,
    owner,
    repo: name,
    branch: process.env.GITHUB_SYNC_BRANCH ?? "content",
    base: process.env.GITHUB_SYNC_BASE ?? "develop",
  };
}

// T is a response-shape assertion, not inferred from input — that's intentional here.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
async function githubRequest<T>(
  config: SyncConfig,
  path: string,
  init?: { method?: string; body?: string },
): Promise<{ status: number; data: T }> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}${path}`,
    {
      method: init?.method,
      body: init?.body,
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
    },
  );
  const data = (response.status === 204 ? null : await response.json()) as T;
  return { status: response.status, data };
}

function assertSuccess(status: number, step: string) {
  if (status < 200 || status >= 300) {
    throw new Error(`GitHub ${step} failed (${status}).`);
  }
}

type GraphqlVariableValue =
  | string
  | number
  | boolean
  | null
  | readonly GraphqlVariableValue[]
  | { readonly [key: string]: GraphqlVariableValue };

async function githubGraphql<T>(
  config: SyncConfig,
  query: string,
  variables: Record<string, GraphqlVariableValue>,
): Promise<T> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({ query, variables }),
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
  });

  const payload = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (!response.ok || payload.errors?.length || !payload.data) {
    const reason = payload.errors?.[0]?.message ?? `status ${response.status}`;
    throw new Error(`GitHub GraphQL request failed: ${reason}`);
  }
  return payload.data;
}

// Returns the head sha of the content branch, creating the branch from base if missing.
async function ensureContentBranch(config: SyncConfig): Promise<string> {
  const contentRef = await githubRequest<{ object?: { sha: string } }>(
    config,
    `/git/ref/heads/${config.branch}`,
  );
  if (contentRef.status === 200 && contentRef.data.object?.sha) {
    return contentRef.data.object.sha;
  }

  const baseRef = await githubRequest<{ object: { sha: string } }>(
    config,
    `/git/ref/heads/${config.base}`,
  );
  if (baseRef.status !== 200) {
    throw new Error(`Base branch ${config.base} not found.`);
  }

  const createdRef = await githubRequest(config, "/git/refs", {
    method: "POST",
    body: JSON.stringify({
      ref: `refs/heads/${config.branch}`,
      sha: baseRef.data.object.sha,
    }),
  });

  assertSuccess(createdRef.status, `branch ${config.branch} creation`);
  return baseRef.data.object.sha;
}

export interface CommitResult {
  sha: string;
  url: string;
}

export async function commitFixtureFiles(
  files: FixtureFile[],
  message: string,
  coAuthors: string[] = [],
): Promise<CommitResult> {
  if (!files.length) throw new Error("No files to commit.");
  const config = getSyncConfig();
  const headSha = await ensureContentBranch(config);

  const coAuthorTrailers = coAuthors
    .map((coAuthor) => `Co-Authored-By: ${coAuthor}`)
    .join("\n");

  const result = await githubGraphql<{
    createCommitOnBranch: {
      commit: { oid: string; url: string } | null;
    } | null;
  }>(
    config,
    `
    mutation CreateContentCommit($input: CreateCommitOnBranchInput!) {
      createCommitOnBranch(input: $input) {
        commit {
          oid
          url
        }
      }
    }
  `,
    {
      input: {
        branch: {
          repositoryNameWithOwner: `${config.owner}/${config.repo}`,
          branchName: config.branch,
        },
        expectedHeadOid: headSha,
        message: {
          headline: message,
          ...(coAuthorTrailers && { body: coAuthorTrailers }),
        },
        fileChanges: {
          additions: files.map((file) => ({
            path: file.path,
            contents: Buffer.from(file.content, "utf-8").toString("base64"),
          })),
        },
      },
    },
  );

  const commit = result.createCommitOnBranch?.commit;
  if (!commit) throw new Error("GitHub did not return the created commit.");
  return { sha: commit.oid, url: commit.url };
}

const COMMIT_SHA = /^[0-9a-f]{40}$/;

// Cross-check stored commit shas against the remote repo (admin -> GitHub
// direction). One aliased GraphQL query covers every sha in a single call.
export async function verifyCommits(shas: string[]): Promise<Map<string, boolean>> {
  const validShas = shas.filter((sha) => COMMIT_SHA.test(sha));
  if (!validShas.length) return new Map();
  const config = getSyncConfig();

  const aliasedLookups = validShas
    .map((sha, index) => `commit${index}: object(oid: "${sha}") { oid }`)
    .join("\n");
  const data = await githubGraphql<{
    repository: Record<string, { oid: string } | null> | null;
  }>(
    config,
    `query VerifyCommits($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        ${aliasedLookups}
      }
    }`,
    { owner: config.owner, name: config.repo },
  );

  return new Map(
    validShas.map((sha, index) => [
      sha,
      data.repository?.[`commit${index}`]?.oid === sha,
    ]),
  );
}

// Open a PR content -> base, or return the existing open one. Null if there is
// no diff. With commentOnExisting, an already-open PR gets the body as a new
// comment so every sync's attribution stays on record.
export async function ensureContentPr(
  body: string,
  commentOnExisting = false,
): Promise<string | null> {
  const config = getSyncConfig();

  const openPullRequests = await githubRequest<{ html_url: string; number: number }[]>(
    config,
    `/pulls?state=open&head=${config.owner}:${config.branch}&base=${config.base}`,
  );
  const existingPullRequest = openPullRequests.data[0];
  if (openPullRequests.status === 200 && existingPullRequest) {
    if (commentOnExisting) {
      const comment = await githubRequest(
        config,
        `/issues/${existingPullRequest.number}/comments`,
        { method: "POST", body: JSON.stringify({ body }) },
      );
      assertSuccess(comment.status, "PR comment creation");
    }
    return existingPullRequest.html_url;
  }

  const createdPr = await githubRequest<{
    html_url?: string;
    message?: string;
  }>(config, "/pulls", {
    method: "POST",
    body: JSON.stringify({
      title: "content: sync admin edits to fixtures",
      head: config.branch,
      base: config.base,
      body,
    }),
  });
  return createdPr.data.html_url ?? null;
}

export interface ContentPrInfo {
  url: string;
  number: number;
  title: string;
  state: "open" | "merged" | "closed";
  updatedAt: string;
}

// Most recent PR from the content branch, open or already resolved, for
// display purposes. Independent of ensureContentPr's open-only lookup.
export async function getLatestContentPr(): Promise<ContentPrInfo | null> {
  const config = getSyncConfig();
  const pulls = await githubRequest<
    {
      html_url: string;
      number: number;
      title: string;
      state: "open" | "closed";
      merged_at: string | null;
      updated_at: string;
    }[]
  >(
    config,
    `/pulls?state=all&head=${config.owner}:${config.branch}&base=${config.base}&sort=updated&direction=desc&per_page=1`,
  );
  const pr = pulls.data[0];
  if (pulls.status !== 200 || !pr) return null;

  return {
    url: pr.html_url,
    number: pr.number,
    title: pr.title,
    state: pr.merged_at ? "merged" : pr.state,
    updatedAt: pr.updated_at,
  };
}
