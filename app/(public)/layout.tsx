import { Footer } from "@/components/layout/Footer";
import { getGitHubFooterData } from "@/lib/github";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const githubData = await getGitHubFooterData();
  return (
    <>
      {children}
      <Footer githubData={githubData} />
    </>
  );
}
