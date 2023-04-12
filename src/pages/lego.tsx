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
import { useUser } from "@clerk/nextjs";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { UserIcon, SendIcon, StepForwardIcon } from "lucide-react";

const FeedbackAuthorList = () => {
  return (
    <section className="px-4 pb-8 pt-4">
      <h2 className="mb-4 flex text-xl">
        <UserIcon className="mr-2" />
        Feedback Author
      </h2>
      <EditFeedbackAuthor />
    </section>
  );
};

const EditFeedbackAuthor = () => {
  return (
    <section className="rounded-lg border border-slate-100 px-8 py-8">
      <h3> Who is the person you’d like to get feedback from?</h3>
      <div className="flex flex-wrap items-end justify-between pt-8">
        <div className="mr-6 flex flex-grow flex-col">
          <Label>E-Mail Address</Label>
          <Input type="email" placeholder="todd@burchik.com" />
        </div>
        <div className="mr-6 flex flex-grow flex-col">
          <Label>Name</Label>
          <Input type="text" placeholder="Todd Burchik" />
        </div>
        <Button className="flex-grow-0" disabled variant={"outline"}>
          Add more Authors…
        </Button>
      </div>
    </section>
  );
};

const IntroParagraph = () => {
  return (
    <section className="px-4 py-4">
      <h2 className="mb-4 flex text-xl">
        <SendIcon className="mr-2" />
        Introductory Paragraph
      </h2>
      <div className="flex flex-col py-8 pl-8 pr-0">
        <Label>
          Write some text to explain on a personal level what kind of feedback
          you are asking for and why.
        </Label>
        <Textarea
          className="mt-2 h-96 font-dm-mono text-xl"
          placeholder="Type your message here."
        />
      </div>
    </section>
  );
};

const Lego: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>LEGO Home</title>
        <meta
          name="description"
          content="beatles in the background, bricks in my hands, oh time, oh time to be a child again"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="items-left justify-left flex min-h-screen flex-col">
        <div className="container flex flex-col px-4 pb-8 pt-4 ">
          <header className="pb-8">
            <p className="text-l mt-0">Create Feedback Request</p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Hello {user.user?.firstName ?? "You"}
            </h1>
          </header>
          <FeedbackAuthorList />
          <IntroParagraph />
        </div>
        <footer className="container flex justify-end px-8 pb-16 pt-8">
          <Button size="lg">
            <StepForwardIcon className="mr-2" />
            Start Adding Feedback Items…
          </Button>
        </footer>
      </main>
    </>
  );
};

export default Lego;
