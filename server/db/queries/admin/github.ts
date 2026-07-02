import { prisma } from "@/prisma/client";

/** Refreshes name/username/avatar from GitHub onto the linked user. */
export async function syncGithubProfile(
  userId: string,
  accessToken: string | null | undefined,
) {
  if (!accessToken) return;

  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return;

    const profile = (await response.json()) as {
      name?: string;
      login?: string;
      avatar_url?: string;
    };

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(profile.name && { name: profile.name }),
        ...(profile.login && { username: profile.login }),
        ...(profile.avatar_url && { image: profile.avatar_url }),
      },
    });
  } catch {}
}
