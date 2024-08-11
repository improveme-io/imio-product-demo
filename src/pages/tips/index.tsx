import { type NextPage } from "next";
import Image from "next/image";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  MessageCircle,
  LayoutDashboardIcon,
  Check,
  CircleSlashed,
  HelpCircle,
  ClipboardCopyIcon,
} from "lucide-react";

import { useCopyToClipboard } from "react-use";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PageHead } from "~/components/page-head";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { FeatureCard } from "~/components/www/feature-card";
import Link from "next/link";
import { Footer } from "~/components/www/footer";
import { MainLayout } from "~/components/main-layout";
import { Toaster } from "~/components/ui/toaster";

const feedbackItemSamples = [
  "I found your contributions to be particularly helpful or effective when...",
  "Your contributions made a significant impact on the project by...",
  "I found your ideas and insights to be especially valuable because...",
  "I found it really valuable when you...",
  "One thing that stood out to me was...",
  "I was impressed by your ability to...",
  "I think you did a great job with...",
  "I noticed your dedication in...",
  "It was great to see how you...",
  "I think your approach to [specific task] was effective because...",
  "I would have liked to see more of your input on...",
  "Your [specific skill] was a great asset to the team when...",
  "I think it would have been beneficial if you could have...",
  "I would have liked to hear more of your thoughts on...",
  "It would have been helpful if you could have provided input on...",
  "I think the project would have benefited from your involvement in...",
  "I wanted to see more of your contribution in terms of...",
];

const Home: NextPage = () => {
  const [, copyToClipboard] = useCopyToClipboard();
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <PageHead title="Home" />
      <header className="flex justify-between bg-background px-8 py-8">
        <Image
          className="inline dark:hidden"
          src="/HeroLogo.svg"
          width={312 / 2}
          height={153 / 2}
          alt="improveme.io logo"
        />
        <Image
          className="hidden dark:inline"
          src="/HeroLogo-dark.svg"
          width={312 / 2}
          height={153 / 2}
          alt="improveme.io logo"
        />
        <div className="flex">
          <SignedIn>
            <Button asChild variant="outline" className="mr-6">
              <Link href="/dashboard">
                <LayoutDashboardIcon className="mr-3" size={"20"} />
                Open App Dashboard
              </Link>
            </Button>
            <div className="mt-1">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            >
              <Button className="mr-2" variant={"ghost"} size={"sm"}>
                Log In
              </Button>
            </SignInButton>
            <SignUpButton
              mode="modal"
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            >
              <Button variant={"outline"} size={"sm"}>
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </header>
      <MainLayout>
        <h1 className="mb-12 mt-0 font-serif text-4xl">
          Tips for Writing Constructive Feedback
        </h1>
        <div className="gap-8 md:grid md:grid-cols-2 ">
          {/*
          NOTE: we might put this video back once Brooke is officially on board again!
          <div className="md:col-span-2">
            <iframe
              className="w-full rounded-md shadow-lg"
              width={560 * 2}
              height={315 * 2}
              src="https://www.youtube.com/embed/fVHMsbWMa6s"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe> 
          </div>
          */}
          <h3 className="mb-0 mt-8 text-xl md:col-span-2">
            1. Orient the situation
          </h3>
          <FeatureCard
            Icon={Check}
            paragraph="Good"
            title="“at the meeting with the client when we talked about…”"
          />
          <FeatureCard
            Icon={CircleSlashed}
            paragraph="Bad"
            title="“always when you…”"
          />
          <h3 className="mb-0 mt-12 text-xl md:col-span-2">
            2. Share the Objective Behavior
          </h3>
          <FeatureCard
            Icon={Check}
            paragraph="Good. Only nouns and verbs, no adjectives."
            title="“I noticed you had a tendency to start speaking before others finished”"
          />
          <FeatureCard
            Icon={CircleSlashed}
            paragraph="Bad. Goal is to agree on the behaviour, not to denote value to it. "
            title="“It was rude how you were interrupting others during the meeting”"
          />
          <h3 className="mb-0 mt-12 text-xl md:col-span-2">
            3. Share the Subjective Impact
          </h3>
          <FeatureCard
            Icon={Check}
            paragraph="You can start using adjectives again."
            title="“…it disrupted the flow of the conversation”, “…made me feel like I lost control of the meeting”"
          />
          <h3 className="mb-0 mt-12 text-xl md:col-span-2">
            4. Pass the Accountability
          </h3>
          <FeatureCard
            Icon={HelpCircle}
            paragraph="Ask an open–ended question"
            title="“What do you think how the meeting went?"
          />

          <h2 className="col-span-2 mb-12 mt-16 font-serif text-3xl">
            Useful Prompts
          </h2>
          {feedbackItemSamples.map((item, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardHeader className="flex flex-row space-y-0">
                <div className="ml-0 mr-1 mt-1 w-10 shrink-0">
                  <MessageCircle />
                </div>
                <CardTitle className="mt-0 leading-7">{item}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button
                  onClick={() => {
                    copyToClipboard(item);
                    toast({
                      title: "Copied to Clipboard",
                      description: item,
                    });
                  }}
                  variant={"outline"}
                  size={"lg"}
                >
                  <ClipboardCopyIcon className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="flex flex-wrap md:col-span-2">
            <h2 className="my-12 w-full font-serif text-3xl">
              About improveme.io
            </h2>
            <p className="mb-8 mr-8 h-24 w-24 md:max-w-lg">
              <Image
                className="mx-auto hidden dark:inline"
                src="/Logo-dark.svg"
                width={78}
                height={60}
                alt="improveme.io logo"
              />
              <Image
                className="mx-auto inline dark:hidden"
                src="/Logo.svg"
                width={78}
                height={60}
                alt="improveme.io logo"
              />
            </p>
            <p className="mb-8 text-lg md:max-w-lg">
              improveme.io is a webapp that empowers anyone, regardless of the
              context or setting, to collect feedback from the people they
              collaborate with. It is developed as a passion project of people
              who would love more constructive feedback in their lives and is
              free to use.
              <br />
              <br />
              <Button variant={"outline"} size={"lg"} asChild>
                <Link href="/">Find out more…</Link>
              </Button>
            </p>
            <Image
              className="sm:mt-10 md:mt-0"
              src="/HeroGraphic.png"
              width={472}
              height={584}
              alt="Graphic depicting three people giving each other feedback in the cloud"
            />
          </div>
        </div>
      </MainLayout>
      <Footer />
    </>
  );
};

export default Home;
