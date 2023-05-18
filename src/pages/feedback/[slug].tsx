import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import { Form } from "houseform";
import { StepForwardIcon } from "lucide-react";
import { type z } from "zod";
import { useWindowScroll } from "react-use";

import Image from "next/image";

import { api } from "~/utils/api";
import { type formSchema } from "~/utils/validation";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/main-layout";
import { PageHead } from "~/components/page-head";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { UserItem } from "~/components/user-item";
import { Header } from "~/components/header";
import { FeedbackParagraphSection } from "~/components/feedback-paragraph-section";
import { FeedbackAuthorSection } from "~/components/feedback-author-section";
import { FeedbackItemSection } from "~/components/feedback-item-section";
import { FeedbackTitleSection } from "~/components/feedback-title-section";
import { Label } from "~/components/ui/label";
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
    return (
      <div className="flex h-screen w-screen animate-pulse items-center justify-center">
        <Image
          className="m-auto animate-bounce"
          src="/Logo.svg"
          width={78}
          height={60}
          alt="improveme.io logo"
        />
      </div>
    );
  }

  // ~ owner and whoever it is shared with
  console.log(feedbackRequest.data?.feedbackItems);
  if (feedbackRequest.data && feedbackRequest.data.status !== "CREATING") {
    return (
      <>
        <PageHead title="Feedback Request View" />

        <Header isSmall={true} title={""} />
        <MainLayout app>
          <div className="flex max-w-4xl flex-col px-8 pb-8">
            <h1 className="pb-8 pt-16 font-serif text-3xl">
              {feedbackRequest.data.title}
            </h1>
            {/* DEADLINE */}
            <Card className="mb-16 mt-2">
              <CardHeader className="mr-3">
                <div className="flex items-center">
                  {feedbackRequest.data.owner.firstName}{" "}
                  {feedbackRequest.data.owner.lastName}
                  <p className="mx-2">is requesting Your feedback:</p>
                </div>
                <CardContent className="flex items-center px-0">
                  <p className="mt-8 max-w-2xl leading-6">
                    {feedbackRequest.data.paragraph}
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
            <ul>
              {/* collect unique owner feedback items */}
              {feedbackRequest.data.feedbackItems
                ?.filter((item) => {
                  return item.authorId === item.ownerId;
                })
                .map((ownerFI) => (
                  <li
                    key={`feedback-item-${ownerFI.id}`}
                    className="mt-4 max-w-4xl"
                  >
                    <Label className="mb-8 block max-w-3xl font-serif text-xl font-normal">
                      {ownerFI.prompt}
                    </Label>
                    <ul className="mb-32 w-full">
                      {feedbackRequest.data?.feedbackItems
                        .filter((fi) => {
                          return (
                            fi.authorId !== fi.ownerId &&
                            fi.prompt === ownerFI.prompt
                          );
                        })
                        .map((authorFI) => (
                          <li
                            key={authorFI.id}
                            className="mb-12 mt-8 grid w-full grid-cols-4"
                          >
                            <div className="w-full">
                              <UserItem
                                firstName={authorFI.author.firstName}
                                lastName={authorFI.author.lastName}
                                email={authorFI.author.email}
                              />
                            </div>
                            <p className="col-span-3 w-full max-w-2xl text-lg leading-7">
                              {authorFI.payload}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
            </ul>
          </div>
        </MainLayout>
      </>
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
