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
  const hello = api.example.hello.useQuery({ text: "from @robotkutya" });

  const user = useUser();

  return (
    <>
      <PageHead />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            feedback <span className="text-[hsl(280,100%,70%)]">ME</span> Daddy
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {!user.isSignedIn && (
              <>
                <SignInButton>
                  <div className="flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                    <h3 className="text-2xl font-bold">Sign In →</h3>
                    <div className="text-lg">
                      You will get an email. Follow the white rabbit.
                    </div>
                  </div>
                </SignInButton>
                <SignUpButton>
                  <div className="flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
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
                  <div className="flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                    <h3 className="text-2xl font-bold">Sign Out →</h3>
                    <div className="text-lg">
                      It was great to have you, but it&lsquo;s now time to go.
                      Good bye.
                    </div>
                  </div>
                </SignOutButton>
                <Link
                  className="flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                  href="/feedback/create"
                >
                  <h3 className="text-2xl font-bold">Let&lsquo;s Go →</h3>
                  <div className="text-lg">
                    Request, author and own your feedback. It&lsquo;s that
                    simple.
                  </div>
                </Link>
                <Link
                  className="flex max-w-xs cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
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
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
