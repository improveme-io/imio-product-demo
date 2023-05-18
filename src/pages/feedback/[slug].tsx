import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import { Form } from "houseform";
import { StepForwardIcon } from "lucide-react";
import { type z } from "zod";
import { useWindowScroll } from "react-use";

import { api } from "~/utils/api";
import { type formSchema } from "~/utils/validation";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/main-layout";
import { PageHead } from "~/components/page-head";
import { Card, CardContent } from "~/components/ui/card";
import { Header } from "~/components/header";
import { FeedbackParagraphSection } from "~/components/feedback-paragraph-section";
import { FeedbackAuthorSection } from "~/components/feedback-author-section";
import { FeedbackItemSection } from "~/components/feedback-item-section";
import { FeedbackTitleSection } from "~/components/feedback-title-section";
import { GeneralError } from "~/components/general-error";
import { FeedbackRequestDialog } from "~/components/feedback-request-dialog";

type FormValues = z.infer<typeof formSchema>;

// TODO: handle the case where there is no such feedback with slug
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

  console.log(user.data?.id);
  const feedbackRequest = api.feedback.bySlug.useQuery(
    {
      // FIXME: better typing if possible
      slug: router.query.slug as string,
      authorId: user.data?.id,
    },
    { enabled: !!router.query.slug && !!user.data?.id }
  );
  const createRequest = api.feedback.submitForm.useMutation();
  const saveRequest = api.feedback.saveForm.useMutation();

  const title = feedbackRequest.data?.formSave
    ? feedbackRequest.data?.formSave.title
    : feedbackRequest.data?.title;

  const paragraph = feedbackRequest.data?.formSave
    ? feedbackRequest.data?.formSave.paragraph
    : feedbackRequest.data?.paragraph;

  const authors = feedbackRequest.data?.formSave
    ? feedbackRequest.data?.formSave.authors
    : feedbackRequest.data?.authors.map((user) => ({
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
      }));

  const feedbackItems = feedbackRequest.data?.formSave
    ? feedbackRequest.data?.formSave.feedbackItems
    : feedbackRequest.data?.feedbackItems.map((fi) => ({ prompt: fi.prompt }));

  // TODO: this causes a re-render on every scroll event, investigate if it's possible to avoid
  const { y } = useWindowScroll();
  const isScrolled = y > 0;

  // TODO: we should have a better way of hydrating the form with the data from the feedback... maybe SSR would be better here?
  // can't use placeholderData because we have different views based on the status
  // maybe a set of nice skeleton components for now would be good
  if (feedbackRequest.isLoading) {
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

  // ~ creating
  if (feedbackRequest.data && feedbackRequest.data.status === "CREATING") {
    return (
      <>
        <PageHead title="Request Feedback" />
        <Header isSmall={isScrolled} title={"Request Feedback"} />
        <MainLayout app>
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
            {({ submit, errors, value: formValues }) => (
              <>
                <FeedbackTitleSection title={title} />
                <Card className="my-12">
                  <CardContent className="px-6 pb-8 pt-6">
                    <FeedbackAuthorSection authors={authors} />
                    <FeedbackParagraphSection paragraph={paragraph ?? ""} />
                  </CardContent>
                </Card>
                <FeedbackItemSection feedbackItems={feedbackItems} />
                {/* CONTINUE -- put button here that saves the form's current state */}
                <Button
                  onClick={() => {
                    // save form state
                    if (feedbackRequest.data) {
                      saveRequest.mutate({
                        requestId: feedbackRequest.data.id,
                        ...formValues,
                      });
                    }
                  }}
                >
                  Save progress
                </Button>
                <footer className="flex justify-end pb-16 pl-8 pt-8">
                  <FeedbackRequestDialog
                    title={formValues.title}
                    paragraph={formValues.paragraph}
                    feedbackItems={formValues.feedbackItems}
                    ownerEmail={feedbackRequest.data?.owner.email}
                    renderDialogTrigger={
                      <Button size="lg">
                        <StepForwardIcon className="mr-2" />
                        Preview Feedback Request…
                      </Button>
                    }
                    renderDialogFooter={
                      <div>
                        <Button
                          variant={
                            errors.length > 0 ? "destructive" : "outline"
                          }
                          size="lg"
                          // FIXME: turn off eslint rule or contribute to houseform
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={submit}
                        >
                          <StepForwardIcon className="mr-2" />
                          Request Feedback
                        </Button>
                        {errors.length > 0 && <p>* There are errors</p>}
                      </div>
                    }
                  />
                </footer>
              </>
            )}
          </Form>
        </MainLayout>
      </>
    );
  }

  // ~ general error
  return <GeneralError />;
};

export default FeedbackRequest;
