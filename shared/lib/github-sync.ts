// Server-only: reads GITHUB_SYNC_TOKEN. Only imported by server actions and the cron route.
import type { FixtureFile } from "@/db/export/serialize-fixtures";

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
async function gh<T>(
  cfg: SyncConfig,
  path: string,
  init?: { method?: string; body?: string },
): Promise<{ status: number; data: T }> {
  const res = await fetch(
    `https://api.github.com/repos/${cfg.owner}/${cfg.repo}${path}`,
    {
      method: init?.method,
      body: init?.body,
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );
  const data = (res.status === 204 ? null : await res.json()) as T;
  return { status: res.status, data };
}

async function ensureBranch(cfg: SyncConfig): Promise<string> {
  const ref = await gh<{ object?: { sha: string } }>(
    cfg,
    `/git/ref/heads/${cfg.branch}`,
  );
  if (ref.status === 200 && ref.data.object?.sha) return ref.data.object.sha;

  const baseRef = await gh<{ object: { sha: string } }>(
    cfg,
    `/git/ref/heads/${cfg.base}`,
  );
  if (baseRef.status !== 200) throw new Error(`Base branch ${cfg.base} not found.`);

  await gh(cfg, "/git/refs", {
    method: "POST",
    body: JSON.stringify({
      ref: `refs/heads/${cfg.branch}`,
      sha: baseRef.data.object.sha,
    }),
  });
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
  const cfg = getSyncConfig();

  const headSha = await ensureBranch(cfg);
  const head = await gh<{ tree: { sha: string } }>(cfg, `/git/commits/${headSha}`);
  const baseTree = head.data.tree.sha;

  const tree = await Promise.all(
    files.map(async (file) => {
      const blob = await gh<{ sha: string }>(cfg, "/git/blobs", {
        method: "POST",
        body: JSON.stringify({
          content: Buffer.from(file.content, "utf-8").toString("base64"),
          encoding: "base64",
        }),
      });
      return { path: file.path, mode: "100644", type: "blob", sha: blob.data.sha };
    }),
  );

  const newTree = await gh<{ sha: string }>(cfg, "/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree }),
  });

  const trailer = coAuthors.length
    ? "\n\n" + coAuthors.map((n) => `Co-Authored-By: ${n}`).join("\n")
    : "";

  const commit = await gh<{ sha: string; html_url: string }>(cfg, "/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message: message + trailer,
      tree: newTree.data.sha,
      parents: [headSha],
    }),
  });

  await gh(cfg, `/git/refs/heads/${cfg.branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.data.sha }),
  });

  return { sha: commit.data.sha, url: commit.data.html_url };
}

// Open a PR content -> base, or return the existing open one. Null if there is no diff.
export async function ensureContentPr(body: string): Promise<string | null> {
  const cfg = getSyncConfig();

  const existing = await gh<{ html_url: string }[]>(
    cfg,
    `/pulls?state=open&head=${cfg.owner}:${cfg.branch}&base=${cfg.base}`,
  );
  const open = existing.data[0];
  if (existing.status === 200 && open) {
    return open.html_url;
  }

  const created = await gh<{ html_url?: string; message?: string }>(cfg, "/pulls", {
    method: "POST",
    body: JSON.stringify({
      title: "content: sync admin edits to fixtures",
      head: cfg.branch,
      base: cfg.base,
      body,
    }),
  });
  // 422 = no commits between branches (nothing to promote yet).
  return created.data.html_url ?? null;
}
