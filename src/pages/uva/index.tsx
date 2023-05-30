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
  FileWarningIcon,
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

const feedbackItems = [
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

const howtoItems = [
  {
    image: "/uva/screenshot01.png",
    text: "Click the Start Collecting Feedback Now button to log in or sign up to improveme.io",
  },
  {
    image: "/uva/screenshot02.png",
    text: "Enter your name and university e-mail.",
  },
  {
    image: "/uva/screenshot03.png",
    text: "Fill out the Feedback Request form. Add all group members you are recieving feedback from as Authors with their e-mail address and name.",
  },
  {
    image: "/uva/screenshot04.png",
    text: "Click the Review Feedback Request button to get a preview of the feedback form your group members will see. Click Request Feedback to finish inviting them to giving you feedback. We have preloaded the standard questions for you, but if you want to ask something more from your teammates, feel free to add more questions.",
  },
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
        <div className="my-8">
          <FeatureCard
            Icon={FileWarningIcon}
            title="Some users are experiencing delay in recieving feedback requests"
            paragraph="[May 30th, 18.13 GMT+2] Due to a technical problem, there may be a delay in recieving feedback requests. You can still log in and use improveme.io. No data is lost and everything will be back to normal shorty – we'll keep you posted. – the improveme.io team"
          />
        </div>
        <h1 className="mb-12 mt-0 font-serif text-4xl">
          Welcome to Group Work Peer Feedback
        </h1>
        <div className="md:grid md:grid-cols-2">
          <div>
            <h3 className="mb-7 text-xl">
              UVA | Management and Leadership in the Digital Age
            </h3>
            <p className="mb-8 text-lg">
              Now it is time to put into practice what we learned in Week 3
              about giving feedback! Being able to give and receive feedback is
              essential to effective teamwork and personal and professional
              growth. Now you have the opportunity to practice!
            </p>
            <FeatureCard
              Icon={FileWarningIcon}
              title="IMPORTANT INFORMATION"
              paragraph="Your
            grade will be based on completing this task NOT on what the team
            members write about you. If you have major problems with one of
            your team members, tell us immediately."
            />
            <SignedIn>
              <Button
                asChild
                size={"lg"}
                className="mb-32 mt-16 grow-0 px-10 py-8 text-lg text-white dark:bg-sky-300 dark:text-stone-950 dark:hover:bg-sky-500"
              >
                <Link href="/dashboard">Start Collecting Feedback Now</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignUpButton
                mode="modal"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              >
                <Button
                  size={"lg"}
                  className="mb-32 mt-16 grow-0 px-10 py-8 text-lg text-white dark:bg-sky-300 dark:text-stone-950 dark:hover:bg-sky-500"
                >
                  Start Collecting Feedback Now
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
          <div className="mb-16 flex w-full px-16">
            <div className="ml-auto">
              <Image
                className="mb-8 mr-8 h-40 w-40 rounded-full bg-green-200 text-3xl md:max-w-lg"
                src="/PortraitBrooke.png"
                width={350}
                height={350}
                alt="Portrait photo of Dr. Brooke Gazdag"
              />
              <h3 className="mb-4    mt-12 w-full font-serif text-2xl">
                Dr. Brooke Gazdag
              </h3>
              <p className="text-md mb-4 md:max-w-lg">Associate Professor</p>
              <p className="text-md mb-2 md:max-w-lg">b.a.gazdag@uva.nl</p>
            </div>
          </div>
        </div>
        <div className="gap-8 md:grid md:grid-cols-2 ">
          <div className="md:col-span-2">
            <h2 className="mb-12 font-serif text-3xl">
              How to give and recieve feedback
            </h2>
            <iframe
              className="w-full rounded-md shadow-lg"
              width={560 * 2}
              height={315 * 2}
              src="https://www.youtube.com/embed/fVHMsbWMa6s"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
            <p className="mt-16 text-lg font-medium md:max-w-lg">
              Remember, receiving feedback is an opportunity for growth and
              improvement, so approach these questions with an open mind and a
              willingness to learn from your teammates&apos; perspectives.
              Always provide specific examples.
            </p>
          </div>
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
          {feedbackItems.map((item, index) => (
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
          <div className="gap-8 md:col-span-2 md:grid md:grid-cols-2">
            <h2 className="col-span-2 mb-12 mt-16 w-full font-serif text-3xl">
              How it works
            </h2>
            {howtoItems.map((item, index) => (
              <>
                <p className="mb-8 text-lg md:max-w-lg">{item.text}</p>
                <Image
                  className=""
                  src={item.image}
                  width={1533}
                  height={1048}
                  key={index}
                  alt="Illustration of the UI of the app, showing the Dashboard"
                />
              </>
            ))}
          </div>
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
