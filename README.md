# improveme.io

We have a client-side React app on top of the Next.js metaframework and Vercel's serverless infrastructure. Authentication is handled by Clerk, which is a backend-as-a-service (BaaS) solution. We use Prisma as our ORM, and Neon's branching database.

Live and deployed at [https://improveme.io](https://improveme.io).

## Setup

Have `nvm` installed, see [docs](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).

Go to the project root and run `nvm use` and then `corepack enable`. This configures the Node.js version used by our project and enables the `pnpm` package manager for it with the version specified in our `package.json`. If you don't have something installed yet, follow the prompts after issuing these commands. Finally, run `pnpm i` in the project root to install our project'sdependencies.

Ask for the `.env` file from @robotkutya. You can now run `pnpm dev` to start up the development server.

## Deployment / Worklow / Environments

We use a basic Vercel workflow with automatic promotions. Every commit pushed to the main branch will trigger a Production Deployment. Every commit pushed to any other branch will trigger a Preview Deployment. Preview deployments use a copy of the production database and use the "Production" Clerk environment.

Local development uses the "Development" Clerk environment and the `vercel-dev` Neon db branch. This DB branch should be reset to the latest version of the `main` branch when you want an up-to-date version of the database fo your local development environment. When making changes related to data, you should branch off of the `main` DB branch and update your connection string in the `.env` file to point to that branch. You can then run `pnpm db push` into that development branch as you work on your changes. This development branch will be automatically merged back into the `main` branch when you are ready to deploy your changes, with the help of the Neon-Vercel integration.

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
