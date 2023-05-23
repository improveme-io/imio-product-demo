# improveme.io

This is the app.

## Setup

Run `pnpm i` in the project root. If you don't yet have `pnpm` set up, [refer to the docs](https://pnpm.io/installation#using-homebrew).

Ask for the `.env` file from @robotkutya.

Open a secure connection to PlanetScale with `pscale connect imio dev --port 3309 --org improveme-io`. If you don't yet have `pscale` set up, [refer to the docs](https://github.com/planetscale/cli#installation).

Run `pnpm dev` to start up the development server.

## Deployment

We have 2 environments:

- `dev` --> local, preview, staging
  - clerk `development` instance
  - planetscale `dev` database branch
  - auto-deployed by merging to `main` git branch
- `production` --> production
  - clerk `production` instance
  - planetscale `main` database branch
  - auto-deployed by merging to `production` git branch

WARNING local dev, preview branches and staging shares one environment both for auth and for data. If you change anything, it will affect everyone and all of these environments.
