# improveme.io

This is the app.

## Setup

Run `pnpm i` in the project root. If you don't yet have `pnpm` set up, [refer to the docs](https://pnpm.io/installation#using-homebrew).

Ask for the `.env` file from @robotkutya.

~~Open a secure connection to PlanetScale with `pscale connect imio dev --port 3309 --org improveme-io`. If you don't yet have `pscale` set up, [refer to the docs](https://github.com/planetscale/cli#installation).~~
TBD: currently migrating to Vercel's hosted Postgres

Run `pnpm dev` to start up the development server.

## Deployment

We use a baic Vercel workflow with promotions for prod deployment

- Every commit pushed to the main branch will trigger a Production Deployment instead of the usual Preview Deployment.
- Production deployments will need to be [manually promoted](https://vercel.com/docs/deployments/managing-deployments#promote-deployment-to-production).

WARNING local dev and preview branches sharee one environment both for auth and for data. If you change something, it will affect everyone and all of these environments.

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
