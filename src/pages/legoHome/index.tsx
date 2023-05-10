import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import { ToyBrick } from "lucide-react";

import { PageHead } from "~/components/page-head";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
        <div className="md:grid md:grid-cols-2 md:gap-8 ">
          <div className="md:col-span-2">
            <h2 className="my-12 font-serif text-3xl">Keep it forever.</h2>
            <p className="mb-16 text-lg md:max-w-lg">
            Whether you're a student or a freelancer, work for a tiny startup or a big multinational corporation, our app empowers you to not only facilitate but truly own your own feedback.
            </p>
          </div>
          {FeatureCard("You're in control.")}
          {FeatureCard("Science has your back.")}
          {FeatureCard("Size doesn't matter.")}
          {FeatureCard("Feedback needs to be actionable.")}
        </div>
      </main>
    </>
  );
};

const FeatureCard = (Title: string) => {
  const title = Title;
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
      <p>With our app, you are the sole owner feedback you've received, which means you can take it with you hassle-free even after you change employers or projects. You no longer need to rely on formal feedback procedures to facilitate feedback sessions. Instead, you can request feedback at your own pace, on your own terms, and without any institutional barriers.</p>
      </CardContent>
    </Card>
  )};

export default LegoHome;
