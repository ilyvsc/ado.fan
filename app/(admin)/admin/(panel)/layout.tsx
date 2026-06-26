import { redirect } from "next/navigation";

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
