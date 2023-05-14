import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { Form } from "houseform";
import { StepForwardIcon } from "lucide-react";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/main-layout";
import { PageHead } from "~/components/page-head";
import { Separator } from "~/components/ui/separator";
import { Card, CardHeader } from "~/components/ui/card";
import { Header } from "~/components/header";
import { useWindowScroll } from "react-use";
import { FeedbackParagraphSection } from "~/components/feedback-paragraph-section";
import { FeedbackAuthorSection } from "~/components/feedback-author-section";
import { FeedbackItemSection } from "~/components/feedback-item-section";
import { FeedbackTitleSection } from "~/components/feedback-title-section";

const FeedbackRequest: NextPage = () => {
  const router = useRouter();

  const user = useUser();

  const feedback = api.feedback.bySlug.useQuery(
    {
      // FIXME: better typing if possible
      slug: router.query.slug as string,
    },
    { enabled: !!router.query.slug }
  );

  // TODO: this causes a re-render on every scroll event, investigate if it's possible to avoid
  const { y } = useWindowScroll();
  const isScrolled = y > 0;

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
        {/* TODO: add typing maybe infer it from a zod schema or prisma even */}
        {/* TODO: persist the form locally on change (clean it up on submit) */}
        <Form
          onSubmit={(values) => {
            alert(JSON.stringify(values));
            console.log(values);
          }}
        >
          {({ submit, errors }) => (
            <>
              {/* TODO(kristof): how can we make this more consistent? some are wrapped in card stuff, others are not, plus I don't see how to make these nice and re-useable with the card stuff... */}
              <Card>
                <CardHeader>
                  <FeedbackTitleSection title={feedback.data?.title} />
                </CardHeader>
                <FeedbackAuthorSection
                  authors={feedback.data?.authors.map((user) => ({
                    email: user.email,
                    lastName: user.lastName,
                    firstName: user.firstName,
                  }))}
                />
                <FeedbackParagraphSection />
              </Card>
              <Separator className="my-4" />
              <FeedbackItemSection />
              <footer className="flex justify-end pb-16 pl-8 pt-8">
                <div>
                  <Button
                    variant={errors.length > 0 ? "destructive" : "outline"}
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
                <Button disabled size="lg">
                  <StepForwardIcon className="mr-2" />
                  Review Feedback Request…
                </Button>
              </footer>
            </>
          )}
        </Form>
      </MainLayout>
    </>
  );
};

export default FeedbackRequest;
