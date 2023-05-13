import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { InboxIcon, LeafIcon, SproutIcon } from "lucide-react";
import { type NextPage } from "next";

import { Contribution } from "~/components/contribution";
import { FeedbackRequestItem } from "~/components/feedback-request-item";

import { PageHead } from "~/components/page-head";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { cn } from "~/utils/style";

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);

  React.useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener("scroll", updatePosition);

    updatePosition();

    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
};

const Dashboard: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const ownedFeedbacks = api.feedback.ownedByUser.useQuery();
  const authoredFeedbacks = api.feedback.authoredByUser.useQuery();
  const createFeedback = api.feedback.create.useMutation();

  const isScrolled = useScrollPosition() > 0;

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
      <header
        className={cn(
          isScrolled ? "bg-opacity-70 py-2" : "py-8",
          "sticky top-0 z-40 flex flex-col bg-stone-100 px-8 transition-all duration-500"
        )}
      >
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <Image
              className="mr-4"
              src="/Logo.svg"
              width={isScrolled ? 78 / 3 : 78 / 2}
              height={isScrolled ? 60 / 3 : 60 / 2}
              alt="improveme.io logo"
            />{" "}
            {!isScrolled && (
              <h1 className="group mr-auto flex font-serif text-3xl tracking-tight">
                Hello, {user.user?.firstName ?? "You"}
              </h1>
            )}
          </div>
          <div
            className={cn(
              isScrolled ? "mr-3" : "mr-6",
              "ml-auto flex items-center text-right"
            )}
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
          </div>
          <div className="mt-1 flex flex-col items-end">
            <UserButton />
          </div>
        </div>
      </header>
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
