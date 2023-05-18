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
import { Footer } from "~/components/www/footer";

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <PageHead title="Home" />
      <header className="flex justify-between bg-stone-50 px-8 py-8">
        <Link href="/">
          <Image
            className=""
            src="/HeroLogo.svg"
            width={312 / 2}
            height={153 / 2}
            alt="improveme.io logo"
          />
        </Link>
        <div className="flex">
          <SignedIn>
            <Button asChild variant="outline" className="mr-6">
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
        <h1 className="my-12 font-serif text-4xl">Contact & Legal</h1>
        <div className="flex items-start">
          <div className="mb-20 md:w-4/6">
            <p>
              improveme.io is a passion project maintained by Mihaly Füredi &
              Reuven I. Kristof Gatter, located in Budapest and Berlin,
              respectively. You can reach us under mihaly -at- improveme.io or
              kristof -at- improveme.io.
            </p>
          </div>
          <Image
            className=""
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

export default PrivacyPolicy;
