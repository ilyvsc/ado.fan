# Guidelines

Guidance for LLM when working in this repository.

## Technology Stack & Patterns

### Patterns Rules

Hard Rules:

- Never assume file contents, paths, or project structure. Verify first.
- Never use arbitrary TailwindCSS classes or hardcoded values.
- Never use `npm`, use `bun` or `pnpm`.
- Never add comments unless explicitly requested.
- Never create client components unless interactivity requires them.

Preferred Patterns:

- Prefer Server Components.
- Prefer existing abstractions over creating new ones.
- Prefer early returns over nested conditionals.
- Prefer composition over duplication.

Folder Conventions:

- `app/` routing only; `features/<domain>/` domain code; `shared/` cross-feature reuse; `server/db/` data layer; `types/` shared domain types (`@/types/*`).
- Inside a feature/section dir: single-file section stays flat; a section with 2+ files gets its own folder (e.g. `features/home/components/who-is-ado/`).
- Import via aliases, never deep `@/shared/*` paths: `@/lib` `@/hooks` `@/schemas` `@/providers` `@/components` `@/constants` `@/i18n` → `shared/*`; `@/db` → `server/db`; `@/types` → `types`; `@/*` → root.

### Core Stack

- React 19
- Tailwind CSS v4
- Next.js App Router (current stable)
- TypeScript (strict mode enabled)
- GSAP (timelines and ScrollTrigger only)
- Prisma ORM + PostgreSQL
- shadcn/ui + Radix UI primitives

### Icon Libraries

- General UI icons → Use `lucide-react`
- Brand icons → Use `@icons-pack/react-simple-icons`
- NEVER hardcode SVG icons inline
- NEVER create custom icon components when library icons exist

## Styling Implementation

1. PRIMARY SOURCE: CSS variables in `styles/globals.css`
2. FALLBACK: Tailwind color utilities (only if variables don't exist)
3. NEVER: Hardcoded `hex`/`rgb`/`hsl` values

### Available CSS Variables

Check `styles/globals.css` for current list. Common variables:

- `--color-ado-primary`
- `--color-ado-primary-foreground`
- `--color-ado-secondary`
- `--color-ado-secondary-foreground`
- `--color-background`
- `--color-foreground`
- `--color-muted-foreground`

### Theme colors

For song theme colors, use [`@/lib/color`](./shared/lib/color.ts).
`getContrastColor` picks readable white or black text from a six-digit hex
color. `getThemeSurface` makes a softer `oklch()` background from that same
color. Use both results together for themed sections.

### Common Mistakes & Corrections

```tsx
<div className="mt-[32px] w-[250px] bg-[#3b82f6] text-[14px]" /> // incorrect
<div className="mt-8 w-64 bg-blue-500 text-sm" /> // correct
```

```tsx
<div className="bg-[linear-gradient(to right, #3b82f6, #8b5cf6)]" /> // incorrect
<div className="bg-linear-to-r from-blue-500 to-purple-500" /> // correct
```

```tsx
<div className="bg-blue-500 text-white" /> // incorrect
<div className="bg-primary text-foreground" /> // correct
```

```tsx
import { cn } from "@/lib/utils"; // use for merging complex conditions
<div
  className={cn("base-class", condition && "conditional-class", className)}
/>;
```

## Internationalization (i18n)

Lingui v6 + `@lingui/swc-plugin` (required to compile macros; works under Turbopack). Wired in `shared/i18n/`, root layout, `next.config.ts`, and `lingui.config.ts`.

Rules:

- Never hardcode user-facing copy. Wrap it in a macro.
- Source catalogs: `shared/i18n/locales/<locale>/messages.po` (committed). Compiled `messages.ts` are generated, gitignored, and built automatically by `dev` and `build`.
- After adding/changing strings: `bun i18n:extract`, then translate the `.po`. `i18n:compile` runs on `dev`/`build`.

Author with macros from `@lingui/react/macro` (works in Server **and** Client Components — `setI18n` in the root layout makes RSC work without `"use client"`):

```tsx
import { Trans, useLingui } from "@lingui/react/macro";

export function Hero() {
  const { t } = useLingui();
  return (
    <section aria-label={t`Hero section`}>
      <h1>
        <Trans>Japan's anonymous superstar</Trans>
      </h1>
    </section>
  );
}
```

Strings defined outside JSX (constants, arrays) — use the `msg` macro (lazy), render later with `i18n._`:

```tsx
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";

const NAV = [msg`Home`, msg`Lyrics`, msg`Timeline`];
// in a component:
const { i18n } = useLingui();
NAV.map((label) => i18n._(label));
```

Add a locale: add it to `Locale` in `shared/i18n/types.ts` — `appRouterI18n` loads its catalog dynamically (per-locale code-split). `romaji` (`locale: false`) reuses the default catalog.

Pseudolocalization (dev QA to surface untranslated strings): add `pseudoLocale: "pseudo"` to `lingui.config.ts`, add `"pseudo"` to its `locales`, then `bun i18n:extract && bun i18n:compile`.

## References

Load relevant installed skills before work. Each link points to its instruction
file.

- [caveman](./.claude/skills/caveman/SKILL.md) - Load for every task. Keep the solution simple.
- [gsap-react](./.claude/skills/gsap-react/SKILL.md) - GSAP in React.
- [gsap-scrolltrigger](./.claude/skills/gsap-scrolltrigger/SKILL.md) - ScrollTrigger animations.

### Authentication

- [better-auth](./.claude/skills/better-auth/SKILL.md) - Providers, MFA, passkeys, and plugins.

### Code Guidelines

React:

- [react-best-practices](./.claude/skills/react-best-practices/SKILL.md) - Performance, rendering, and state.
- [react-patterns](./.claude/skills/react-patterns/SKILL.md) - Components, hooks, and reuse.
- [react-doctor](./.claude/skills/react-doctor/SKILL.md) - React diagnostics.

Next.js:

- [nextjs-data-fetching](./.claude/skills/nextjs-data-fetching/SKILL.md) - Data fetching, caching, Server Actions, and loading states.

### Web Guidelines

- [seo-audit](./.claude/skills/seo-audit/SKILL.md) - SEO, metadata, and search optimization.
- [web-design-guidelines](./.claude/skills/web-design-guidelines/SKILL.md) - UI design, layout, and user experience.

Load all applicable skills and rules for every task.
