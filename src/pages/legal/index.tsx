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

const PrivacyPolicy: NextPage = () => {
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
        <h1 className="my-12 font-serif text-4xl">Contact & Legal</h1>
        <div className="mb-20 md:w-4/6">
          <p>
            improveme.io is a passion project maintained by Mihaly Füredi &
            Reuven I. Kristof Gatter, located in Budapest and Berlin,
            respectively. You can reach us under mihaly -at- improveme.io or
            kristof -at- improveme.io.
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
          <Button asChild className="text-stone-50" variant={"link"}>
            <Link href="/legal">Contact & Legal</Link>
          </Button>
          <Button className="text-stone-50" variant={"link"}>
            <Link href="/legal/terms-and-conditions">Terms & Conditions</Link>
          </Button>
          <Button className="text-stone-50" variant={"link"}>
            <Link href="/legal/privacy-policy">Privacy Policy</Link>
          </Button>
          <Button className="text-stone-50" variant={"link"}>
            <Link href="/legal/anti-discrimination-policy">
              Anti-Discrimination Policy
            </Link>
          </Button>
        </div>
      </footer>
    </>
  );
};

export default PrivacyPolicy;
