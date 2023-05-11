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
import { FeatureCard } from "~/components/feature-card";
import Link from "next/link";

const AntiDiscriminationPolicy: NextPage = () => {
  return (
    <>
      <PageHead title="improveme.io | Home" />
      <header className="flex justify-between bg-stone-50 px-8 py-8">
        <Image
          className=""
          src="/HeroLogo.svg"
          width={312 / 2}
          height={153 / 2}
          alt="Graphic depicting three people giving each other feedback in the cloud"
        />
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
        <div className="mb-20 md:w-4/6">
          <p>
            At <b>improveme.io</b>, we are committed to creating a welcoming and
            inclusive workplace for all employees and users. We believe that
            every individual should be treated with respect and dignity, and we
            do not tolerate discrimination of any kind. Our anti-discrimination
            policy outlines our commitment to promoting diversity, equity, and
            inclusion, and to creating a safe and respectful environment for
            all.
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
                disability, or any other characteristic protected by law. We are
                committed to hiring, promoting, and compensating individuals
                based on their qualifications, performance, and abilities.
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
                offensive comments or jokes, unwelcome advances or requests for
                sexual favors, and any other behavior that creates an
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
                Improveme.io is committed to providing reasonable accommodations
                for employees and users with disabilities. We will work with
                individuals to provide accommodations that enable them to
                perform the essential functions of their job or access our
                products and services.
              </p>
            </li>
            <li>
              <h2 className="my-12 mb-8 mt-12 font-serif text-xl font-normal">
                Diversity and Inclusion
              </h2>
              <p>
                We value diversity and strive to create a workplace that is
                inclusive and welcoming for all. We encourage the expression of
                diverse opinions and perspectives, and we recognize the
                importance of fostering an environment that promotes creativity,
                innovation, and growth. We are committed to creating a culture
                that supports and respects individuals from all backgrounds.
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
      </main>
      <footer className="flex justify-between bg-stone-600 px-8 py-8">
        <div className="w-1/3">
          <p className="text-xs text-stone-800">
            improveme.io is private passion project of Reuven I. Kristof Gatter
            and Mihaly Furedi. Scientific support provided by Dr. Brooke Gazdag.
          </p>
          <p className="text-xs text-stone-800">
            We proudly run on Vercel and Planetscale.
          </p>
        </div>
        <div className="w-2/3 text-right">
          <Button className="text-stone-50" variant={"link"}>
            Contact & Legal
          </Button>
          <Button className="text-stone-50" variant={"link"}>
            Terms & Conditions
          </Button>
          <Button className="text-stone-50" variant={"link"}>
            Privacy Policy
          </Button>
          <Button className="text-stone-50" variant={"link"}>
            Anti-Discrimination Policy
          </Button>
        </div>
      </footer>
    </>
  );
};

export default AntiDiscriminationPolicy;
