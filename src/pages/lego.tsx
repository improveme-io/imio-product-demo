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

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  UserIcon,
  SendIcon,
  StepForwardIcon,
  EditIcon,
  PuzzleIcon,
  UploadCloudIcon,
  ViewIcon,
  TrashIcon,
  LeafIcon,
  SproutIcon,
  InboxIcon,
  CheckIcon,
} from "lucide-react";

import { useUser } from "@clerk/nextjs";

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
    <Card weight={"lg"}>
      <h3> Who is the person you&apos;d like to get feedback from?</h3>
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
    </Card>
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

const StepSetup = () => {
  return (
    <>
      <header className="pb-8">
        <p className="text-l mb-1 mt-0">Create Feedback Request</p>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Feedback Setup
        </h1>
      </header>
      <FeedbackAuthorList />
      <IntroParagraph />
      <Separator className="my-4" />
      <footer className="flex justify-end pb-16 pl-8 pt-8">
        <Button size="lg">
          <StepForwardIcon className="mr-2" />
          Start Adding Feedback Items…
        </Button>
      </footer>
    </>
  );
};

const UserItem = (fallbackUserName: string, userName: string) => {
  const fallback = fallbackUserName;
  const user = userName;
  return (
    <li className="mr-6 inline-flex">
      <Avatar className="mr-2 h-6 w-6 text-xs text-slate-500">
        <AvatarImage></AvatarImage>
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      {user}
    </li>
  );
};

const EditButton = () => {
  return (
    <Button
      className="ml-5 opacity-0 group-hover:opacity-100"
      variant={"ghost"}
      size={"sm"}
    >
      <EditIcon className="mr-2 h-4 w-4" />
      Edit
    </Button>
  );
};

const GeneralSettingsSummary = () => {
  return (
    <Card weight={"sm"}>
      <section className="group mb-6 grid grid-cols-4 gap-y-10 rounded px-2 py-2 hover:bg-slate-50 dark:hover:border-slate-500">
        <div className="col-span-3">
          <h4 className="flex">
            <UserIcon className="mr-2" />
            Feedback Authors
          </h4>
          <ul className="grid-span-3 mt-4 pl-8">
            {UserItem("TB", "Todd Burchik")}
            {UserItem("MF", "Mihaly Füredi")}
          </ul>
        </div>
        <div className="col-span-1 flex justify-end">
          <EditButton />
        </div>
      </section>
      <section className="group mb-6 grid grid-cols-4 gap-y-10 rounded px-2 py-2 hover:bg-slate-50 dark:hover:border-slate-500">
        <div className="col-span-3">
          <h4 className="flex">
            <SendIcon className="mr-2" />
            Introductory Paragraph
          </h4>
          <p className="grid-span-3 mt-4 pl-8">
            I gather feedback regularly after meaningful work interactions. I
            ask you to use prose and hope that you&apos;ll have more to say than
            260 characters.
          </p>
        </div>
        <div className="col-span-1 flex justify-end">
          <EditButton />
        </div>
      </section>
    </Card>
  );
};

const Dashboard = () => {
  const user = useUser();
  return (
    <>
      <header className="flex justify-between pb-8">
        <h1 className="group flex text-3xl font-extrabold tracking-tight">
          Hello{" "}
          <Avatar className="mx-2 text-xl text-slate-500">
            <AvatarImage></AvatarImage>
            <AvatarFallback>KG</AvatarFallback>
          </Avatar>{" "}
          {user.user?.firstName ?? "You"}
          <EditButton />
        </h1>
        <Button className="my-6" size={"lg"}>
          <LeafIcon className="mr-2" />
          Request New Feedback
        </Button>
      </header>
      <h2 className="mb-4 mt-8 flex text-xl">
        <InboxIcon className="mr-2" />
        Your Contributions
      </h2>
      <section className="grid grid-cols-3 gap-4">
        {Contribution(
          "First 100 Days Peer Feedback",
          "TB",
          "Todd Burchik",
          false
        )}
        {Contribution("Q1 Peer Feedback", "MF", "Mihaly Füredi", true)}
        {Contribution("Q1 Peer Feedback", "BG", "Brooke Gazdag", true)}
        {Contribution("Q1 Peer Feedback", "RD", "Ronald Ducklington", true)}
      </section>
      <h2 className="mb-4 mt-8 flex text-xl">
        <LeafIcon className="mr-2" />
        Your Feedback Requests
      </h2>
      {FeedbackRequestItem("Quarterly Feedback Q2")}
      {FeedbackRequestItem("Quarterly Feedback Q1")}
      {FeedbackRequestItem("First 100 days")}
      <h2 className="mb-4 mt-8 flex text-xl">
        <SproutIcon className="mr-2" />
        Feedback Requests Shared with You
      </h2>
      <p className="my-32 text-center">
        There are no Feedback Requests shared with you yet.
      </p>
    </>
  );
};

const Contribution = (
  requestNameTxt: string,
  requesterInitialsTxt: string,
  requesterNameTxt: string,
  doneBool: boolean
) => {
  const requestName = requestNameTxt;
  const requesterInitials = requesterInitialsTxt;
  const requesterName = requesterNameTxt;
  const done = doneBool;
  return (
    <Card variant={"hoverable"} className="flex flex-col">
      <div className="mb-4 flex items-center">
        {UserItem(requesterInitials, requesterName)}
        {done ? (
          <CheckIcon className="ml-auto h-5 w-5 text-green-500" />
        ) : (
          <></>
        )}
      </div>
      <Label>{requestName}</Label>
      {done ? (
        <Button
          variant={"outline"}
          className="mt-4 opacity-0 hover:bg-slate-50 group-hover:opacity-100"
        >
          <ViewIcon className="mr-2" />
          View
        </Button>
      ) : (
        <Button className="mt-4">
          <EditIcon className="mr-2" />
          Author Feedback
        </Button>
      )}
    </Card>
  );
};

const FeedbackItemList = () => {
  return (
    <>
      <h2 className="mb-4 mt-8 flex text-xl">
        <PuzzleIcon className="mr-2" />
        Feedback Items
      </h2>
      <p className="w-4/6 px-3 py-1 pl-8">
        Feedback authors will be presented with several Feedback Items. Feedback
        items generally consist of a prompt and some kind of input provided by
        the author. Most commonly, a question and prose written as an answer.
      </p>
      <FeedbackItem />
      <AddFeedbackItem />
      <Button disabled variant={"outline"} className="my-5 w-full">
        Add New Feedback Item (1 left)
      </Button>
    </>
  );
};

const AddFeedbackItem = () => {
  return (
    <Card weight={"lg"} className="mt-6">
      <h3 className="flex text-xl">Add Feedback Item</h3>
      <div className="my-4">
        <div className="mb-4 flex flex-grow flex-col">
          <Label>Type</Label>
          <div className="flex">
            <Select defaultValue="PROSE">
              <SelectTrigger disabled className="w-96">
                <SelectValue placeholder="Select Feedback Item Type…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROSE">Prose</SelectItem>
                <SelectItem value="SHORT_PROSE">
                  Short Prose (240 char max)
                </SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
              </SelectContent>
            </Select>
            <p className="w-96 px-3 py-1 text-xs">
              The author will be shown the propt you&apos;ve defined and will be
              asked to answer in prose at a minimum of 240 characters.
            </p>
          </div>
        </div>
        <div className="flex flex-grow flex-col">
          <Label>Prompt</Label>
          <Input
            type="text"
            placeholder="What do you wish {Author} would change in the future?"
          />
        </div>
        <div className="mt-8 flex justify-end">
          <Button variant={"ghost"} className="mr-2">
            Discard
          </Button>
          <Button>Save</Button>
        </div>
      </div>
    </Card>
  );
};

const FeedbackRequestItem = (requestName: string) => {
  const name = requestName;
  return (
    <Card weight={"lg"} variant={"hoverable"} className="mb-8">
      <div className="flex justify-between">
        <h3 className="flex text-xl">{name}</h3>
        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100">
          <Button variant={"ghost"} className="text-red-500">
            <TrashIcon className="mr-2 h-4 w-4 text-red-500" />
            Delete
          </Button>
          <Button variant={"ghost"}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant={"outline"}>
            <ViewIcon className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
      <div className="my-4 flex gap-4">
        <div className="mb-4 flex flex-grow flex-col">
          <Label>Authors</Label>
          <div className="mt-2 flex">
            {UserItem("TB", "Todd Burchik")}
            {UserItem("MF", "Mihaly Füredi")}
            {UserItem("BG", "Brooke Gazdag")}
          </div>
        </div>
      </div>
    </Card>
  );
};
const FeedbackItem = () => {
  return (
    <Card weight={"lg"} variant={"hoverable"} className="group mt-6">
      <div className="flex justify-between">
        <h3 className="flex text-xl">
          What do you wish Mihaly would do more of in the future or keep doing?
        </h3>
        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100">
          <Button variant={"outline"}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant={"destructive_outline"}>Remove</Button>
        </div>
      </div>
      <div className="my-4 flex gap-4">
        <div className="mb-4 flex flex-grow flex-col">
          <Label>Type</Label>
          <div>Prose</div>
        </div>
      </div>
    </Card>
  );
};

const StepItems = () => {
  return (
    <>
      <header className="pb-8">
        <p className="text-l mb-1 mt-0">Create Feedback Request</p>
        <h1 className="group text-3xl font-extrabold tracking-tight">
          Feedback from Todd & Mihaly
          <EditButton />
        </h1>
      </header>
      <GeneralSettingsSummary />
      <FeedbackItemList />
      <Separator className="my-4" />
      <footer className="flex justify-end pb-16 pl-8 pt-8">
        <Button size="lg">
          <StepForwardIcon className="mr-2" />
          Review Request…
        </Button>
      </footer>
    </>
  );
};

const Introduction = () => {
  const user = useUser();
  return (
    <Card className="mb-16 py-8">
      <h2 className="mb-4 flex content-center items-baseline text-xl">
        <Avatar className="mx-2 text-slate-500">
          <AvatarImage></AvatarImage>
          <AvatarFallback>KG</AvatarFallback>
        </Avatar>{" "}
        {user.user?.fullName ?? "You"}
      </h2>
      <div className="flex py-4 pl-4 pr-0">
        <p className="max-w-lg">
          I gather feedback regularly after meaningful work interactions. I ask
          you to use prose and hope that you&apos;ll have more to say than 260
          characters.
        </p>
      </div>
    </Card>
  );
};

const FeedbackItemProse = (promptText: string) => {
  const prompt = promptText;
  return (
    <section className="group mt-6 ">
      <div className="flex justify-between">
        <h3 className="flex px-8 text-xl">{prompt}</h3>
      </div>
      <div className="flex flex-col py-8 pl-8 pr-0">
        <Label>Please answer in prose, at a minimum of 240 characters.</Label>
        <Textarea
          className="mt-2 h-96 font-dm-mono text-xl"
          placeholder="Type your message here."
        />
      </div>
    </section>
  );
};

const RequestView = () => {
  const user = useUser();
  return (
    <>
      <header className="pb-8">
        <p className="text-l mb-1 mt-0">Create Feedback Request</p>
        <h1 className="group text-3xl font-extrabold tracking-tight">
          Feedback Request from {user.user?.firstName ?? "You"}
        </h1>
      </header>
      <Introduction />
      {FeedbackItemProse(
        "What do you wish Mihaly would do more of in the future or keep doing?"
      )}
      {FeedbackItemProse("What do you wish Mihaly would change in the future?")}
      <footer className="flex justify-end pb-16 pl-8 pt-8">
        <Button size="lg">
          <UploadCloudIcon className="mr-2" />
          Create Feedback Request
        </Button>
      </footer>
    </>
  );
};

const FeedbackItemProseReadOnly = (
  promptText: string,
  feedbackText: string
) => {
  const prompt = promptText;
  const feedback = feedbackText;
  return (
    <section className="group mt-6 ">
      <div className="flex justify-between">
        <h3 className="flex px-8 font-medium">{prompt}</h3>
      </div>
      <div className="flex py-8 pl-8 pr-0">
        <div className="mr-4 flex items-baseline gap-2 ">
          <Avatar className="mx-2 text-slate-500">
            <AvatarImage></AvatarImage>
            <AvatarFallback>TB</AvatarFallback>
          </Avatar>
          {/* Todd Burchik */}
        </div>
        <p className="max-w-2xl">{feedback}</p>
      </div>
    </section>
  );
};

const SubmitRequestView = () => {
  const prompt1 =
    "What do you wish Mihaly would do more of in the future or keep doing?";
  const answer1 = `Generally, I am glad to be working in a more collaborative scenario than I was used to before, on a project with a much bigger scope than something one can manage or accomplish by themselves. This is of course relatively unspecific to the company itself. What makes this especially good in this case is the quality of the work and the intellect of the coworkers: it is genuinely amazing to work with people who are very good at what they do and have enough security in their fields to admit also what they dont know. This is something that is very rare and greatly refreshing.

  Another positive and important aspect is having responsibility and decision-making power, which gives me a chance for me to feel that what we are working on is as much my creation as anyone elses. 
  
  It of course goes without saying that I am also quite happy with the people-friendly work environment - flexible hours, snacks, nice office, etc.
  `;
  const prompt2 = "What do you wish Mihaly would change in the future?";
  const answer2 = `I feel that decision making process lacks structure sometimes, esp. concerning the UX/UI department – but since we are now actively working to change that, I do not see it as a huge problem.

  The company currently really lacks comprehensive marketing and branding strategies, which feels OK now, but I feel it could hurt in the long run.`;

  return (
    <>
      <header className="pb-8">
        <Card weight={"sm"} className="mb-8 text-xs">
          This feedback has been finalized and submitted. You can&apos;t change
          it anymore.
        </Card>
        <h1 className="group text-3xl font-extrabold tracking-tight">
          Your Feedback to FIRSTNAME
        </h1>
      </header>
      {FeedbackItemProseReadOnly(prompt1, answer1)}
      {FeedbackItemProseReadOnly(prompt2, answer2)}
      <footer className="flex justify-end gap-4 pb-16 pl-8 pt-8">
        <Button size="lg" variant={"outline"}>
          <EditIcon className="mr-2" />
          Back to Editing
        </Button>
        <Button size="lg">
          <UploadCloudIcon className="mr-2" />
          Finalize & Send Feedback
        </Button>
      </footer>
    </>
  );
};

const Lego: NextPage = () => {
  return (
    <>
      <Head>
        <title>UI LEGO Home</title>
        <meta
          name="description"
          content="beatles in the background, bricks in my hands, oh time, oh time to be a child again"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="items-left justify-left flex min-h-screen flex-col">
        <Tabs defaultValue="DASHBOARD">
          <TabsList>
            <TabsTrigger value="DASHBOARD">0. Dashboard</TabsTrigger>
            <TabsTrigger value="SETUP">1. General Setup</TabsTrigger>
            <TabsTrigger value="ITEMS">2. Feedback Items</TabsTrigger>
            <TabsTrigger value="REVIEW">3. Review Request</TabsTrigger>
            <TabsTrigger value="SUBMIT">Submit Feedback</TabsTrigger>
          </TabsList>
          <div className="flex flex-col px-4 pb-8 pt-4">
            <TabsContent className="mt-0 border-none p-0" value="DASHBOARD">
              <Dashboard />
            </TabsContent>
            <TabsContent className="mt-0 border-none p-0" value="ITEMS">
              <StepItems />
            </TabsContent>
            <TabsContent className="mt-0 border-none p-0" value="SETUP">
              <StepSetup />
            </TabsContent>
            <TabsContent className="mt-0 border-none p-0" value="REVIEW">
              <RequestView />
            </TabsContent>
            <TabsContent className="mt-0 border-none p-0" value="SUBMIT">
              <SubmitRequestView />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </>
  );
};

export default Lego;
