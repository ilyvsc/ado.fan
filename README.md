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

## Table of Contents

- [Project Overview](#project-overview)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

**ado.fan** is a comprehensive fan-made website dedicated to the phenomenal Japanese singer Ado. This platform serves as a central hub for the global fan community to:

- 🎵 **Discover Music**: Explore Ado's complete discography with high-quality audio streaming
- 🎬 **Watch Music Videos**: Experience her iconic music videos and live performances
- 📰 **Stay Updated**: Get the latest news, releases, and tour announcements
- 👥 **Connect**: Join a passionate community of fans from around the world

> [!IMPORTANT] This project is currently under active development. Many features are subject to change, and while we have numerous exciting ideas in the pipeline, we haven't defined a fixed roadmap yet. We welcome community input and contributions. Share your ideas in our [GitHub Discussions](https://github.com/ilyvsc/ado.fan/discussions)

### Built With

This project is built with a modern, full-stack JavaScript setup:

#### Frontend & Framework

- **[Next.js 15](https://nextjs.org/)**: React-based framework with App Router, Server Components, and built-in optimizations
- **[React 19](https://react.dev/)**: Latest React with improved performance and developer experience
- **[TypeScript](https://www.typescriptlang.org/)**: Full type safety and enhanced IDE support

#### Database & Data Management

- **[PostgreSQL](https://www.postgresql.org/)**: Robust, ACID-compliant relational database
- **[Prisma ORM](https://www.prisma.io/)**: Type-safe database client with migrations and introspection

#### Styling & UI

- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development
- **[shadcn/ui](https://ui.shadcn.com/)**: High-quality, accessible React components built on Radix UI
- **[Radix UI](https://www.radix-ui.com/)**: Unstyled, accessible components for design systems

#### Development Tools

- **Package Manager**: Flexible support for [pnpm](https://pnpm.io/), [npm](https://npmjs.com/), [yarn](https://yarnpkg.com/), or any of your choice.
- **[ESLint](https://eslint.org/)**: Code linting for consistent code quality
- **[Prettier](https://prettier.io/)**: Code formatting for consistent style
- **[Docker](https://www.docker.com/)**: Containerization for consistent deployment environments

## Getting Started

Follow this comprehensive guide to set up the project locally. The process is straightforward and should take about 10-15 minutes.

> [!NOTE] This project supports **any modern package manager**. Choose the one you prefer. Examples in this documentation use `pnpm`, just replace `pnpm` with your preferred package manager throughout the commands.

### Installation

#### 1. Clone the Repository

```sh
git clone https://github.com/ilyvsc/ado.fan.git
cd ado.fan
```

#### 2. Install Dependencies

```sh
pnpm install
```

This will install all required dependencies including Next.js, React, TypeScript, Tailwind CSS, and development tools.

### Environment Configuration

#### 3. Set Up Environment Variables

Open `.env` in your favorite editor and configure the required variables. See the [Environment Variables](#environment-variables) section for reference.

```sh
cp sample.env .env
```

### Database Setup

#### 4. Set Up Local Database

Launch a dedicated [Prisma‑powered Postgres instance](https://www.prisma.io/docs/postgres/database/local-development#1-launching-local-prisma-postgres) in local:

```sh
pnpm prisma dev --name="ado.fan"
```

#### 5. Generate Prisma Client

Generate the type-safe Prisma client based on your schema:

```sh
pnpm prisma generate --no-engine
```

#### 6. Apply Database Migrations

Initialize your database with the required tables and schema:

```sh
pnpm prisma migrate dev
```

This command will:

- Apply all pending migrations to your database
- Generate a new migration if schema changes are detected
- Regenerate the Prisma client

#### 7. Seed Database (Optional)

Populate your database with data including Ado's songs and albums:

```sh
pnpm prisma db seed
```

The seed data includes:

- Complete discography from [`songs.json`](prisma/fixtures/songs/songs.json)
- Album information from [`albums.json`](prisma/fixtures/albums.json)
- Cover songs data from [`covers.json`](prisma/fixtures/songs/covers.json)
- NicoNico Douga cover songs (2017-2024 songs) data from [`nico-covers.json`](prisma/fixtures/songs/nico-covers.json)

## Development

### Start the Development Server

Launch the development server with hot reloading:

```sh
pnpm run dev
```

🎉 **Success!** The application will be available at:

- **Website**: [http://localhost:3000](http://localhost:3000)
- **Database Studio**: Run `pnpm prisma studio` to explore your data

## Environment Variables

Configure these environment variables in your `.env` file for proper application functionality:

### Required Variables

- `DATABASE_URL`: **Required**. Sets the URL where Prisma is going to fetch/query data from.
  - Get a production-ready database at [Prisma](https://prisma.io), [Supabase](https://supabase.com/), [Render](https://render.com), or similar.

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help makes ado.fan better for everyone.

### How to Contribute

1. **Fork the Repository**

   ```sh
   git fork https://github.com/ilyvsc/ado.fan.git
   ```

2. **Create a Feature Branch**

   ```sh
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow our coding guidelines (see workspace rules)
   - Ensure your code is properly typed with TypeScript
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**

   ```sh
   pnpm run lint
   pnpm run build
   ```

5. **Commit Your Changes**

   ```sh
   git commit -m "Add amazing feature"
   ```

6. **Push to Your Fork**

   ```sh
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes in detail
   - Link any related issues
   - Include screenshots for UI changes

### Development Guidelines

- **Code Style**: We use Prettier and ESLint for consistent formatting
- **TypeScript**: Strict type checking is enforced
- **Components**: Follow the established component patterns
- **Accessibility**: Ensure all UI changes are accessible
- **Performance**: Consider loading times and bundle size

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
