// figma:
// https://www.figma.com/file/Uj2Fuvmt7ahv0UysYpgI4C
//
// copy-paste components from here:
// https://ui.shadcn.com/docs#what-do-you-mean-by-not-a-component-library
//
// underlying component library:
// https://www.radix-ui.com/
//
// styling:
// https://tailwindcss.com/
//
// icons:
// https://lucide.dev/
//
// structure inside `src/` folder:
// ├── components
// │   ├── ui
// │   │   ├── alert-dialog.tsx
// │   │   ├── button.tsx
// │   │   ├── dropdown-menu.tsx
// │   │   └── ...
// │   ├── main-nav.tsx
// │   ├── page-header.tsx
// │   └── ...
// ├── hooks
// ├── lib
// │   └── utils.ts
// ├── pages
// ├── styles
// │   └── globals.css
//
// the `components/ui` folder is where you put the "atoms"
// the `components` folder is where you put the more specific or more complex stuff
// the `pages` folder is how you organize your pages and define the routes
// (see e.g. `localhost:3000/feedback/create` vs `localhost:3000/lego` vs `localhost:3000/`)
// the `styles` folder is where you put your global styles (don't touch this, use `tailwind.config.js` instead)
// the `lib` folder is where you put your "utility" functions
// the `hooks` folder is where you put your custom react hooks
//
// WARNING: if you create a new page, you need to be logged in to see it, all routes are protected
//
// workflow:
// 1. install the `radix-ui` component, e.g. `pnpm add @radix-ui/react-accordion`
// NOTE: some components are native to react and don't need to be installed`
// 2. copy-paste from the docs into `components/ui/accordion.tsx`
// 3. (optional) modify the component to fit your needs
// 4. import into page with `import { Accordion, ... } from "~/components/ui/accordion"`
//

import { type NextPage } from "next";
import Head from "next/head";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const Lego: NextPage = () => {
  return (
    <>
      <Head>
        <title>lego me</title>
        <meta
          name="description"
          content="beatles in the background, bricks in my hands, oh time, oh time to be a child again"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            lego <span className="text-[hsl(280,100%,70%)]">ME</span> Daddy
          </h1>
          <p className="text-3xl tracking-tight text-white">accordion demo</p>
          {/* ACCORDION DEMO START */}
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&lsquo; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&lsquo;s animated by default, but you can disable it if
                you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* ACCORDION DEMO END */}
        </div>
      </main>
    </>
  );
};

export default Lego;
