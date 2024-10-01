import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { InboxIcon, LeafIcon, Loader2Icon, SproutIcon } from "lucide-react";
import { type NextPage } from "next";
import { useWindowScroll } from "react-use";

import { api } from "~/utils/api";
import { PageHead } from "~/components/page-head";
import { MainLayout } from "~/components/main-layout";
import { LogoSplash } from "~/components/logo-splash";
import { Header } from "~/components/header";
import { Contribution } from "~/components/contribution";
import { FeedbackRequestCard } from "~/components/feedback-request-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

const Dashboard: NextPage = () => {
  const router = useRouter();

  const clerkUser = useUser();

  // TODO: add enabled props to wait for the auth state to be ready
  const ownedFeedbacks = api.feedback.ownedByUser.useQuery();
  const deleteFeedback = api.feedback.delete.useMutation();
  const authoredFeedbacks = api.feedback.authoredByUser.useQuery();
  const createForm = api.form.createForm.useMutation();
  const authoringFeedback = api.feedback.authoring.useMutation();

  const handleRequestFeedback = () => {
    createForm.mutate(
      {
        title: `${clerkUser.user?.firstName ?? ""}'s Untitled Feedback Request`,
      },
      {
        onSuccess: (data) => {
          router.push(`/feedback/${data.slug}`);
        },
      }
    );
  };

  const handleAuthorFeedback = (params: {
    authorClerkUserId?: string;
    feedbackRequestId: string;
  }) => {
    if (params.authorClerkUserId) {
      authoringFeedback.mutate(
        {
          authorClerkUserId: params.authorClerkUserId,
          requestId: params.feedbackRequestId,
          state: "start",
        },
        {
          onSuccess: (data) => {
            router.push(`/feedback/${data.slug}`);
          },
        }
      );
    }
  };

  // TODO: this causes a re-render on every scroll event, investigate if it's possible to avoid
  const { y } = useWindowScroll();
  const isScrolled = y > 0;

  if (
    ownedFeedbacks.isLoading ||
    authoredFeedbacks.isLoading ||
    !clerkUser.isLoaded
  ) {
    return <LogoSplash />;
  }

  return (
    <>
      <PageHead title="improveme.io | Dashboard" />
      <Header
        isSmall={isScrolled}
        title={`Hello, ${clerkUser.user?.firstName ?? "You"}`}
      >
        <Button
          disabled={createForm.isLoading}
          className="transition-all duration-300"
          size={isScrolled ? "sm" : "lg"}
          onClick={handleRequestFeedback}
        >
          {createForm.isLoading ? (
            <Loader2Icon className="mr-2 animate-spin" size="25" />
          ) : (
            <LeafIcon className="mr-2" size="20" />
          )}
          Request Feedback
        </Button>
      </Header>
      <MainLayout app>
        <h2 className="mb-8 flex items-center text-xl sm:mb-4">
          <InboxIcon className="mr-2" size={"20"} />
          Your Contributions
          <Badge className="ml-4 bg-stone-400 hover:bg-stone-400">
            {authoredFeedbacks.isSuccess && authoredFeedbacks.data.length}
          </Badge>
        </h2>
        {/* FIXME: make it consistent and add section to other places as well or remove it here */}
        <section className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-4">
          {authoredFeedbacks.data?.length === 0 && (
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-stone-100 p-6 text-center text-stone-400 dark:bg-stone-800 dark:text-stone-500">
              Noone has requested feedback from you yet. Incoming Requests will
              appear here.
            </div>
          )}
          {authoredFeedbacks.isSuccess &&
            authoredFeedbacks.data.map((fr) => {
              const hasStarted = fr.authorsStarted
                .map((a) => a.clerkUserId)
                .includes(clerkUser.user?.id ?? "");
              const hasFinished = fr.authorsFinished
                .map((a) => a.clerkUserId)
                .includes(clerkUser.user?.id ?? "");

              return (
                <Contribution
                  hasStarted={hasStarted}
                  hasFinished={hasFinished}
                  key={fr.id}
                  slug={fr.slug}
                  requesterFirstName={fr.owner.firstName}
                  requesterLastName={fr.owner.lastName}
                  requestName={fr.title}
                  requesterProfileImageUrl={fr.owner.profileImageUrl ?? ""}
                  email={fr.owner.email}
                  onAuthor={() => {
                    handleAuthorFeedback({
                      authorClerkUserId: clerkUser.user?.id,
                      feedbackRequestId: fr.id,
                    });
                  }}
                />
              );
            })}
        </section>
        <h2 className="mb-8 mt-12 flex items-center text-xl sm:mb-4">
          <LeafIcon className="mr-2" size={"20"} />
          Feedback Requested by You
          <Badge className="ml-4 bg-stone-400 hover:bg-stone-400">
            {ownedFeedbacks.isSuccess && ownedFeedbacks.data.length}
          </Badge>
        </h2>
        {ownedFeedbacks.data?.length === 0 && (
          <div className="flex h-40 w-full items-center justify-center rounded-lg bg-stone-100 p-6 text-center text-stone-400 dark:bg-stone-800 dark:text-stone-500">
            You have not requested feedback yet. Click the button in the top
            right corner to get started.
          </div>
        )}
        {ownedFeedbacks.isSuccess &&
          ownedFeedbacks.data.length != 0 &&
          ownedFeedbacks.data.map((fr) => {
            // TODO: make this re-useable, it is also used in the [slug] page
            const title = fr?.formSave ? fr?.formSave.title : fr?.title;

            const paragraph = fr?.formSave
              ? fr?.formSave.paragraph
              : fr?.paragraph;

            const authors = fr?.formSave
              ? fr?.formSave.authors
              : fr?.authors.map((user) => ({
                  email: user.email,
                  lastName: user.lastName,
                  firstName: user.firstName,
                  profileImageUrl: user.profileImageUrl ?? "",
                }));

            const feedbackItems = fr?.formSave
              ? fr?.formSave.feedbackItems
              : fr?.feedbackItems.map((fi) => ({
                  prompt: fi.prompt,
                }));

            return (
              <FeedbackRequestCard
                key={fr.slug}
                slug={fr.slug}
                canEdit={fr.status === "CREATING"}
                created={fr.createdAt}
                title={title ?? ""}
                paragraph={paragraph ?? ""}
                feedbackItems={feedbackItems}
                ownerEmail={fr.owner.email}
                disabled={deleteFeedback.isLoading}
                authors={authors.map((a, i) => ({
                  firstName: a.firstName ?? "",
                  lastName: a.lastName ?? "",
                  email: a.email ?? "",
                  id: `fake-author-${i}`,
                  profileImageUrl: a.profileImageUrl ?? "",
                }))}
                onDelete={() => {
                  deleteFeedback.mutate(
                    { requestId: fr.id },
                    {
                      onSuccess: () => {
                        void ownedFeedbacks.refetch();
                      },
                    }
                  );
                }}
              />
            );
          })}
        <h2 className="mb-8 mt-8 flex text-xl sm:mb-4">
          <SproutIcon size={"20"} className="mr-2" />
          Feedback Requests Shared With You
        </h2>
        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-stone-100 p-6 text-center text-stone-400 dark:bg-stone-800 dark:text-stone-500">
          There are no Requests Shared with You yet.
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
