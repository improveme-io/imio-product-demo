import { type NextPage } from "next";
import Image from "next/image";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { LayoutDashboardIcon } from "lucide-react";

import { PageHead } from "~/components/page-head";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Footer } from "~/components/footer";

const AntiDiscriminationPolicy: NextPage = () => {
  return (
    <>
      <PageHead title="improveme.io | Home" />
      <header className="flex justify-between bg-stone-50 px-8 py-8">
        <Link href="/">
          <Image
            className=""
            src="/HeroLogo.svg"
            width={312 / 2}
            height={153 / 2}
            alt="Graphic depicting three people giving each other feedback in the cloud"
          />
        </Link>
        <div className="flex">
          <SignedIn>
            <Button variant="outline" asChild className="mr-6">
              <Link href="/dashboard">
                <LayoutDashboardIcon className="mr-3" size={"20"} />
                Open App Dashboard
              </Link>
            </Button>
            <div className="mt-1">
              <UserButton />
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
      <main className="container flex min-h-screen w-full flex-col gap-x-8 bg-stone-50 px-8 py-8 sm:px-16 md:pl-32">
        <h1 className="my-12 font-serif text-4xl">
          Anti-Discrimination Policy
        </h1>
        <div className="flex items-start">
          <div className="mb-20 md:w-4/6">
            <p>
              At <b>improveme.io</b>, we are committed to creating a welcoming
              and inclusive workplace for all employees and users. We believe
              that every individual should be treated with respect and dignity,
              and we do not tolerate discrimination of any kind. Our
              anti-discrimination policy outlines our commitment to promoting
              diversity, equity, and inclusion, and to creating a safe and
              respectful environment for all.
            </p>
            <ol>
              <li>
                <h2 className="my-12 font-serif text-xl">
                  Equal Employment Opportunity
                </h2>
                <p>
                  Improveme.io is an equal opportunity employer. We do not
                  discriminate on the basis of race, color, religion, gender,
                  sexual orientation, gender identity, national origin, age,
                  disability, or any other characteristic protected by law. We
                  are committed to hiring, promoting, and compensating
                  individuals based on their qualifications, performance, and
                  abilities.
                </p>
              </li>
              <li>
                <h2 className="my-12 mb-8 mt-12 font-serif text-xl font-normal">
                  Harassment and Discrimination
                </h2>
                <p>
                  We do not tolerate any form of harassment or discrimination in
                  our workplace or in our interactions with users. This includes
                  but is not limited to: verbal or physical abuse, derogatory or
                  offensive comments or jokes, unwelcome advances or requests
                  for sexual favors, and any other behavior that creates an
                  intimidating, hostile, or offensive environment. We encourage
                  employees and users to report any instances of harassment or
                  discrimination to their supervisor or the appropriate
                  department.
                </p>
              </li>
              <li>
                <h2 className="my-12 mb-8 mt-12 font-serif text-xl font-normal">
                  Accommodation for Disabilities
                </h2>
                <p>
                  Improveme.io is committed to providing reasonable
                  accommodations for employees and users with disabilities. We
                  will work with individuals to provide accommodations that
                  enable them to perform the essential functions of their job or
                  access our products and services.
                </p>
              </li>
              <li>
                <h2 className="my-12 mb-8 mt-12 font-serif text-xl font-normal">
                  Diversity and Inclusion
                </h2>
                <p>
                  We value diversity and strive to create a workplace that is
                  inclusive and welcoming for all. We encourage the expression
                  of diverse opinions and perspectives, and we recognize the
                  importance of fostering an environment that promotes
                  creativity, innovation, and growth. We are committed to
                  creating a culture that supports and respects individuals from
                  all backgrounds.
                </p>
              </li>
              <li>
                <h2 className="my-12 mb-8 mt-12 font-serif text-xl font-normal">
                  Compliance with Laws
                </h2>
                <p>
                  Improveme.io is committed to complying with all applicable
                  federal, state, and local laws regarding discrimination and
                  harassment. We will take appropriate action to investigate any
                  claims of discrimination or harassment, and we will take steps
                  to remedy any inappropriate behavior.
                </p>
              </li>
            </ol>
            <p>
              At improveme.io, we believe that diversity, equity, and inclusion
              are essential to our success as a company. We are committed to
              creating a workplace that is free from discrimination and
              harassment, and we encourage all employees and users to join us in
              promoting these values.
            </p>
          </div>
          <Image
            className="md:w-2/6"
            src="/LegalGraphic.png"
            width={500}
            height={500}
            alt="Graphic depicting a lot of lawyers standing over a person with a laptop on a beach chair"
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AntiDiscriminationPolicy;
