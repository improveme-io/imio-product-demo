import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { StepForwardIcon, UserIcon, SendIcon } from "lucide-react";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/main-layout";
import { PageHead } from "~/components/page-head";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

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
          className="font-dm-mono mt-2 h-96 text-xl"
          placeholder="Type your message here."
        />
      </div>
    </section>
  );
};

const EditFeedbackAuthor = () => {
  return (
    <Card>
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
    </Card>
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
      <MainLayout>
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
      </MainLayout>
    </>
  );
};

export default FeedbackRequest;
