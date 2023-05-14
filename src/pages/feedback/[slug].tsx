import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { StepForwardIcon, UserIcon, SendIcon, PuzzleIcon } from "lucide-react";

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

const IntroParagraph = () => {
  return (
    <section className="px-4 py-4">
      <h2 className="mb-4 flex text-xl">
        <SendIcon className="mr-2" />
        Introductory Paragraph
      </h2>
      <div className="flex flex-col px-8 py-8">
        <Label>
          Write some text to explain on a personal level what kind of feedback
          you are asking for and why.
        </Label>
        <Textarea
          className="mt-2 h-96 font-mono text-xl"
          placeholder="Now it is time to put into practice what we learned in Week 3 about giving feedback! Being able to give and receive feedback is essential to effective teamwork and personal and professional growth. Remember, receiving feedback is an opportunity for growth and improvement, so approach these questions with an open mind and a willingness to learn from your teammates' perspectives. Please provide specific examples."
        />
      </div>
    </section>
  );
};

const EditFeedbackAuthor = () => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3> Who is the person you&apos;d like to get feedback from?</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end justify-between pt-8">
        <div className="mr-6 flex flex-grow flex-col">
          {/* TODO: save debounced when editing */}
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
      </CardContent>
    </>
  );
};

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

  return (
    <>
      <PageHead title="Request Feedback" />
      <Header title={"Create Feedback Request"} small={false}>
        {" "}
        <Button disabled size="lg">
          <StepForwardIcon className="mr-2" />
          Review Feedback Request…
        </Button>
      </Header>
      <MainLayout app>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl tracking-tight">General Feedback Data</h1>
            </CardTitle>
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
