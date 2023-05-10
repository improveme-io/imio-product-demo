import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import { ToyBrick } from "lucide-react";

import { PageHead } from "~/components/page-head";
import { Button } from "~/components/ui/button";

const LegoHome: NextPage = () => {
  return (
    <>
      <PageHead title="improveme.io | Home" />
      <header className="flex justify-between bg-stone-50 px-8 py-8">
      <Image
            className=""
            src="/HeroLogo.svg"
            width={312/2}
            height={153/2}
            alt="Graphic depicting three people giving each other feedback in the cloud"
          />
        <div className="flex">
          <Button
            className="mr-2"
            variant={"ghost"}
            size={"sm"}>Log In</Button>
          <Button
            variant={"outline"}
            size={"sm"}>Sign Up</Button>
        </div>
      </header>
      <main className="container mx-auto flex min-h-screen flex-col gap-x-8 bg-stone-50 py-8 px-8 sm:px-16 md:pl-32">
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
            <Button size={"lg"} className="grow-0 text-lg bg-sky-700 px-10 py-8 text-white">
              Start Collecting Feedback Now
            </Button>
          </div>
          <Image
            className=""
            src="/HeroGraphic.png"
            width={472}
            height={584}
            alt="Graphic depicting three people giving each other feedback in the cloud"
          />
        </div>
      </main>
    </>
  );
};

export default LegoHome;
