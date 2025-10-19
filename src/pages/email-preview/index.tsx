import { type NextPage } from "next";

import { PageHead } from "~/components/page-head";

import { Footer } from "~/components/www/footer";
import { MainLayout } from "~/components/main-layout";
import { FeedbackRequested } from "../../components/email/feedback-requested";

const Home: NextPage = () => {
  return (
    <>
      <PageHead title="Home" />
      <MainLayout>
        <FeedbackRequested
          authorFirstName="John"
          ownerFirstName="Anna"
          ownerProfilePicURL="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzMzZ3laWkR5Q1VvdzdlYlBtYno4aGVpOFVkVCJ9?width=160"
          feedbackUrl="http://improveme.io/dfsdf/dsdfsa435d453as"
          sessionIntro="I really enjoyed working with you on the project. I'm very eager to learn from my experiences and hope you'll support me on that journey. Thank you in advance for your thoughtful input!"
        />
      </MainLayout>
      <Footer />
    </>
  );
};

export default Home;
