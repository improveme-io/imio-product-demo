import { type NextPage } from "next";
import Image from "next/image";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  Sprout,
  Joystick,
  Users,
  Microscope,
  LayoutDashboardIcon,
} from "lucide-react";

import { PageHead } from "~/components/page-head";
import { Button } from "~/components/ui/button";
import { FeatureCard } from "~/components/www/feature-card";
import Link from "next/link";
import { Footer } from "~/components/www/footer";
import { MainLayout } from "~/components/main-layout";

const Home: NextPage = () => {
  return (
    <>
      <PageHead title="Home" />
      <header className="flex justify-between bg-background px-8 py-8">
        <Image
          className="inline dark:hidden"
          src="/HeroLogo.svg"
          width={312 / 2}
          height={153 / 2}
          alt="improveme.io logo"
        />
        <Image
          className="hidden dark:inline"
          src="/HeroLogo-dark.svg"
          width={312 / 2}
          height={153 / 2}
          alt="improveme.io logo"
        />
        <div className="flex">
          <SignedIn>
            <Button asChild variant="outline" className="mr-6">
              <Link href="/dashboard">
                <LayoutDashboardIcon className="mr-3" size={"20"} />
                Open App Dashboard
              </Link>
            </Button>
            <div className="mt-1">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            >
              <Button className="mr-2" variant={"ghost"} size={"sm"}>
                Log In
              </Button>
            </SignInButton>
            <SignUpButton
              mode="modal"
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            >
              <Button variant={"outline"} size={"sm"}>
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </header>
      <MainLayout>
        <h1 className="my-12 font-serif text-4xl">
          Own Your Feedback, Own Your Growth
        </h1>
        <div className="md:grid md:grid-cols-2">
          <div>
            <h3 className="mb-7 text-xl">
              Make every collaboration a learning opportunity with improveme.io
            </h3>
            <p className="mb-16 text-lg">
              Our app empowers anyone, regardless of the context or setting, to
              collect feedback from the people they collaborate with. You
              #ownyourfeedback. Use it to improve your performance.
            </p>
            <SignedIn>
              <Button
                asChild
                size={"lg"}
                className="grow-0 px-10 py-8 text-lg text-white dark:bg-sky-300 dark:text-stone-950 dark:hover:bg-sky-500"
              >
                <Link href="/dashboard">Start Collecting Feedback Now</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignUpButton
                mode="modal"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              >
                <Button
                  size={"lg"}
                  className="grow-0 px-10 py-8 text-lg text-white dark:bg-sky-300 dark:text-stone-950 dark:hover:bg-sky-500"
                >
                  Start Collecting Feedback Now
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
          <Image
            className="sm:mt-10 md:mt-0"
            src="/HeroGraphic.png"
            width={472}
            height={584}
            alt="Graphic depicting three people giving each other feedback in the cloud"
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2 ">
          <div className="md:col-span-2">
            <h2 className="mb-12 font-serif text-3xl">Keep it forever.</h2>
            <p className="mb-16 text-lg md:max-w-lg">
              Whether you are a student or a freelancer, work for a tiny startup
              or a big multinational corporation, our app empowers you to not
              only facilitate but truly own your own feedback.
            </p>
          </div>
          <FeatureCard
            Icon={Joystick}
            title="You're in control."
            paragraph="With our app, you are the sole owner feedback you've received, which means you can take it with you hassle-free even after you change employers or projects. You no longer need to rely on formal feedback procedures to facilitate feedback sessions. Instead, you can request feedback at your own pace, on your own terms, and without any institutional barriers."
          />
          <FeatureCard
            Icon={Microscope}
            title="Science has your back."
            paragraph="Our app has been designed with the latest best practices in organizational psychology in mind. We understand that top-down feedback processes are often ineffective and outdated and often come only once a year. We take an approach to feedback that is more suitable for the digital age: Quick, easy feedback at any time. You can use it to request feedback after a project has ended or even after you've just delivered a presentation."
          />
          <FeatureCard
            Icon={Users}
            title="Size doesn't matter."
            paragraph="We believe that continuous feedback is essential to personal and professional growth. That's why our app works seamlessly with teams and companies of any size, empowering individuals to take ownership of their feedback and use it to improve their performance."
          />
          <FeatureCard
            Icon={Sprout}
            title="Feedback needs to be actionable."
            paragraph="We guide the feedback givers so you can get feedback that you can actually use. Many of us have given feedback before… but was it any good? This is then also an added bonus for people you ask for feedback: They learn something, too! So don't be shy - ask away!"
          />
          <div className="gap-8 md:col-span-2 md:grid md:grid-cols-2">
            <h2 className="col-span-2 mb-12 mt-16 w-full font-serif text-3xl">
              How it works
            </h2>
            <p className="mb-8 text-lg md:max-w-lg">
              <b className="font-medium">
                To use the app, simply sign up for an account and start your
                journey of continuous improvement
              </b>
              <br />
              <br />
              Once you&apos;ve created your account, you can create a feedback
              request in just a few clicks. This request can be customized to
              suit your specific needs and can be shared with your peers at your
              convenience.
            </p>
            <Image
              className=""
              src="/UI-Illustration-1.png?20230523"
              width={1481}
              height={1019}
              alt="Illustration of the UI of the app, showing the a Feedback Request"
            />
            <Image
              className=""
              src="/UI-Illustration-2.png?20230523"
              width={1481}
              height={1010}
              alt="Illustration of the UI of the app, showing a screen with feedback being authored"
            />
            <p className="mb-8 text-lg md:max-w-lg">
              <b className="font-medium">
                People you reach out to can sign up and start authoring the
                feedback you have requested.
              </b>
              <br />
              <br />
              Remember, receiving feedback is an opportunity for growth and
              improvement, so approach these questions with an open mind and a
              willingness to learn from your other perspectives.
            </p>
            <p className="mb-8 text-lg md:max-w-lg">
              <b className="font-medium">
                After sharing your request, you can sit back and wait for the
                feedback to come in.
              </b>
              <br />
              <br />
              As you continue collecting feedback over time, you will have all
              your feedback in one place - no matter where you worked or with
              whom. You can then better identify areas for improvement and have
              a clearer picture of your progress to keep you motivated and
              growing!
            </p>
            <Image
              className=""
              src="/UI-Illustration-3.png?20230523"
              width={1481}
              height={1010}
              alt="Illustration of the UI of the app, showing a screen with sample feedback"
            />
          </div>
          <div className="flex flex-wrap md:col-span-2">
            <h2 className="my-12 w-full font-serif text-3xl">Our Team</h2>
            <div className="mb-16 w-full pr-16 md:w-1/2 lg:w-1/3">
              <Image
                className="mb-8 mr-8 h-40 w-40 rounded-full bg-green-200 text-3xl md:max-w-lg"
                src="/PortraitKristof.png"
                width={350}
                height={350}
                alt="Portrait photo of Kristof Gatter"
              />
              <h3 className="my-12 w-full font-serif text-2xl">
                Kristof: Product Design and Management
              </h3>
              <p className="text-md mb-8 md:max-w-lg">
                Reuven I. Kristof Gatter builds digital products from the
                initial brainstorming phase to the final UI design. He takes a
                holistic approach to his work, adjusting his role according to
                the project&apos;s needs. Although he is primarily a designer,
                Kristof has gained considerable experience in mentoring,
                facilitating workshops, conducting usability tests, and teaching
                about different aspects of making digital products.
                <br />
                <br />
                He became interested in Feedback and the HR Software space
                during his tenure at Small Improvements. After having a great
                experience with peer feedback, he never quite managed to have
                proper continious feedback at other startups which has lead him
                to start improveme.io, where feedback can be facilitated without
                management overhead.
                <br />
                <br />
                Kristof also taught digital design courses at various
                institutions, including MOME, a design university in Budapest,
                the University of Arts Berlin, and the Startup Institute.
              </p>
            </div>
            <div className="mb-16 w-full pr-16 md:w-1/2 lg:w-1/3">
              <Image
                className="mb-8 mr-8 h-40 w-40 rounded-full bg-green-200 text-3xl md:max-w-lg"
                src="/PortraitMisi.png"
                width={350}
                height={350}
                alt="Portrait photo of Mihaly Furedi"
              />
              <h3 className="my-12 w-full font-serif text-2xl">
                Mihaly: Software Development
              </h3>
              <p className="text-md mb-8 md:max-w-lg">
                Mihaly Furedi loves to code and code loves Mihaly Furedi. He has
                a background in linguistics, sprinkled with a few years in
                physics, but along the way he fell in love, and has been working
                as a full-stack engineer for the past 7 years.
                <br />
                <br />
                He started his career at Prezi, where he worked on the
                automation and tooling for Prezi&apos;s go-to-market teams. 4
                years later, he decided to explore the freelance space while his
                focus shifted more and more to the front-end side of things.
                <br />
                <br />
                Mihaly likes to explore new trends in building the web, and
                keeps a close eye on big language models.
              </p>
            </div>
            <div className="mb-16 w-full pr-16 md:w-1/2 lg:w-1/3">
              <Image
                className="mb-8 mr-8 h-40 w-40 rounded-full bg-green-200 text-3xl md:max-w-lg"
                src="/PortraitBrooke.png"
                width={350}
                height={350}
                alt="Portrait photo of Dr. Brooke Gazdag"
              />
              <h3 className="my-12 w-full font-serif text-2xl">
                Brooke: Organizational Psychology
              </h3>
              <p className="text-md mb-8 md:max-w-lg">
                Dr. Brooke Gazdag is a dedicated researcher and trainer who has
                spent the past decade helping others improve their leadership
                and negotiation skills to enhance their personal and
                professional lives.
                <br />
                <br />
                Originally from Western New York, she moved to Munich, Germany
                in 2012 and currently resides in Hamburg. When she is not
                conducting research on negotiation, leadership, or diversity,
                Dr. Gazdag conducts negotiation training and leadership
                development workshops. She finds joy in the creative process of
                planning new training and working with diverse groups, and
                welcomes collaboration opportunities.
                <br />
                <br />
                Brooke enjoys working with a broad range of audiences, including
                working professionals and undergraduate students. In 2019, she
                was awarded a Teaching Award by her students while working as an
                Assistant Professor at the Ludwig-Maximilians-Universität
                München (University of Munich) in the Munich School of
                Management. In her current role as Associate Professor of Management and Academic Director of Executive Education at Kühne Logistics University (KLU), she has been able to
                innovate and integrate digital learning tools to enhance the
                learning experience for her students.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap md:col-span-2">
            <h2 className="my-12 w-full font-serif text-3xl">Pricing</h2>
            <p className="mb-8 mr-8 h-24 w-24 rounded-full bg-green-200 px-8 py-8 text-3xl text-green-900 md:max-w-lg">
              <span className="-ml-1">$0</span>
            </p>
            <p className="mb-8 text-lg md:max-w-lg">
              Just use it and enjoy it. Right now, improveme.io is just a
              passion project of people who would love more constructive
              feedback in their lives and is free to use. Depending on what
              happens in the future, we may plan to incorporate and introduce
              pricing.
            </p>
            <Image
              className="mx-auto w-1/4"
              src="/PricingGraphic.png"
              width={350}
              height={505}
              alt="Illustration of a person giving another person a present"
            />
          </div>
        </div>
      </MainLayout>
      <Footer />
    </>
  );
};

export default Home;
