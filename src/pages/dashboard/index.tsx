import { UserButton, useUser } from "@clerk/nextjs";
import { InboxIcon, LeafIcon, SproutIcon } from "lucide-react";
import { type NextPage } from "next";
import Image from "next/image";

import { Contribution } from "~/components/contribution";
import { FeedbackRequestItem } from "~/components/feedback-request-item";

import { PageHead } from "~/components/page-head";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  const user = useUser();

  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  const ownedFeedbacks = api.feedback.ownedByUser.useQuery();
  const authoredFeedbacks = api.feedback.authoredByUser.useQuery();

  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHead title="improveme.io | Dashboard" />
      <header className="sticky top-0 z-40 mb-10 flex flex-col bg-stone-100 p-8">
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <Image
              className="mr-4"
              src="/Logo.svg"
              width={78 / 2}
              height={60 / 2}
              alt="Graphic depicting three people giving each other feedback in the cloud"
            />{" "}
            <h1 className="group mr-auto flex font-serif text-3xl tracking-tight">
              Hello, {user.user?.firstName ?? "You"}
            </h1>
          </div>
          <div className="ml-auto mr-6 flex items-center text-right">
            <Button
              className="mr-2 hover:bg-stone-200"
              size={"lg"}
              variant={"ghost"}
              disabled
            >
              Settings
            </Button>
            <Button className="bg-sky-700" size={"lg"}>
              <LeafIcon className="mr-2" size="20" />
              Request Feedback
            </Button>
          </div>
          <div className="mt-1 flex flex-col items-end">
            <UserButton />
          </div>
        </div>
      </header>
      <main className="items-left justify-left flex min-h-screen flex-col px-8 pb-8">
        <h2 className="mb-4  flex items-center text-xl">
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
