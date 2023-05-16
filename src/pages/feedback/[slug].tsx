import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import { Form } from "houseform";
import { StepForwardIcon } from "lucide-react";
import { type z } from "zod";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/main-layout";
import { PageHead } from "~/components/page-head";
import { Separator } from "~/components/ui/separator";
import { Card, CardHeader } from "~/components/ui/card";
import { Header } from "~/components/header";
import { useWindowScroll } from "react-use";
import { FeedbackParagraphSection } from "~/components/feedback-paragraph-section";
import { FeedbackAuthorSection } from "~/components/feedback-author-section";
import { FeedbackItemSection } from "~/components/feedback-item-section";
import { FeedbackTitleSection } from "~/components/feedback-title-section";
import { type formSchema } from "~/utils/validation";

type FormValues = z.infer<typeof formSchema>;

const FeedbackRequest: NextPage = () => {
  const router = useRouter();

  const clerkSession = useAuth();
  const user = api.user.byAuth.useQuery(
    {
      clerkUserId: clerkSession.userId as string,
    },
    {
      enabled: !!clerkSession.userId,
    }
  );

  const feedbackRequest = api.feedback.bySlug.useQuery(
    {
      // FIXME: better typing if possible
      slug: router.query.slug as string,
    },
    { enabled: !!router.query.slug }
  );
  const createRequest = api.feedback.createForm.useMutation();

  // TODO: this causes a re-render on every scroll event, investigate if it's possible to avoid
  const { y } = useWindowScroll();
  const isScrolled = y > 0;

  // TODO: we should have a better way of hydrating the form with the data from the feedback... maybe SSR would be better here?
  if (
    feedbackRequest.isLoading ||
    !feedbackRequest.data === null ||
    feedbackRequest.data === undefined
  ) {
    return <div>Loading...</div>;
  }

  if (feedbackRequest.data && feedbackRequest.data.status !== "CREATING") {
    return (
      <div>
        <h1>Feedback Request View -- not implemented</h1>
        <p>{JSON.stringify(feedbackRequest.data)}</p>
      </div>
    );
  }

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
        {/* TODO: persist the form locally on change (clean it up on submit) */}
        <Form<FormValues>
          onSubmit={(values) => {
            // TODO: maybe validate via zod the entire form?
            if (feedbackRequest.data && user.data) {
              createRequest.mutate({
                requestId: feedbackRequest.data.id,
                ownerId: user.data.id,
                title: values.title,
                authors: values.authors,
                paragraph: values.paragraph,
                feedbackItems: values.feedbackItems,
              });
            }
          }}
        >
          {({ submit, errors }) => (
            <>
              {/* TODO(kristof): how can we make this more consistent? some are wrapped in card stuff, others are not, plus I don't see how to make these nice and re-useable with the card stuff... */}
              <Card>
                <CardHeader>
                  <FeedbackTitleSection title={feedbackRequest.data?.title} />
                </CardHeader>
                <FeedbackAuthorSection
                  authors={feedbackRequest.data?.authors.map((user) => ({
                    email: user.email,
                    lastName: user.lastName,
                    firstName: user.firstName,
                  }))}
                />
                <FeedbackParagraphSection />
              </Card>
              <Separator className="my-4" />
              <FeedbackItemSection
                feedbackItems={feedbackRequest.data?.feedbackItems.map(
                  (fi) => ({ prompt: fi.prompt })
                )}
              />
              <footer className="flex justify-end pb-16 pl-8 pt-8">
                <div>
                  <Button
                    variant={errors.length > 0 ? "destructive" : "outline"}
                    disabled={
                      !feedbackRequest.data ||
                      !user.data ||
                      errors.length > 0 ||
                      createRequest.isLoading
                    }
                    size="lg"
                    // FIXME: eslint
                    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
                    onClick={submit}
                  >
                    <StepForwardIcon className="mr-2" />
                    Test Submit
                  </Button>
                  {errors.length > 0 && <p>* There are errors</p>}
                </div>
                <Button disabled size="lg">
                  <StepForwardIcon className="mr-2" />
                  Review Feedback Request…
                </Button>
              </footer>
            </>
          )}
        </Form>
      </MainLayout>
    </>
  );
};

export default FeedbackRequest;
