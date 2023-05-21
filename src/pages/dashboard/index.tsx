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
  const authoredFeedbacks = api.feedback.authoredByUser.useQuery();
  const createForm = api.form.createForm.useMutation();

  const handleRequestFeedback = () => {
    createForm.mutate(
      { title: `${clerkUser.user?.firstName ?? ''}'s Untitled Feedback Request` },
      {
        onSuccess: (data) => {
          router.push(`/feedback/${data.slug}`);
        },
      }
    );
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
          className="mr-2 transition-all duration-300 hover:bg-stone-200"
          size={isScrolled ? "sm" : "lg"}
          variant={"ghost"}
          disabled
        >
          Settings
        </Button>
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
        <h2 className="mb-4 flex items-center text-xl">
          <InboxIcon className="mr-2" size={"20"} />
          Your Contributions
        </h2>
        {/* FIXME: make it consistent and add section to other places as well or remove it here */}
        <section className="grid grid-cols-3 gap-4">
          {authoredFeedbacks.isSuccess &&
            authoredFeedbacks.data.map((fr) => {
              return (
                <Contribution
                  key={fr.id}
                  slug={fr.slug}
                  done={fr.status === "DONE"}
                  requestName={fr.title}
                  requesterInitials={"<RN>"}
                  requesterName={"fr.owner.name"}
                  email={fr.owner.email}
                />
              );
            })}
        </section>
        <h2 className="mb-4 mt-8 flex items-center text-xl">
          <LeafIcon className="mr-2" size={"20"} />
          Feedback Requested by You
          <Badge className="ml-4">
            {ownedFeedbacks.isSuccess && ownedFeedbacks.data.length}
          </Badge>
        </h2>
        {ownedFeedbacks.isSuccess &&
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
                title={title ?? ""}
                paragraph={paragraph ?? ""}
                feedbackItems={feedbackItems}
                ownerEmail={fr.owner.email}
                authors={authors.map((a, i) => ({
                  email: a.email ?? "",
                  id: `fake-author-${i}`,
                }))}
              />
            );
          })}
        <h2 className="mb-4 mt-8 flex text-xl">
          <SproutIcon size={"20"} className="mr-2" />
          Feedback Requests Shared With You
        </h2>
      </MainLayout>
    </>
  );
};

export default Dashboard;
