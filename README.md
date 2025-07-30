[![Adobum][banner-image]][website-url]

<div align="center">

[![Build CI Status][ci-badge]](https://github.com/ilyvsc/ado.fan/actions/workflows/ci.yml)
[![contributions welcome][contributions-badge]](CODE_OF_CONDUCT.md)
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

## Project Overview

This project is a fan-made website dedicated to the Japanese singer Ado. It's a place for fans to discover her music, watch music videos, and stay up-to-date with her latest activities. The goal is to create a comprehensive and beautifully designed resource for the fan community.

This is a full-stack application built with modern web technologies, designed to be scalable, performant, and easy to contribute to.

### Built With

This project is built with a modern, full-stack JavaScript setup:

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Containerization**: [Docker](https://www.docker.com/)

## Getting Started

To get a local copy up and running, follow one of these simple setup methods.

### Manual Setup

If you prefer to set up the project manually on your local machine.

#### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/installation)

#### Install Dependencies

```sh
pnpm install
```

#### Configure Environment

Duplicate [`sample.env`](sample.env) -> `.env` and populate all keys specified in [environment variables](#environment-variables).

```sh
cp sample.env .env
```

#### Bootstrap local database

Launch a dedicated [Prisma‑powered Postgres instance](https://www.prisma.io/docs/postgres/database/local-development#1-launching-local-prisma-postgres) in local:

```sh
pnpm prisma dev --name="ado.fan"
```

##### Generate Prisma Client

```sh
pnpm prisma generate --no-engine
```

##### Apply Migrations & Seed (Optional)

Run Prisma migrations to initialize the database:

```sh
pnpm prisma migrate dev
```

Seed the database with data from [`songs.json`](prisma/fixtures/songs.json):

```sh
pnpm prisma db seed
```

#### Run the development server

```sh
pnpm run dev
```

This will initialize all packages in parallel and watch for changes, including the website, which will be available at [localhost:3000](http://localhost:3000).

### Environment variables

- `DATABASE_URL`: **Required**. Sets the URL where Prisma is going to fetch/query data from.
  - Get a production-ready database at [Prisma](https://prisma.io), [Supabase](https://supabase.com/), [Render](https://render.com), or similar.

## License

This project is an unofficial, non-commercial fan project that makes use of multiple licenses:

**Original Source Code**: GNU General Public License v3.0 (GPL-3.0)

**Original Non-Code Assets**: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

Full license details and copyright notices are provided in the [LICENSE](LICENSE) file.

© Copyright 2025 <https://ado.fan/>

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
