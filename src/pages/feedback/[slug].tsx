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
import { UserItem } from "~/components/user-item";
import { Header } from "~/components/header";
import { FeedbackParagraphSection } from "~/components/feedback-paragraph-section";
import { FeedbackAuthorSection } from "~/components/feedback-author-section";
import { FeedbackItemSection } from "~/components/feedback-item-section";
import { FeedbackTitleSection } from "~/components/feedback-title-section";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import { DialogTrigger } from "~/components/shadcn/dialog";
import { FeedbackRequestView } from "~/components/feedback-request-view";
import { GeneralError } from "~/components/general-error";

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
  const createRequest = api.feedback.submitForm.useMutation();

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
        <Header isSmall={isScrolled} title={"Request Feedback"}>
          <Button disabled size={isScrolled ? "sm" : "lg"}>
            <StepForwardIcon className="mr-2" />
            Review Feedback Request…
          </Button>
        </Header>
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
                <FeedbackTitleSection title={feedbackRequest.data?.title} />
                <Card className="my-12">
                  <CardContent className="px-6 pb-8 pt-6">
                    <FeedbackAuthorSection
                      authors={feedbackRequest.data?.authors.map((user) => ({
                        email: user.email,
                        lastName: user.lastName,
                        firstName: user.firstName,
                      }))}
                    />
                    <FeedbackParagraphSection />
                  </CardContent>
                </Card>
                <FeedbackItemSection
                  feedbackItems={feedbackRequest.data?.feedbackItems.map(
                    (fi) => ({ prompt: fi.prompt })
                  )}
                />
                <footer className="flex justify-end pb-16 pl-8 pt-8">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Show Dialog</Button>
                    </DialogTrigger>
                    {/* TODO: it is transparent without setting a background, investigate our UI library configuration */}
                    <DialogContent className="inset-10 overflow-y-scroll bg-stone-50 sm:h-auto sm:w-auto sm:max-w-none">
                      <FeedbackRequestView
                        title={formValues.title}
                        paragraph={formValues.paragraph}
                        feedbackItems={formValues.feedbackItems}
                        renderOwner={
                          <UserItem
                            className="mr-0"
                            email={feedbackRequest.data?.owner.email}
                          />
                        }
                      />
                      <DialogFooter>
                        <div>
                          <Button
                            variant={
                              errors.length > 0 ? "destructive" : "outline"
                            }
                            disabled={
                              !feedbackRequest.data ||
                              !user.data ||
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
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
