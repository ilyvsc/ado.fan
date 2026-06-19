"use client";

import { useGSAP } from "@gsap/react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleDot, Clock, GitFork, Mail, Scale, Star } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { useSocialLinks } from "@/hooks/useSocialLinks";
import { linksCategories } from "@/lib/socialLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

import { formatDate } from "@/shared/lib/date";
import { githubLinks, type GitHubData } from "@/shared/lib/github";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_EMAIL = "hey@ado.fan";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/lyrics", label: "Lyrics Search" },
];

const siteLinks = [
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/tos", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

const contactLinks = [
  { href: githubLinks.repository, label: "ilyvsc/ado.fan", type: "github" },
  { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL, type: "email" },
];

const linksClass =
  "py-1 text-sm text-foreground/60 transition-colors hover:text-foreground hover:underline hover:underline-offset-4 md:text-base";

function formatStat(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function Footer({ githubData }: { githubData: GitHubData }) {
  const year = new Date().getFullYear();
  const rootRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const { socialMedia, musicPlatforms } = useMemo(
    () => ({
      socialMedia: linksCategories["social-media"] ?? [],
      musicPlatforms: linksCategories["music-platforms"] ?? [],
    }),
    [],
  );

  const { stats: githubStats, contributors: githubContributors } = githubData;
  const [activeContributor, setActiveContributor] = useState<string | null>(null);

  const selectedContributor =
    githubContributors.find(({ login }) => login === activeContributor) ??
    githubContributors.at(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top bottom" },
        },
      );
    });
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative w-full overflow-hidden border-y border-foreground/10 bg-background/60"
    >
      <div className="relative overflow-hidden bg-linear-to-b from-foreground/5 to-background/10">
        <div className="px-6 py-8 md:px-12 lg:px-16">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-foreground/10" />
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
              <span className="text-foreground/40">You're at</span>
              <span className="text-foreground">{pathname}</span>
            </div>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>

          <div className="mb-10 grid gap-8 border-b border-foreground/10 pb-10 lg:grid-cols-2">
            <div className="lg:min-w-0">
              <h3 className="font-serif text-3xl leading-tight font-bold text-foreground md:text-4xl lg:whitespace-nowrap">
                Help with the Adomination
              </h3>
              <p className="mt-2 max-w-sm text-justify text-sm text-muted-foreground md:max-w-xl md:text-base">
                Translate the website and lyrics into your language, improve content
                and documentation, fix bugs, review pull requests, enhance
                accessibility, or ship new features for the community.
              </p>
              <a
                href={githubLinks.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-background transition-opacity hover:opacity-75 md:min-w-48 md:justify-center lg:px-5"
              >
                <SiGithub
                  className="h-4 w-4 transition-transform group-hover:-translate-y-px"
                  aria-hidden="true"
                />
                Contribute on GitHub
              </a>
            </div>

            <div className="grid gap-4 text-base text-foreground/60">
              <section aria-labelledby="footer-project-stats">
                <h4
                  id="footer-project-stats"
                  className="pb-2 text-base font-semibold text-foreground"
                >
                  Project Stats
                </h4>

                <div className="space-y-1">
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    <li>
                      <a
                        href={githubLinks.stars}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        <Star className="h-4 w-4" aria-hidden="true" />
                        {formatStat(githubStats?.stars ?? null)} stars
                      </a>
                    </li>

                    <li>
                      <a
                        href={githubLinks.forks}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        <GitFork className="h-4 w-4" aria-hidden="true" />
                        {formatStat(githubStats?.forks ?? null)} forks
                      </a>
                    </li>

                    <li>
                      <a
                        href={githubLinks.issues}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        <CircleDot className="h-4 w-4" aria-hidden="true" />
                        {formatStat(
                          githubStats?.openIssuesAndPullRequests ?? null,
                        )}{" "}
                        issues
                      </a>
                    </li>
                  </ul>

                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    <li>
                      <a
                        href={githubLinks.license}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        <Scale className="h-4 w-4" aria-hidden="true" />
                        GPL-3.0 + CC BY-NC-SA 4.0
                      </a>
                    </li>

                    <li>
                      <a
                        href={githubLinks.commits}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        Last commit: {formatDate(githubStats?.updatedAt)}
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              <section aria-labelledby="footer-community-credit">
                <h4
                  id="footer-community-credit"
                  className="pb-2 text-base font-semibold text-foreground"
                >
                  Community Credit
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap items-center -space-x-2 gap-y-2">
                    {githubContributors.map(
                      ({ login, profileUrl, avatarUrl, contributions }) => (
                        <a
                          key={profileUrl}
                          href={profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${login}, ${formatStat(contributions)} contributions`}
                          onFocus={() => {
                            setActiveContributor(login);
                          }}
                          onMouseEnter={() => {
                            setActiveContributor(login);
                          }}
                          className="group relative rounded-full transition-transform hover:z-10 hover:-translate-y-1 focus-visible:z-10 focus-visible:-translate-y-1"
                        >
                          <Avatar className="h-9 w-9 border border-background">
                            <AvatarImage
                              src={avatarUrl}
                              alt="GitHub Profile Avatar"
                            />
                            <AvatarFallback className="bg-foreground/10 text-xs text-foreground">
                              {login.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </a>
                      ),
                    )}
                  </div>

                  {selectedContributor ? (
                    <div className="min-w-0">
                      <a
                        href={selectedContributor.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 transition-colors hover:text-foreground"
                      >
                        <span className="block truncate text-base font-semibold text-foreground">
                          {selectedContributor.login}
                        </span>
                        <span className="block text-sm text-foreground/60">
                          {formatStat(selectedContributor.contributions)}{" "}
                          contributions
                        </span>
                      </a>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-5">
            <section aria-labelledby="footer-social-media">
              <h4
                id="footer-social-media"
                className="pb-2 font-serif text-xl tracking-wide text-foreground/90"
              >
                Social Media
              </h4>
              <div className="flex flex-col">
                {useSocialLinks({ links: socialMedia, className: linksClass })}
              </div>
            </section>

            <section aria-labelledby="footer-music-platforms">
              <h4
                id="footer-music-platforms"
                className="pb-2 font-serif text-xl tracking-wide text-foreground/90"
              >
                Music Platforms
              </h4>
              <div className="flex flex-col">
                {useSocialLinks({ links: musicPlatforms, className: linksClass })}
              </div>
            </section>

            <section aria-labelledby="footer-pages">
              <h4
                id="footer-pages"
                className="pb-2 font-serif text-xl tracking-wide text-foreground/90"
              >
                Pages
              </h4>
              <div className="flex flex-col">
                {pageLinks.map(({ href, label }) => (
                  <Link key={href} href={href} className={linksClass}>
                    {label}
                  </Link>
                ))}
              </div>
            </section>

            <section aria-labelledby="footer-site">
              <h4
                id="footer-site"
                className="pb-2 font-serif text-xl tracking-wide text-foreground/90"
              >
                Legal
              </h4>
              <div className="flex flex-col">
                {siteLinks.map(({ href, label }) => (
                  <Link key={href} href={href} className={linksClass}>
                    {label}
                  </Link>
                ))}
              </div>
            </section>

            <section aria-labelledby="footer-contact">
              <h4
                id="footer-contact"
                className="pb-2 font-serif text-xl tracking-wide text-foreground/90"
              >
                Contact
              </h4>
              <div className="flex flex-col">
                {contactLinks.map(({ href, label, type }) => {
                  const Icon = type === "github" ? SiGithub : Mail;
                  const isGithub = type === "github";

                  return (
                    <a
                      key={href}
                      href={href}
                      target={isGithub ? "_blank" : undefined}
                      rel={isGithub ? "noopener noreferrer" : undefined}
                      className={`${linksClass} flex items-center gap-2`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {label}
                    </a>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <div className="border-t border-foreground/10 py-6 text-center text-xs text-foreground/40">
          <p className="mx-auto max-w-lg leading-relaxed lg:max-w-5xl">
            All content, media, lyrics, trademarks, and imagery on this site are the
            property of their respective owners; all rights remain with the original
            authors/rights holders.
          </p>
          <p className="pt-2">
            &copy; 2025-{year} Ado Fan Tribute - Powered by passion, not profit.
          </p>
        </div>

        <div className="hidden w-full md:block" aria-hidden="true">
          <svg
            viewBox="0 0 1680 112"
            preserveAspectRatio="xMidYMid meet"
            className="block w-full text-foreground/10"
          >
            <text
              x="0"
              y="102"
              textLength="1680"
              lengthAdjust="spacingAndGlyphs"
              fill="currentColor"
              className="font-sans font-black"
              style={{
                fontSize: "130px",
                textTransform: "uppercase",
                letterSpacing: "-7px",
              }}
            >
              Ado World Domination
            </text>
          </svg>
          <span className="sr-only">Ado World Domination</span>
        </div>

        <div className="block w-full md:hidden" aria-hidden="true">
          <svg
            viewBox="0 0 810 265"
            preserveAspectRatio="xMidYMid meet"
            className="block w-full text-foreground/10 select-none"
          >
            <text
              x="6"
              y="140"
              textLength="796"
              lengthAdjust="spacingAndGlyphs"
              fill="currentColor"
              className="font-sans leading-0 font-black uppercase"
              style={{ fontSize: "140px", letterSpacing: "-10px" }}
            >
              Ado World
            </text>
            <text
              x="0"
              y="260"
              textLength="800"
              lengthAdjust="spacingAndGlyphs"
              fill="currentColor"
              className="font-sans leading-0 font-black uppercase"
              style={{ fontSize: "140px", letterSpacing: "-12px" }}
            >
              Domination
            </text>
          </svg>
          <span className="sr-only">Ado World Domination</span>
        </div>
      </div>
    </footer>
  );
}
