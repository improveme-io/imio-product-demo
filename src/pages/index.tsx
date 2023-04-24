import { type NextPage } from "next";
import Link from "next/link";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { ToyBrick } from "lucide-react";

import { PageHead } from "~/components/page-head";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const all = api.feedback.getAll.useQuery();
  const bySlug = api.feedback.bySlug.useQuery({
    slug: "clgtmwezg00070z0hofifaq9o",
  });

  console.log(all.data);
  console.log(bySlug.data);

  const user = useUser();

  return (
    <>
      <PageHead />
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <header>
          <h1 className="mb-8 text-4xl font-bold">improveme.io</h1>
        </header>
        <main className="">
          <section className="pb-10">
            <h1 className="mb-8 text-5xl font-bold">
              Own your feedback, own your growth.
            </h1>
            <h2 className="mb-2 text-2xl">
              Take control of your professional development with improveme.io
            </h2>
            <p>
              Our app empowers anyone, regardless of their employment type, to
              own feedback they receive and use it to improve their performance.
              No need to rely on HR or management, request feedback at your own
              pace and on your terms. Designed with the latest best practices in
              organizational psychology in mind, improveme.io enables
              individuals to take control of their own growth and development.
            </p>
          </section>
          <section className="pb-10">
            <h2 className="text-xl">
              Whether you&apos;re a freelancer, work for a tiny startup, or a
              multinational corporation, our app empowers you to facilitate and
              own your own feedback and keep it forever.
            </h2>
            <ul>
              <li>
                We believe that continuous feedback is essential to personal and
                professional growth. That&apos;s why our app works seamlessly
                with teams and companies of any size, empowering individuals to
                take ownership of their feedback and use it to improve their
                performance.
              </li>
              <li>
                With our app, you are the sole owner feedback you’ve received,
                which means you can take it with you hassle-free even after you
                change employers or projects. You no longer need to rely on HR
                departments or management to facilitate feedback sessions.
                Instead, you can request feedback at your own pace, on your own
                terms, and without any barriers.
              </li>
              <li>
                Our app has been designed with the latest best practices in
                organizational psychology in mind. We understand that top-down
                feedback processes are often ineffective and outdated.
                That&apos;s why Improveme.io empowers individuals to take
                control of their own growth and development by requesting
                feedback from their peers in a constructive and actionable way.
              </li>
            </ul>
          </section>
          <section className="pb-10">
            <h2 className="text-xl">How it works</h2>
            <p>
              Sign up for an account and get started on your journey towards
              continuous improvement. Once you&apos;ve created your account, you
              can create a feedback request in just a few clicks. This request
              can be customized to suit your specific needs and can be shared
              with your peers at your convenience.
            </p>
            <p>
              After sharing your request, you can sit back and wait for the
              feedback to come in. Once you receive feedback, you can manage it
              easily through our platform. With improveme.io, it&apos;s easy to
              keep track of feedback over time, giving you a clear picture of
              your progress and helping you to identify areas for improvement.
            </p>
          </section>
          <section className="pb-10">
            <h2 className="text-xl">Pricing</h2>
            Right now, improveme.io is just a hobby project and is free to use.
            Depending on what happens in the future, we may plan to incorporate
            and introduce pricing – but for now, just use it and enjoy it.
          </section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {!user.isSignedIn && (
              <>
                <SignInButton>
                  <div className="flex max-w-xs cursor-pointer flex-col gap-4">
                    <h3 className="text-2xl font-bold">Sign In →</h3>
                    <div className="text-lg">
                      You will get an email. Follow the white rabbit.
                    </div>
                  </div>
                </SignInButton>
                <SignUpButton>
                  <div className="flex max-w-xs cursor-pointer flex-col gap-4">
                    <h3 className="text-2xl font-bold">Sign Up →</h3>
                    <div className="text-lg">
                      Not in yet? Two clicks to feedback heaven.
                    </div>
                  </div>
                </SignUpButton>
              </>
            )}
            {user.isSignedIn && (
              <>
                <SignOutButton>
                  <div className="flex max-w-xs cursor-pointer flex-col gap-4">
                    <h3 className="text-2xl font-bold">Sign Out →</h3>
                    <div className="text-lg">
                      It was great to have you, but it&lsquo;s now time to go.
                      Good bye.
                    </div>
                  </div>
                </SignOutButton>
                <Link
                  className="flex max-w-xs cursor-pointer flex-col gap-4"
                  href="/feedback/create"
                >
                  <h3 className="text-2xl font-bold">Let&lsquo;s Go →</h3>
                  <div className="text-lg">
                    Request, author and own your feedback. It&lsquo;s that
                    simple.
                  </div>
                </Link>
                <Link
                  className="flex max-w-xs cursor-pointer flex-col gap-4"
                  href="/lego"
                >
                  <h3 className="text-2xl font-bold">Lego →</h3>
                  <div className="text-lg">
                    Beatles in the background, Lego in my hands. Oh, it&lsquo;s
                    time, it&lsquo;s time to be a child again.
                    <ToyBrick />
                  </div>
                </Link>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
