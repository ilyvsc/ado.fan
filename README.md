[![Adobum][banner-image]][banner-url]

<div align="center">

[![Build CI Status](https://github.com/ilyvsc/ado.fan/actions/workflows/build.yml/badge.svg)](https://github.com/ilyvsc/ado.fan/actions/workflows/build.yml)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen?logo=github&labelColor=001219&color=blue)](CODE_OF_CONDUCT.md)
[![code style](https://img.shields.io/badge/code_style-prettier-F7B93E.svg?labelColor=001219)](https://github.com/prettier/prettier)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fado.fan&labelColor=001219)](https://ado.fan)
[![Join Ado Hangout Discord!](https://img.shields.io/badge/Ado_Hangout-001219?logo=discord)][fan-discord]

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

## Development

> [!WARNING]
> This section is intended for experienced/enthusiasts developers comfortable with full-stack JavaScript projects.

Setting up a local development environment is easy, for now.

Clone (or fork) this repo on your machine, navigate to its location in the terminal, and follow the steps below.

### Manual Setup

Setup by hand, if something breaks or it's not working properly **it's on you**.

#### Install dependencies

```sh
pnpm install
```

#### Setup Environment Variables

Create a `.env` file at the project's root directory. Refer to the [environment variables](#environment-variables) section to read the full specifications.

#### Initialize Prisma

Run Prisma migrations to initialize the database:

```sh
pnpm prisma migrate dev
```

Then, generate a Prisma client to handle queries:

```sh
pnpm prisma generate --no-engine
```

#### Run the development server

```sh
pnpm run dev
```

This will initialize all packages in parallel and watch for changes, including the website, which will be available at [localhost:3000](http://localhost:3000).

### Environment variables

To deploy the project, you need to set the following environment variables:

- `DATABASE_URL`: **Required**. Sets the URL where Prisma is going to fetch/query data from. Get yours at <https://prisma.io>

<!-- link definitions -->
[banner-url]: https://www.ado.fan/
[banner-image]: https://ado-shop.com/cdn/shop/files/Ado_BEST_5000x2000_banner_ENG2.jpg
[fan-discord]: https://discord.gg/ado1024

## License

This project is an unofficial, non-commercial fan project that makes use of multiple licenses:

**Original Source Code**: GNU General Public License v3.0 (GPL-3.0)

**Original Non-Code Assets**: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

Full license details and copyright notices are provided in the [LICENSE](LICENSE) file.

© Copyright 2025 <https://ado.fan/>
