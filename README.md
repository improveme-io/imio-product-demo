# improveme.io

We have a client-side React app on top of the Next.js metaframework and Vercel's serverless infrastructure. Authentication is handled by Clerk, which is a backend-as-a-service (BaaS) solution. We use Prisma as our ORM, and Neon's branching database.

Live and deployed at [https://improveme.io](https://improveme.io).

## Setup

Have `nvm` installed, see [docs](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating). Alternatively, you can use [fnm](https://github.com/Schniz/fnm#shell-setup).

Go to the project root and run `nvm use` (or `fnm use`) and then `corepack enable`. This configures the Node.js version used by our project and enables the `pnpm` package manager for it with the version specified in our `package.json`. If you don't have something installed yet, follow the prompts after issuing these commands. Finally, run `pnpm i` in the project root to install our project'sdependencies.

You will need to open a secure connection for Clerk webhook events. Please ask for an ngrok auth token from @robotkutya. You can install ngrok on a Mac with `brew install ngrok/ngrok/ngrok` (this is not a typo, yes, it is `ngrok/ngrok/ngrok`) and then add your token with `ngrok config <AUTH_TOKEN>`. You can now open a secure connection between our Clerk webhook and your local development server with `ngrok http --url=gentle-chow-present.ngrok-free.app 1337`.

Please ask for a `.env` file from @robotkutya, then place it in the project root. You can now start up the development server with `pnpm dev`.

## Deployment / Environments / Workflow

We use a basic Vercel workflow with automatic promotions. Every commit pushed to `main` branch will trigger a Production Deployment. Every commit pushed to any other branch will trigger a Preview Deployment for said branch. Preview deployments use a copy of the production database and use the "Production" Clerk environment.

The local development server uses the "Development" Clerk environment and the `vercel-dev` Neon db branch. You need to establish a secure connection to handle Clerk webhook events locally. See the Setup section above for instructions on how to do this.

Preview branches use the "Production" Clerk environment and a database branch that is automatically branched off of `main` and created for each preview branch. When in the context of a Preview deployment, changes made to the Clerk user (e.g. updating a name, changing the avatar or email address) will also make changes to live production data, please be conscious of this. When needed, you can always reset the preview database branch to the latest version of the `main` branch via the Neon UI console or the Neon CLI tool.

Currently we don't handle database migrations, it is a work in progress.

## Frontend Development Notes

- We are using the [shadcn/ui component library](https://ui.shadcn.com/docs#what-do-you-mean-by-not-a-component-library)
- styling is handled by [Tailwind CSS](https://tailwindcss.com/)
- our icon set is [Lucide Icons](https://lucide.dev/)

- structure inside `src/` folder

```bash
├── components
│ ├── ui
│ │ ├── alert-dialog.tsx
│ │ ├── button.tsx
│ │ ├── dropdown-menu.tsx
│ │ └── ...
│ ├── main-nav.tsx
│ ├── page-header.tsx
│ └── ...
├── hooks
├── lib
│ └── utils.ts
├── pages
├── styles
│ └── globals.css
```

the `components/ui` folder is where you put the "atoms"
the `components` folder is where you put the more specific or more complex stuff
the `pages` folder is how you organize your pages and define the routes
(see e.g. `localhost:3000/feedback/create` vs `localhost:3000/lego` vs `localhost:3000/`)
the `styles` folder is where you put your global styles (don't touch this, use `tailwind.config.js` instead)
the `lib` folder is where you put your "utility" functions
the `hooks` folder is where you put your custom react hooks

WARNING: if you create a new page, you need to be logged in to see it, all routes are protected

workflow for adding a new UI component:

1. run the `pnpm run add-ui` command and specify `/src/components/shadcn` as the folder
2. install new `radix-ui` dependencies if needed
3. copy-paste component code to a new file in the `src/components/ui` folder, ideally with the same name
4. update import for `cn` function and usually there are a few ESLint rule violations (`import {type Foo}`)
5. (optional) modify the component to fit your needs
6. import into page with `import { Accordion, ... } from "~/components/ui/accordion"`

Please use the following coding style for your components:

```ts
type FooProps = {
  title: string;
  text: string;
};

export const Foo = (props: FooProps) => {
  return (
    <div>
      <h1>props.title</h1>
      <p>props.text</p>
    </div>
  );
};
```

and then use it as `<Foo foo="foo" bar="bar" />` inside your pages / components.

Please don't use ternary operators inside the render function. So

```ts
// BAD
return <div>{foo ? <Foo /> : <Bar />}</div>;

// GOOD
return (
  <div>
    {foo && <Foo />}
    {!foo && <Bar />}
  </div>
);
```
