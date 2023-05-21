# improveme.io

This is the app.

## Setup

Run `pnpm i` in the project root. If you don't yet have `pnpm` set up, [refer to the docs](https://pnpm.io/installation#using-homebrew).

Ask for the `.env` file from @robotkutya.

Open a secure connection to PlanetScale with `pscale connect imio dev --port 3309 --org improveme-io`. If you don't yet have `pscale` set up, [refer to the docs](https://github.com/planetscale/cli#installation).

Run `pnpm dev` to start up the development server.

## Deployment

We work on the `main` branch, which is our development environment. By creating a merge request to the `production` branch, we automatically deploy to our domain.
