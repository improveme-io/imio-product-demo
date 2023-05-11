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

const TermsAndConditions: NextPage = () => {
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
        <h1 className="my-12 font-serif text-4xl">Terms & Conditions</h1>
        <div className="mb-20 md:w-4/6">
          <p>
            These Terms and Conditions govern your use of our website and
            application. By using improveme.io, you agree to these Terms and
            Conditions in full. If you do not agree with these Terms and
            Conditions, do not use improveme.io.
          </p>
          <h2 className="my-12 font-serif text-xl">
            Equal Employment Opportunity
          </h2>
          <p>
            Improveme.io is an equal opportunity employer. We do not
            discriminate on the basis of race, color, religion, gender, sexual
            orientation, gender identity, national origin, age, disability, or
            any other characteristic protected by law. We are committed to
            hiring, promoting, and compensating individuals based on their
            qualifications, performance, and abilities.
          </p>
          <h2 className="my-12 font-serif text-xl">License and Restrictions</h2>
          <p>
            improveme.io grants you a limited, non-exclusive, non-transferable
            license to access and use our website and application for your
            personal or business use. You may not modify, distribute, transmit,
            display, perform, reproduce, publish, license, create derivative
            works from, transfer, or sell any information, software, products,
            or services obtained from improveme.io.
          </p>

          <h2 className="my-12 font-serif text-xl">User Content</h2>
          <p>
            You are solely responsible for the content you post, upload, or
            otherwise submit to improveme.io. You grant improveme.io a
            non-exclusive, worldwide, royalty-free, transferable license to use,
            copy, modify, distribute, display, and perform your user content in
            connection with the operation and promotion of improveme.io.
          </p>
          <p>
            You represent and warrant that your user content does not violate
            any third-party rights, including intellectual property rights, and
            is not defamatory, offensive, or illegal.
          </p>

          <h2 className="my-12 font-serif text-xl">Prohibited Conduct</h2>
          <p>
            You may not use improveme.io for any unlawful or prohibited purpose,
            including but not limited to:
          </p>
          <ul className="list-disc">
            <li className="ml-4 mt-4">
              Harassing, threatening, or intimidating others
            </li>
            <li className="ml-4 mt-4">
              Uploading, posting, or transmitting any content that is unlawful,
              harmful, offensive, defamatory, or infringing on intellectual
              property rights
            </li>
            <li className="ml-4 mt-4">
              Impersonating another person or entity
            </li>
            <li className="ml-4 mt-4">
              Uploading, posting, or transmitting any content that contains
              viruses or other harmful components
            </li>
            <li className="ml-4 mt-4">
              Interfering with the operation of improveme.io
            </li>
            <li className="ml-4 mt-4">
              Attempting to gain unauthorized access to improveme.io or any of
              its systems or networks
            </li>
          </ul>

          <h2 className="my-12 font-serif text-xl">Fees and Payment</h2>
          <p>
            improveme.io may charge fees for certain features or services. If
            you choose to use these features or services, you agree to pay the
            fees associated with them. improveme.io reserves the right to modify
            its fees and billing practices at any time.
          </p>

          <h2 className="my-12 font-serif text-xl">Disclaimer of Warranties</h2>
          <p>
            improveme.io makes no warranties or representations about the
            accuracy or completeness of the information provided on its website
            or application. improveme.io is provided &quot;as is&quot; without
            warranty of any kind, express or implied, including but not limited
            to the implied warranties of merchantability, fitness for a
            particular purpose, and non-infringement.
          </p>

          <h2 className="my-12 font-serif text-xl">Limitation of Liability</h2>
          <p>
            improveme.io shall not be liable for any damages, including but not
            limited to direct, indirect, incidental, consequential, or punitive
            damages, arising out of your use or inability to use improveme.io,
            even if improveme.io has been advised of the possibility of such
            damages.
          </p>

          <h2 className="my-12 font-serif text-xl">Indemnification</h2>
          <p>
            You agree to indemnify and hold improveme.io and its affiliates,
            officers, agents, and employees harmless from any claim, demand, or
            damage, including reasonable attorneys&apos; fees, arising out of
            your use of improveme.io or your violation of these Terms and
            Conditions.
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

export default TermsAndConditions;
