import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { InboxIcon, LeafIcon, SproutIcon } from "lucide-react";
import { type NextPage } from "next";
import { useWindowScroll } from "react-use";

import { Contribution } from "~/components/contribution";
import { FeedbackRequestItem } from "~/components/feedback-request-item";

import { PageHead } from "~/components/page-head";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { Header } from "~/components/header";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const ownedFeedbacks = api.feedback.ownedByUser.useQuery();
  const authoredFeedbacks = api.feedback.authoredByUser.useQuery();
  const createFeedback = api.feedback.create.useMutation();

  // TODO: this causes a re-render on every scroll event, investigate if it's possible to avoid
  const { y } = useWindowScroll();
  const isScrolled = y > 0;

  const handleRequestFeedback = () => {
    createFeedback.mutate();
  };

  React.useEffect(() => {
    if (createFeedback.isSuccess) {
      router.push(`/feedback/${createFeedback.data.slug}`);
    }
  }, [createFeedback.data, createFeedback.isSuccess, router]);

  return (
    <>
      <PageHead title="improveme.io | Dashboard" />
      <Header
        small={isScrolled}
        title={["Hello, ", user.user?.firstName ?? "You"].join("")}
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
          // TODO: make this into a loading state
          disabled={createFeedback.isLoading}
          className="bg-sky-700  transition-all duration-300"
          size={isScrolled ? "sm" : "lg"}
          onClick={handleRequestFeedback}
        >
          <LeafIcon className="mr-2" size="20" />
          Request Feedback
        </Button>
      </Header>
      <main className="items-left justify-left my-16 flex min-h-screen flex-col px-8 pb-8">
        <h2 className="mb-4 flex items-center text-xl">
          <InboxIcon className="mr-2" size={"20"} />
          Your Contributions
        </h2>
        <section className="grid grid-cols-3 gap-4">
          {authoredFeedbacks.isSuccess &&
            authoredFeedbacks.data.map((fr) => {
              return (
                <>
                  <Contribution
                    done={true}
                    requestName={fr.title}
                    requesterInitials={"<RN>"}
                    requesterName={"fr.owner.name"}
                    email={fr.owner.email}
                  />
                </>
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
            return (
              <>
                <FeedbackRequestItem
                  key={fr.id}
                  title={fr.title}
                  slug={fr.slug}
                  authors={fr.authors.map((a) => ({
                    email: a.email ?? "",
                    id: a.id,
                  }))}
                />
              </>
            );
          })}
        <h2 className="mb-4 mt-8 flex text-xl">
          <SproutIcon size={"20"} className="mr-2" />
          Feedback Requests Shared With You
        </h2>
      </main>
    </>
  );
};

export default Dashboard;
