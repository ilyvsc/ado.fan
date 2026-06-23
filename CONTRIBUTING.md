# Contributing to ado.fan

Thanks for helping with ado.fan. Small fixes, better writing, design work,
documentation, and code are all useful. For website or lyric translations, read
[TRANSLATING.md](TRANSLATING.md) first.

## Start here

- Use [GitHub Discussions](https://github.com/ilyvsc/ado.fan/discussions) for
  questions and early ideas.
- Look through open issues and discussions before starting work.
- For an outside contribution, make a fork and a short branch name such as
  `fix/lyrics-search` or `docs/translation-guide`.
- Follow the [local setup guide](README.md#quick-start) before you begin.

> [!NOTE]
> Bun is the usual workflow for this project. You may use another modern
> package manager, but please do not use `npm` or commit another lockfile.

## A normal contribution

1. Start from `develop` unless a maintainer asks for a different branch.
2. Make the smallest change that solves the problem.
3. Update related text, translations, or documentation.
4. Run the checks for your change.
5. Open a pull request against `develop`.

Commit messages are easiest to read when they explain the change. The project
often uses prefixes such as `fix:`, `feat:`, and `docs:`.

> [!IMPORTANT]
> Keep one pull request about one problem. If you find another problem while
> working, open a new issue or pull request for it.

## Where code lives

| Path                 | What belongs there                                            |
| -------------------- | ------------------------------------------------------------- |
| `app/`               | Routes, layouts, route handlers, and page metadata.           |
| `features/<domain>/` | Feature-specific components, hooks, and logic.                |
| `shared/`            | Reusable components, i18n, providers, schemas, and utilities. |
| `server/db/`         | Database access and serialization.                            |
| `types/`             | Shared domain types.                                          |
| `prisma/`            | Schema, migrations, and generated client.                     |

Use the project aliases instead of deep relative imports:

- `@/components`, `@/lib`, `@/hooks`, `@/i18n`
- `@/providers`, `@/schemas`, `@/constants`
- `@/db`, `@/types`

For a small section, keep one file at the feature level. When it grows to two
or more files, give it its own folder.

> [!IMPORTANT]
> Keep routes in `app/`, feature code in `features/`, and shared code in
> `shared/`. This makes the project easier to navigate.

## Writing code

### Types and data

The project uses strict TypeScript. Please keep types useful instead of using
`any` to get past an error.

- Reuse an existing type before adding a new one.
- Validate form, route, and outside-service data with the existing Zod schemas.
- Return early instead of adding deep nested conditions.
- Remove unused imports, variables, and dead code.

### Styling and UI

- Use Tailwind CSS v4 and the semantic variables in `styles/globals.css`.
- Avoid TailwindCSS hardcoded values such as `text-[10px]`, hardcoded colors, and inline SVGs icons.
- Reuse shadcn/ui and Radix primitives when they fit.
- Use `lucide-react` for UI icons and `@icons-pack/react-simple-icons` for brand icons.
- Use `cn` from `@/lib/utils` for conditional classes.
- Respect reduced-motion settings. Use GSAP only when animation adds value.

#### Theme colors

For song themes, you may use the [shared/lib/color.ts](shared/lib/color.ts) helper.

- `getContrastColor(hex)` picks `"white"` or `"black"` text from a six-digit hex color.
  It uses WCAG lightness. Light colors get black text and dark colors get white text.
- `getThemeSurface(hex)` creates a calmer `oklch()` background from the same color.
  It keeps the hue and limits strong saturation.

### Website text and translations

Website text needs a Lingui macro so it can be translated:

- Use `<Trans>` for JSX text.
- Use `` t`...` `` for attributes and inline text.
- Use `msg` for text declared outside a component, then render it with
  `i18n._`.

After changing website text:

1. Run `bun run i18n:extract`.
2. Update the changed `.po` files.
3. Run `bun run i18n:compile`.
4. Do not commit generated `messages.ts` files.

See [TRANSLATING.md](TRANSLATING.md) for the full translation flow.

## Database changes

If you change `prisma/schema.prisma`:

1. Make the schema change.
2. Run `bun run db:dev` to create and apply a local migration.
3. Read the SQL in `prisma/migrations/`.
4. Run `bun run db:generate`.
5. Include the schema and migration in the pull request.

> [!WARNING]
> Do not edit `prisma/generated/` or change a migration that is already merged.
> Create a new migration for later database changes.

## Check your work

Before opening a pull request, run:

```sh
bun run lint
bun prettier --check .
bun run build
```

Run these too when they apply:

- For website text or translations:

  ```sh
  bun run i18n:extract
  bun run i18n:compile
  ```

- For a database schema change:

  ```sh
  bun run db:dev
  bun run db:generate
  ```

> [!IMPORTANT]
> `bun run build` also generates the Prisma client and Lingui files. It needs a
> valid `.env` with `DATABASE_URL` and `NEXT_PUBLIC_CDN_URL` set.

## Open a pull request

A pull request is easier to review when it has:

- [ ] A short summary of the problem and solution.
- [ ] Links to related issues or discussions.
- [ ] Screenshots or a short recording for UI changes, including mobile when it matters.
- [ ] Migration details for database changes.
- [ ] Translation context, source language, and credit when needed.

> [!WARNING]
> Do not include credentials, generated files, unrelated refactors, or
> repository-wide formatting changes in a pull request.

Reply to review feedback with follow-up commits. Do not force-push away review
context unless someone asks you to.

## License and attribution

By contributing, you agree that original code uses GPL-3.0 and original
non-code assets use CC BY-NC-SA 4.0. See [LICENSE](LICENSE) for details. This
is an unofficial fan project, so please respect the rights of Ado, other rights
holders, translators, and contributors.
