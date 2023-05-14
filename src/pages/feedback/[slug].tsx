import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import {
  StepForwardIcon,
  UserIcon,
  SendIcon,
  PuzzleIcon,
  TrashIcon,
} from "lucide-react";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/main-layout";
import { PageHead } from "~/components/page-head";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { FeedbackItem } from "~/components/feedback-item";
import { Header } from "~/components/header";
import { useWindowScroll } from "react-use";

const IntroParagraph = () => {
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="mb-4 flex text-xl">
            <SendIcon className="mr-2" />
            Introductory Paragraph
          </h2>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col px-8 py-8">
        <Label className="mb-2">
          Write some text to explain on a personal level what kind of feedback
          you are asking for and why.
        </Label>
        <Textarea
          className="mt-2 h-96 font-mono text-xl"
          placeholder="Now it is time to put into practice what we learned in Week 3 about giving feedback! Being able to give and receive feedback is essential to effective teamwork and personal and professional growth. Remember, receiving feedback is an opportunity for growth and improvement, so approach these questions with an open mind and a willingness to learn from your teammates' perspectives. Please provide specific examples."
        />
      </CardContent>
    </>
  );
};

const EditFeedbackAuthor = () => {
  return (
    <>
      <p className="max-w-lg text-sm text-stone-500">
        Specify who you would like to get feedback from. All Feedback Authors
        will recieve the same Prompts (Questions) from you.
      </p>
      <section className="items-end justify-between pt-8 md:flex">
        <div className="mb-6 mr-6 flex flex-grow flex-col md:mb-0">
          {/* TODO: save debounced when editing */}
          <Label className="mb-2">E-Mail Address</Label>
          <Input type="email" placeholder="todd@burchik.com" />
        </div>
        <div className="mb-6 mr-6 flex flex-grow flex-col md:mb-0">
          <Label className="mb-2">First Name</Label>
          <Input type="text" placeholder="Todd" />
        </div>
        <div className="mb-6 mr-6 flex flex-grow flex-col md:mb-0">
          <Label className="mb-2">Last Name</Label>
          <Input type="text" placeholder="Burchik" />
        </div>
        <Button disabled variant={"outline"} className="flex-grow-0">
          <TrashIcon size={16} />
        </Button>
      </section>
      <Button className="mt-6 flex-grow-0" variant={"outline"}>
        Add New Author…
      </Button>
    </>
  );
};

const FeedbackAuthorList = () => {
  return (
    <section className="px-6 pb-8 pt-4">
      <h2 className="mb-4 flex text-xl">
        <UserIcon className="mr-2" />
        Feedback Authors
      </h2>
      <EditFeedbackAuthor />
    </section>
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
      <FeedbackItem
        title="What aspects of my contributions to the group project do you think were particularly helpful or effective?"
        editing={false}
      />
      <FeedbackItem
        title="Were there any specific instances where you felt I effectively demonstrated strong teamwork and collaboration skills?"
        editing={false}
      />
      <FeedbackItem
        title="In what specific ways do you think my work positively impacted the project and our team's overall performance?"
        editing={false}
      />
      <FeedbackItem title="" editing={true} />
      <Button disabled variant={"outline"} className="my-5 w-full">
        Add New Feedback Item (1 left)
      </Button>
    </>
  );
};

const FeedbackRequest: NextPage = () => {
  const router = useRouter();

  const user = useUser();

  const feedback = api.feedback.bySlug.useQuery(
    {
      // FIXME: better typing if possible
      slug: router.query.slug as string,
    },
    { enabled: !!router.query.slug }
  );

  // TODO: this causes a re-render on every scroll event, investigate if it's possible to avoid
  const { y } = useWindowScroll();
  const isScrolled = y > 0;

  return (
    <>
      <PageHead title="Request Feedback" />
      <Header isSmall={isScrolled} title={"Request Feedback"}>
        <Button disabled size={isScrolled ? "sm" : "lg"}>
          <StepForwardIcon className="mr-2" />
          Review Feedback Request…
        </Button>
      </Header>
      <MainLayout app>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">General Feedback Data</CardTitle>
          </CardHeader>
          <FeedbackAuthorList />
          <IntroParagraph />
        </Card>
        <Separator className="my-4" />
        <FeedbackItemList />
        <footer className="flex justify-end pb-16 pl-8 pt-8">
          <Button disabled size="lg">
            <StepForwardIcon className="mr-2" />
            Review Feedback Request…
          </Button>
        </footer>
      </MainLayout>
    </>
  );
};

export default FeedbackRequest;
