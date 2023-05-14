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
        <h1 className="my-12 font-serif text-4xl">Privacy Policy</h1>
        <div className="flex items-start">
          <div className="mb-20 mr-8 md:w-4/6">
            <p>
              At improveme.io, we are committed to protecting your privacy and
              complying with EU data protection laws, including the General Data
              Protection Regulation (GDPR). This Privacy Policy explains how we
              collect, use, and disclose your personal data, and your rights and
              choices with respect to your data.
            </p>

            <h2 className="my-12 font-serif text-xl">Data Controller</h2>

            <p>
              The data controller for the personal data we collect through the
              use of our software as a service solution is improveme.io, a
              privately maintained website.
            </p>

            <h2 className="my-12 font-serif text-xl">
              Types of Data We Collect
            </h2>

            <p>
              We may collect and process the following types of personal data:
            </p>

            <ul className="list-disc">
              <li className="ml-4 mt-4">
                Contact information, such as your name, email address, and phone
                number
              </li>
              <li className="ml-4 mt-4">
                Payment information, such as your billing address and credit
                card information
              </li>
              <li className="ml-4 mt-4">
                Usage information, such as your IP address, browser type, and
                referring website
              </li>
              <li className="ml-4 mt-4">
                Customer support inquiries and other communications
              </li>
              <li className="ml-4 mt-4">
                Other information you choose to provide to us, such as feedback
                or survey responses
              </li>
            </ul>

            <h2 className="my-12 font-serif text-xl">
              How We Collect Your Data
            </h2>

            <p>
              We may collect your personal data through the following means:
            </p>

            <ul className="list-disc">
              <li className="ml-4 mt-4">
                When you sign up for our software as a service solution
              </li>
              <li className="ml-4 mt-4">
                When you communicate with us, such as through email or live chat
              </li>
              <li className="ml-4 mt-4">
                When you use our software as a service solution, such as through
                your interactions with our website and application
              </li>
              <li className="ml-4 mt-4">
                When you participate in our surveys or other promotional
                activities
              </li>
            </ul>

            <h2 className="my-12 font-serif text-xl">How We Use Your Data</h2>

            <p>We may use your personal data for the following purposes:</p>

            <ul className="list-disc">
              <li className="ml-4 mt-4">
                To provide and improve our software as a service solution
              </li>
              <li className="ml-4 mt-4">
                To communicate with you about our products and services
              </li>
              <li className="ml-4 mt-4">
                To process your payments and provide customer support
              </li>
              <li className="ml-4 mt-4">
                To conduct surveys and other promotional activities
              </li>
              <li className="ml-4 mt-4">
                To comply with applicable laws and regulations
              </li>
            </ul>

            <h2 className="my-12 font-serif text-xl">Data Retention</h2>

            <p>
              We will retain your personal data for as long as necessary to
              fulfill the purposes for which it was collected, or as required by
              applicable laws and regulations. When we no longer need your
              personal data, we will securely dispose of it.
            </p>

            <h2 className="my-12 font-serif text-xl">Data Disclosure</h2>

            <p>We may disclose your personal data to the following parties:</p>

            <ul className="list-disc">
              <li className="ml-4 mt-4">
                Our service providers who provide us with services such as
                hosting, payment processing, and customer support
              </li>
              <li className="ml-4 mt-4">
                Law enforcement or other government authorities in response to a
                lawful request
              </li>
              <li className="ml-4 mt-4">
                In connection with a merger, acquisition, or other business
                transaction
              </li>
            </ul>

            <h2 className="my-12 font-serif text-xl">Data Security</h2>

            <p>
              We take appropriate technical and organizational measures to
              protect your personal data from unauthorized access, disclosure,
              or misuse. We use industry-standard encryption technologies to
              secure your data when it is transmitted over the internet.
            </p>

            <h2 className="my-12 font-serif text-xl">
              Your Rights and Choices
            </h2>

            <p>
              You have certain rights with respect to your personal data,
              including the right to access, correct, and delete your data. You
              may also have the right to restrict or object to the processing of
              your data. To exercise these rights, please contact us using the
              information provided below.
            </p>

            <h2 className="my-12 font-serif text-xl">Contact Us</h2>

            <p>
              If you have any questions or concerns about our Privacy Policy, or
              if you would like to exercise your rights with respect to your
              personal data, please contact us at legal@improveme.io We may
              update this Privacy Policy from time to time to reflect changes in
              our practices or legal obligations. We will notify you of any
              material changes to this Privacy Policy by posting a notice on our
              website or by contacting you directly.
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

export default PrivacyPolicy;
