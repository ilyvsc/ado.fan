import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { getVerifiedSessionUser } from "@/admin/auth/guard";

import { PanelShell } from "./shell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getVerifiedSessionUser();
  if (!user) redirect("/admin/sign-in");
  return <PanelShell>{children}</PanelShell>;
}
