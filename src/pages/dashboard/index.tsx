import { UserButton, useUser } from "@clerk/nextjs";
import { InboxIcon, LeafIcon, SproutIcon } from "lucide-react";
import { type NextPage } from "next";
import { Contribution } from "~/components/contribution";
import { FeedbackRequestItem } from "~/components/feedback-request-item";

import { PageHead } from "~/components/page-head";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  const user = useUser();

  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  const ownedFeedbacks = api.feedback.ownedByUser.useQuery();
  const authoredFeedbacks = api.feedback.authoredByUser.useQuery();

  console.log(ownedFeedbacks);

  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHead title="Dashboard" />
      <main className="items-left justify-left flex min-h-screen flex-col p-3">
        <header className="flex justify-between pb-8">
          <h1 className="group flex text-3xl font-extrabold tracking-tight">
            Hello, {user.user?.firstName ?? "You"}
            <div className="ml-4">
              <UserButton />
            </div>
          </h1>
          <Button className="my-6" size={"lg"}>
            <LeafIcon className="mr-2" />
            Request New Feedback
          </Button>
        </header>
        <h2 className="mb-4 mt-8 flex text-xl">
          <InboxIcon className="mr-2" />
          Your Contributions
        </h2>
        <section className="grid grid-cols-3 gap-4">
          <Contribution
            done={false}
            requestName="ASDF"
            requesterInitials="A.B."
            requesterName="ABC"
            email={"email"}
          />
        </section>
        <h2 className="mb-4 mt-8 flex text-xl">
          <LeafIcon className="mr-2" />
          Your Feedback Requests &lt;owner&gt;{" "}
          {ownedFeedbacks.isSuccess && ownedFeedbacks.data.length}
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
          <SproutIcon className="mr-2" />
          Feedback Requests Shared with You
        </h2>
        {authoredFeedbacks.isSuccess &&
          authoredFeedbacks.data.map((fr) => {
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
      </main>
    </>
  );
};

export default Dashboard;
