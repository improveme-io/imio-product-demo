import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import { Form, FieldArray, FieldArrayItem, Field } from "houseform";
import {
  SaveIcon,
  StepForwardIcon,
  Loader2Icon,
  SendIcon,
  CalendarClockIcon,
  CalendarIcon,
  CheckIcon,
  PencilIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWindowScroll } from "react-use";
import { type z } from "zod";
import { useUser } from "@clerk/nextjs";
import { format, isBefore, startOfToday, isPast } from "date-fns";

import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { api } from "~/utils/api";
import {
  type formSchema,
  payloadSchema,
  type AuthoringForm,
  type AuthoringFormItem,
  deadlineSchema,
} from "~/utils/validation";
import { LogoSplash } from "~/components/logo-splash";
import { GeneralError, UnathorizedError } from "~/components/error-screens";
import { MainLayout } from "~/components/main-layout";
import { PageHead } from "~/components/page-head";
import { Header } from "~/components/header";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { UserItem } from "~/components/user-item";
import { FeedbackTitleSection } from "~/components/feedback-title-section";
import { FeedbackAuthorSection } from "~/components/feedback-author-section";
import { FeedbackParagraphSection } from "~/components/feedback-paragraph-section";
import { FeedbackItemSection } from "~/components/feedback-item-section";
import { FeedbackRequestDialog } from "~/components/feedback-request-dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { DialogClose } from "~/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { cn } from "~/utils/style";
import { FeedbackRequestAuthorDialog } from "~/components/feedback-request-author-dialog";
import Link from "next/link";

type FormValues = z.infer<typeof formSchema>;

// TODO: have all the auth checks on the server and only return the data that the viewer is allowed to see
const FeedbackRequest: NextPage = () => {
  const router = useRouter();

  // ~ auth & user ~
  const clerkSession = useAuth();
  const clerkUser = useUser();
  const currentViewer = api.user.byAuth.useQuery(
    {
      clerkUserId: clerkSession.userId as string,
    },
    {
      enabled: !!clerkSession.userId,
    }
  );

  // ~ feedback ~
  // TODO: handle the case where there is no such feedback with slug
  const feedbackRequest = api.feedback.bySlug.useQuery(
    {
      // FIXME: better typing if possible
      slug: router.query.slug as string,
      authorId: currentViewer.data?.id,
    },
    {
      enabled: !!router.query.slug && !!currentViewer.data?.id,
    }
  );

  // ~ form ~
  const submitForm = api.form.submitForm.useMutation({
    onSuccess: async () => {
      await router.push("/dashboard");
    },
  });
  const saveForm = api.form.saveForm.useMutation();
  const authorSave = api.form.authorSave.useMutation();
  const authorSubmit = api.form.authorSubmit.useMutation({
    onSuccess: async () => {
      await router.push("/dashboard");
    },
  });

  // ~ initial data ~
  const title = feedbackRequest.data?.formSave
    ? feedbackRequest.data?.formSave.title
    : feedbackRequest.data?.title;
  const paragraph = feedbackRequest.data?.formSave
    ? feedbackRequest.data?.formSave.paragraph
    : feedbackRequest.data?.paragraph;
  const deadline = feedbackRequest.data?.formSave
    ? feedbackRequest.data?.formSave.deadline
    : feedbackRequest.data?.deadline;
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

  const authorHasFinished = feedbackRequest.data?.authorsFinished
    .map((a) => a.clerkUserId)
    .includes(clerkUser.user?.id ?? "");

  // ~ auth checks ~
  // TODO: move these checks to the server, also break up slug to only return the data that the viewer is allowed to see
  const viewerIsAuthor =
    currentViewer.data?.id &&
    feedbackRequest.data?.authors
      .map((a) => a.id)
      .includes(currentViewer.data?.id);
  const viewerIsOwner =
    feedbackRequest.data?.owner.id === currentViewer.data?.id;

  // ~ scroll hook for header ~
  // TODO: this causes a re-render on every scroll event, investigate if it's possible to avoid
  const { y } = useWindowScroll();
  const isScrolled = y > 0;

  // TODO: we should have a better way of hydrating the form with the data from the feedback... maybe SSR would be better here?
  // can't use placeholderData because we have different views based on the status
  // maybe a set of nice skeleton components for now would be good
  if (
    feedbackRequest.isLoading ||
    currentViewer.isLoading ||
    !clerkSession.isLoaded
  ) {
    return <LogoSplash />;
  }

  // ~ not authorized ~
  if (!viewerIsOwner && !viewerIsAuthor) {
    return <UnathorizedError />;
  }

  // ~ owner ~
  if (viewerIsOwner) {
    // ~ feedback is in CREATING state ~
    if (feedbackRequest.data && feedbackRequest.data.status === "CREATING") {
      return (
        <>
          <PageHead title="Request Feedback" />
          <Form<FormValues>
            onSubmit={(values) => {
              // TODO: maybe validate via zod the entire form?
              if (feedbackRequest.data && currentViewer.data) {
                submitForm.mutate({
                  requestId: feedbackRequest.data.id,
                  ownerId: currentViewer.data.id,
                  title: values.title,
                  authors: values.authors,
                  deadline: values.deadline,
                  paragraph: values.paragraph,
                  feedbackItems: values.feedbackItems,
                });
              }
            }}
          >
            {({ submit, errors, value: formValues, isDirty, setIsDirty }) => (
              <>
                <Header isSmall={isScrolled} title={"Request Feedback"}>
                  <Button
                    disabled={!isDirty || saveForm.isLoading}
                    variant={isDirty ? "default" : "secondary"}
                    className="transition-all duration-300"
                    size={isScrolled ? "sm" : "lg"}
                    onClick={() => {
                      if (feedbackRequest.data && currentViewer.data) {
                        saveForm.mutate(
                          {
                            requestId: feedbackRequest.data?.id,
                            title: formValues.title,
                            authors: formValues.authors,
                            deadline: formValues.deadline,
                            paragraph: formValues.paragraph,
                            feedbackItems: formValues.feedbackItems,
                          },
                          {
                            onSuccess: () => {
                              setIsDirty(false);
                              // TODO: invalidate cache instead
                              void feedbackRequest.refetch();
                            },
                          }
                        );
                      }
                    }}
                  >
                    {saveForm.isLoading ? (
                      <Loader2Icon className="mr-2 animate-spin" size="25" />
                    ) : (
                      <SaveIcon className="mr-2" size="20" />
                    )}
                    Save
                  </Button>
                </Header>
                <MainLayout app>
                  <FeedbackTitleSection title={title} />
                  <Card className="sm:my-12">
                    <CardContent className="px-6 pb-8 pt-6">
                      <FeedbackAuthorSection authors={authors} />
                      <FeedbackParagraphSection paragraph={paragraph ?? ""} />
                      {/* TODO: do this typing for the other fields as well */}
                      <Field<FormValues["deadline"]>
                        name="deadline"
                        initialValue={deadline}
                        onSubmitValidate={deadlineSchema}
                        onChangeValidate={deadlineSchema}
                      >
                        {/* TODO: error handling */}
                        {({ value, setValue, errors }) => (
                          <div className="mt-12 justify-between">
                            <h2 className="mb-4 flex w-full text-xl">
                              <CalendarClockIcon className="mr-2" />
                              Reveal Date
                            </h2>
                            <div className="flex flex-col">
                              <Label className="mb-4">
                                Before this date, incoming Feedback won&apos;t
                                be visible to you.
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[280px] justify-start text-left font-normal",
                                      !value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {value ? (
                                      format(value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    initialFocus
                                    mode="single"
                                    selected={value ?? undefined}
                                    onSelect={(day) => {
                                      setValue(day);
                                    }}
                                    disabled={(date) =>
                                      isBefore(date, startOfToday())
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                              <p className="mt-5 max-w-lg text-sm">
                                This can be useful if you are doing feedback in
                                a group or if you are requesting feedback from
                                multiple people and want to see their
                                contributions at once.
                              </p>
                              {errors.map((error) => (
                                <p
                                  className="mt-3 rounded-md bg-red-100 px-3 py-2 text-red-500"
                                  key={`deadline-${error}`}
                                >
                                  {error}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </Field>
                    </CardContent>
                  </Card>
                  <FeedbackItemSection feedbackItems={feedbackItems} />
                  <footer className="flex justify-end pb-16 pt-8 sm:pl-8">
                    <FeedbackRequestDialog
                      title={`Author ${formValues.title ?? ""} for ${
                        feedbackRequest.data?.owner.firstName ?? ""
                      } ${feedbackRequest.data?.owner.lastName ?? ""}`}
                      paragraph={formValues.paragraph}
                      feedbackItems={formValues.feedbackItems}
                      renderOwner={
                        <UserItem
                          firstName={feedbackRequest.data?.owner.firstName}
                          lastName={feedbackRequest.data?.owner.lastName}
                          email={feedbackRequest.data?.owner.email}
                          profileImageUrl={
                            feedbackRequest.data?.owner.profileImageUrl ??
                            undefined
                          }
                          className="mr-0"
                        />
                      }
                      renderDialogTrigger={
                        <Button
                          disabled={formValues.feedbackItems?.length === 0}
                          size="lg"
                        >
                          <StepForwardIcon className="mr-2" />
                          Preview Feedback Request…
                        </Button>
                      }
                      renderDialogFooter={
                        <>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              size="lg"
                              className="w-full sm:w-auto"
                            >
                              Back to Feedback Request
                            </Button>
                          </DialogClose>
                          <Button
                            className="w-full sm:w-auto"
                            disabled={errors.length > 0 || submitForm.isLoading}
                            size="lg"
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={submit}
                          >
                            <StepForwardIcon className="mr-2" />
                            Request Feedback
                          </Button>
                          {errors.length > 0 && (
                            <p className="relative rounded-md bg-red-100 px-3 py-2 text-red-500">
                              There seem to be things missing. Please check if
                              you have provided all necessary data.
                            </p>
                          )}
                        </>
                      }
                    />
                  </footer>
                </MainLayout>
              </>
            )}
          </Form>
        </>
      );
    }

    // ~ feedback is _not_ in CREATING state ~
    return (
      <>
        <PageHead title="Feedback Request" />
        <Header isSmall={isScrolled} title={"Feedback Request"} />
        <MainLayout app>
          <div className="flex max-w-4xl flex-col px-8 pb-8">
            <h1 className="pb-8 pt-16 font-serif text-3xl">
              {feedbackRequest.data?.title}
            </h1>
            <Card className="mb-16 mt-2">
              <CardHeader className="mr-3">
                <div className="flex items-center">
                  <p className="mx-2">You are requesting feedback:</p>
                </div>
                <CardContent className="flex flex-col items-start px-0">
                  <ReactMarkdown className="prose mt-8 max-w-2xl leading-6 dark:prose-invert">
                    {feedbackRequest.data?.paragraph ?? ""}
                  </ReactMarkdown>
                  {feedbackRequest.data?.deadline && (
                    <div className="mt-12 flex items-center">
                      <CalendarClockIcon className="mr-2" size={16} />
                      <Label>
                        Feedback will become visible on{" "}
                        {format(feedbackRequest.data?.deadline, "PPP")}
                      </Label>
                    </div>
                  )}
                </CardContent>
              </CardHeader>
            </Card>
            <ul className="mt-12">
              {feedbackRequest.data?.feedbackItems
                ?.filter((item) => {
                  return item.authorId === item.ownerId;
                })
                .map((ownerFI) => (
                  <div
                    key={`feedback-item-${ownerFI.id}`}
                    className="mt-4 max-w-4xl"
                  >
                    <Label className="mb-8 block max-w-3xl font-serif text-xl font-normal">
                      {ownerFI.prompt}
                    </Label>
                    <div className="mb-32 w-full">
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
                            <div className="flex w-full flex-col items-start">
                              <UserItem
                                firstName={authorFI.author.firstName}
                                lastName={authorFI.author.lastName}
                                email={authorFI.author.email}
                                profileImageUrl={
                                  authorFI.author.profileImageUrl ?? undefined
                                }
                              />
                              <div className="mt-5 flex w-full justify-start">
                                {feedbackRequest.data?.authorsStarted
                                  .map((a) => a.id)
                                  .includes(authorFI.author.id) && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        {" "}
                                        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-300">
                                          <PencilIcon
                                            className="text-sky-50"
                                            size={16}
                                          />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {authorFI.author.firstName} has
                                          started to author your feedback.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                {feedbackRequest.data?.authorsFinished
                                  .map((a) => a.id)
                                  .includes(authorFI.author.id) && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        {" "}
                                        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-green-400">
                                          <CheckIcon
                                            className="text-green-50"
                                            size={16}
                                          />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {authorFI.author.firstName} has
                                          finished authoring.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </div>
                            {feedbackRequest.data?.deadline &&
                              isPast(feedbackRequest.data?.deadline) &&
                              feedbackRequest.data?.authorsFinished
                                .map((a) => a.id)
                                .includes(authorFI.author.id) && (
                                <ReactMarkdown className="prose col-span-3 w-full max-w-2xl text-lg leading-7 dark:prose-invert ">
                                  {authorFI.payload ?? ""}
                                </ReactMarkdown>
                              )}
                            {!feedbackRequest.data?.deadline &&
                              feedbackRequest.data?.authorsFinished
                                .map((a) => a.id)
                                .includes(authorFI.author.id) && (
                                <ReactMarkdown className="prose col-span-3 w-full max-w-2xl text-lg leading-7 dark:prose-invert ">
                                  {authorFI.payload ?? ""}
                                </ReactMarkdown>
                              )}
                          </li>
                        ))}
                    </div>
                  </div>
                ))}
            </ul>
          </div>
        </MainLayout>
      </>
    );
  }

  // ~ author ~
  if (viewerIsAuthor) {
    const authoringItems = feedbackRequest.data?.feedbackItems.filter((fi) => {
      return fi.authorId === currentViewer.data?.id;
    });

    return (
      <>
        <PageHead title="Author Feedback" />
        <Form<{ authoringItems: AuthoringForm }>
          onSubmit={(values) => {
            if (feedbackRequest.data?.id) {
              authorSubmit.mutate({
                items: values.authoringItems,
                requestId: feedbackRequest.data?.id,
              });
            }
          }}
        >
          {({ submit, isDirty, setIsDirty }) => (
            <FieldArray<AuthoringFormItem>
              name="authoringItems"
              initialValue={authoringItems?.map((afi) => ({
                id: afi.id,
                prompt: afi.prompt ?? "",
                payload: afi.payload ?? "",
              }))}
            >
              {({ value: authoringItems }) => (
                <>
                  <Header
                    isSmall={isScrolled}
                    title={cn([
                      "Author",
                      feedbackRequest.data?.title,
                      "for",
                      feedbackRequest.data?.owner.firstName,
                      feedbackRequest.data?.owner.lastName,
                    ])}
                  >
                    <Button
                      disabled={!isDirty || authorSave.isLoading}
                      variant={isDirty ? "default" : "secondary"}
                      className="transition-all duration-300"
                      size={isScrolled ? "sm" : "lg"}
                      onClick={() => {
                        if (feedbackRequest.data) {
                          authorSave.mutate(
                            {
                              items: authoringItems,
                              requestId: feedbackRequest.data?.id,
                            },
                            {
                              onSuccess: () => {
                                setIsDirty(false);
                                // TODO: invalidate cache instead
                                void feedbackRequest.refetch();
                              },
                            }
                          );
                        }
                      }}
                    >
                      {saveForm.isLoading ? (
                        <Loader2Icon className="mr-2 animate-spin" size="25" />
                      ) : (
                        <SaveIcon className="mr-2" size="20" />
                      )}
                      Save
                    </Button>
                  </Header>

                  <MainLayout app>
                    {/* <div className="flex w-full  flex-col px-8 pb-8"> */}
                    <div className="flex w-full flex-col pb-8 sm:px-8">
                      <Card className="mb-16 mt-2">
                        <CardHeader className="mr-3">
                          <div className="flex items-center">
                            <UserItem
                              className="mr-0"
                              firstName={feedbackRequest.data?.owner.firstName}
                              lastName={feedbackRequest.data?.owner.lastName}
                              email={feedbackRequest.data?.owner.email}
                              profileImageUrl={
                                feedbackRequest.data?.owner.profileImageUrl ??
                                undefined
                              }
                            />
                            <p className="mx-2">is requesting Your feedback</p>
                          </div>
                          <CardContent className="flex flex-col items-start px-0 pb-0">
                            <ReactMarkdown className="prose mt-8 max-w-2xl leading-6 dark:prose-invert ">
                              {feedbackRequest.data?.paragraph ?? ""}
                            </ReactMarkdown>
                            {feedbackRequest.data?.deadline && (
                              <div className="mt-12 flex items-center">
                                <CalendarClockIcon className="mr-2" size={16} />
                                <Label>
                                  If submitted, Your feedback will become
                                  visible on{" "}
                                  {format(
                                    feedbackRequest.data?.deadline,
                                    "PPP"
                                  )}
                                </Label>
                              </div>
                            )}
                            <p className="mb-0 mt-2">
                              Not sure what to write? Check out our{" "}
                              <Link
                                className="hover:text-underline text-sky-700 hover:text-sky-500"
                                href="/tips"
                                target="blank"
                              >
                                Tips Page
                              </Link>
                              .
                            </p>
                          </CardContent>
                        </CardHeader>
                      </Card>
                      <section className="mt-12 pb-8">
                        <ul>
                          {authoringItems.map((authoringItem, index) => {
                            return (
                              <li
                                key={`authoring-item-${authoringItem.id}`}
                                className="mt-4 max-w-4xl"
                              >
                                <FieldArrayItem<string>
                                  name={`authoringItems[${index}].payload`}
                                  onSubmitValidate={payloadSchema}
                                  onBlurValidate={payloadSchema}
                                >
                                  {({ value, setValue, onBlur, errors }) => {
                                    return (
                                      <>
                                        <Label className="mb-8 block max-w-3xl font-serif text-xl font-normal">
                                          {authoringItem.prompt}
                                        </Label>
                                        {/* KRISTOF */}
                                        <Textarea
                                          disabled={authorHasFinished}
                                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                                          value={value}
                                          placeholder="Type Your Answer here, for example: I found your contributions to be particularly helpful or effective when..."
                                          onChange={(e) => {
                                            setValue(e.target.value);
                                          }}
                                          onBlur={() => {
                                            onBlur();
                                          }}
                                          className="mb-20 mt-2 h-96 bg-white font-mono text-xl placeholder:text-stone-200 dark:bg-transparent dark:placeholder:text-stone-500"
                                        />
                                        {errors.map((error) => (
                                          <p
                                            className="relative -top-16 rounded-md bg-red-100 px-3 py-2 text-red-500"
                                            key={`authoring-item-${authoringItem.id}-error-${error}`}
                                          >
                                            {error}
                                          </p>
                                        ))}
                                      </>
                                    );
                                  }}
                                </FieldArrayItem>
                              </li>
                            );
                          })}
                        </ul>
                        <footer className="flex flex-col items-center justify-end pb-16 pl-8 pt-8 sm:flex-row">
                          <p className="mb-5 mr-0 sm:mb-0 sm:mr-5">
                            Ready to send it?
                          </p>
                          <FeedbackRequestAuthorDialog
                            title={feedbackRequest.data?.title}
                            // paragraph={formValues.paragraph}
                            feedbackItems={authoringItems}
                            renderOwner={
                              <UserItem
                                firstName={
                                  feedbackRequest.data?.owner.firstName
                                }
                                lastName={feedbackRequest.data?.owner.lastName}
                                profileImageUrl={
                                  feedbackRequest.data?.owner.profileImageUrl ??
                                  undefined
                                }
                                email={feedbackRequest.data?.owner.email}
                                className="mr-1"
                              />
                            }
                            renderAuthor={
                              <UserItem
                                firstName={
                                  clerkUser.user?.firstName ?? undefined
                                }
                                lastName={clerkUser.user?.lastName ?? undefined}
                                profileImageUrl={
                                  clerkUser.user?.profileImageUrl
                                }
                                email="yourfakeemail@email.com"
                                className="mr-1"
                              />
                            }
                            renderDialogTrigger={
                              <Button size="lg">
                                <SendIcon size={20} className="mr-2" />
                                Preview Your Feedback…
                              </Button>
                            }
                            renderDialogFooter={
                              <Button
                                disabled={authorHasFinished}
                                variant="default"
                                size={"lg"}
                                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                onClick={submit}
                              >
                                <span className="mr-2">
                                  <SendIcon size={20} />
                                </span>
                                Send Feedback
                              </Button>
                            }
                          />
                        </footer>
                      </section>
                    </div>
                  </MainLayout>
                </>
              )}
            </FieldArray>
          )}
        </Form>
      </>
    );
  }

  // ~ 3rd party ~
  // not implemented yet

  // ~ general error (should never happen) ~
  return <GeneralError />;
};

export default FeedbackRequest;
