import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { StepForwardIcon } from "lucide-react";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/main-layout";
import { PageHead } from "~/components/page-head";
import { Separator } from "~/components/ui/separator";

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
        <h1>Hello, {user.user?.firstName}</h1>
        <p>{JSON.stringify(feedback.data)}</p>
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
