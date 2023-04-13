import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { PageHead } from "~/components/page-head";

const Create: NextPage = () => {
  const user = useUser();

  return (
    <>
      <PageHead title="Create" />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            feedback <span className="text-[hsl(280,100%,70%)]">ME</span> Daddy
          </h1>
          <p className="text-3xl tracking-tight text-white">
            chillin & feedbackin w/{" "}
            <span className="text-[hsl(280,100%,70%)]">
              {user.user?.primaryEmailAddress?.emailAddress ?? "you"}
            </span>
          </p>
        </div>
      </main>
    </>
  );
};

export default Create;
