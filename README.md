[![Adobum][banner-image]][website-url]

<div align="center">

[![Build CI Status][ci-badge]](https://github.com/ilyvsc/ado.fan/actions/workflows/ci.yml)
[![contributions welcome][contributions-badge]](CONTRIBUTING.md)
[![code style][prettier-badge]](https://github.com/prettier/prettier)
[![Website][uptime-badge]][website-url]
[![Join Ado Hangout Discord!][discord-badge]][fan-discord]

<p>
<br>
A fan tribute to the Japanese artist Ado.
<br>
<sub>
  Built with 💙 by
  <a href="https://github.com/ilyvsc/ado.fan/graphs/contributors">
    fans.
  </a>
  Powered by passion, not profit.
</sub>
</p>

</div>

## Table of Contents

- [Project overview](#project-overview)
- [Documentation](#documentation)
- [Stack](#stack)
- [Quick start](#quick-start)
- [Commands](#commands)
- [Project layout](#project-layout)
- [Contributing](#contributing)
- [License](#license)

## Project overview

**ado.fan** is a non-commercial fan-made website about the Japanese singer Ado.
It brings together discography information, lyrics, music videos, news, and fan
community resources.

The project is under active development. Discuss ideas and larger proposals in
[GitHub Discussions](https://github.com/ilyvsc/ado.fan/discussions).

## Documentation

| Audience                                                         | Guide                              |
| ---------------------------------------------------------------- | ---------------------------------- |
| Code, design, documentation, data, and pull-request contributors | [CONTRIBUTING.md](CONTRIBUTING.md) |
| UI and lyrics translators                                        | [TRANSLATING.md](TRANSLATING.md)   |
| Local setup and available commands                               | This README                        |

## Stack

- Next.js 16, React 19, and strict TypeScript
- Tailwind CSS v4, shadcn/ui, and Radix UI
- Prisma ORM with PostgreSQL
- Lingui v6 for UI localization
- Bun as the primary package manager and command runner

## Quick start

### Prerequisites

- [Bun](https://bun.sh/) or any other package manager
- A PostgreSQL-compatible database and a `DATABASE_URL`

> [!NOTE]
> This documentation uses `bun` because continuous integration uses Bun and
> Node 24. You may use any modern package manager except `npm`. Do not commit
> an additional lockfile.

### Clone and install

```sh
git clone git@github.com:ilyvsc/ado.fan.git
cd ado.fan
bun install
```

### Configure environment variables

Create a local environment file and set the database URL for the database you
will use:

```sh
cp sample.env .env
```

| Variable              | Required | Purpose                                                               |
| --------------------- | -------- | --------------------------------------------------------------------- |
| `DATABASE_URL`        | Yes      | Connection string used by Prisma.                                     |
| `NEXT_PUBLIC_CDN_URL` | Yes      | Base URL for remote images. `next.config.ts` validates it at startup. |
| `NODE_ENV`            | No       | Local development defaults to `development`.                          |

`sample.env` shows the expected Prisma Postgres connection-string format. Do not
commit `.env` files or credentials.

### Prepare the database

Generate the Prisma client, apply local migrations, and optionally seed local
development data:

```sh
bun run db:generate
bun run db:dev
bun run db:seed
```

> [!WARNING]
> `db:seed` clears and repopulates the local song, album, and lyrics tables.
> Use it only with a disposable local database.

### Run the application

```sh
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Run `bun run db:studio` to
inspect the local database with Prisma Studio.

## Commands

| Command               | Purpose                                                                          |
| --------------------- | -------------------------------------------------------------------------------- |
| `bun run dev`         | Start the Next.js development server with Turbopack.                             |
| `bun run build`       | Generate Prisma and Lingui artifacts, then create a production build.            |
| `bun run lint`        | Run ESLint across the project.                                                   |
| `bun run lint:fix`    | Run ESLint and apply available fixes.                                            |
| `bun run format`      | Format the repository with Prettier. Review resulting changes before committing. |
| `bun run db:generate` | Regenerate Prisma client files.                                                  |
| `bun run db:dev`      | Create and apply local Prisma migrations.                                        |
| `bun run db:seed`     | Replace local database content with development data.                            |
| `bun run db:studio`   | Open Prisma Studio.                                                              |

The generated Prisma client and compiled Lingui `messages.ts` catalogs are
ignored by Git. Commit migration files and source `.po` catalogs instead.

## Project layout

```text
app/                 Routes, route handlers, layouts, and page metadata
features/            Domain-specific UI and logic
shared/              Reusable components, i18n, hooks, providers, and utilities
server/db/           Database access and serialization
types/               Shared domain types
prisma/              Schema, migrations, and generated client
styles/              Tailwind theme and global styles
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. It covers
repository conventions, validation, database changes, pull-request scope, and
licensing.

## License

This is an unofficial, non-commercial fan project. Original source code is
licensed under GPL-3.0, while original non-code assets are licensed under
CC BY-NC-SA 4.0. See [LICENSE](LICENSE) for copyright, trademark, and full
license details.

<!-- link definitions --urls-- -->

[website-url]: https://www.ado.fan/
[fan-discord]: https://discord.gg/ado1024

<!-- link definitions --other-- -->

[banner-image]: https://ado-shop.com/cdn/shop/files/Ado_BEST_5000x2000_banner_ENG2.jpg

<!-- link definitions --badges-- -->

[ci-badge]: https://github.com/ilyvsc/ado.fan/actions/workflows/ci.yml/badge.svg
[discord-badge]: https://img.shields.io/badge/Ado_Hangout-001219?logo=discord
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-F7B93E.svg?labelColor=001219
[contributions-badge]: https://img.shields.io/badge/contributions-welcome-brightgreen?logo=github&color=blue&labelColor=001219
[uptime-badge]: https://img.shields.io/website?url=https%3A%2F%2Fado.fan&labelColor=001219
