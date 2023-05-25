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

## Frontend Development Notes

add components with command:
`pnpm run add-ui`

more info:
https://ui.shadcn.com/docs#what-do-you-mean-by-not-a-component-library
underlying component library:
https://www.radix-ui.com/
styling:
https://tailwindcss.com/
icons:
https://lucide.dev/
structure inside `src/` folder:
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
the `components/ui` folder is where you put the "atoms"
the `components` folder is where you put the more specific or more complex stuff
the `pages` folder is how you organize your pages and define the routes
(see e.g. `localhost:3000/feedback/create` vs `localhost:3000/lego` vs `localhost:3000/`)
the `styles` folder is where you put your global styles (don't touch this, use `tailwind.config.js` instead)
the `lib` folder is where you put your "utility" functions
the `hooks` folder is where you put your custom react hooks
WARNING: if you create a new page, you need to be logged in to see it, all routes are protected
workflow:

1. run the `pnpm run add-ui` command and specify `/src/components/shadcn` as the folder
   NOTE: some components are native to react and don't need to be installed`
2. copy-paste component code to a new file in the `src/components/ui` folder
3. (optional) modify the component to fit your needs
4. import into page with `import { Accordion, ... } from "~/components/ui/accordion"`

## NOTE:

please use the following coding style for your components:

````type FooProps = {
  foo: string;
  bar: string;
}
export const Foo = (props: FooProps) => {
  return (
    <div>
      <h1>props.foo</h1>
      <p>props.bar</p>
    </div>
  );
}```
and when you use it:
`<Foo foo="foo" bar="bar" />`
````
