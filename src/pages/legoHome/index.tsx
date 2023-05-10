import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import { Sprout, Joystick, Users, Microscope } from "lucide-react";

import { PageHead } from "~/components/page-head";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = (
  Icon: React.ReactElement,
  Title: string,
  Paragraph: string
) => {
  const title = Title;
  const paragraph = Paragraph;
  const icon = Icon;
  return (
    <Card>
      <CardHeader className="flex flex-row">
        <div className="ml-0 mr-1 w-10">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="ml-11">{paragraph}</p>
      </CardContent>
    </Card>
  );
};

const LegoHome: NextPage = () => {
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
          <Button className="mr-2" variant={"ghost"} size={"sm"}>
            Log In
          </Button>
          <Button variant={"outline"} size={"sm"}>
            Sign Up
          </Button>
        </div>
      </header>
      <main className="container flex min-h-screen w-full flex-col gap-x-8 bg-stone-50 px-8 py-8 sm:px-16 md:pl-32">
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
            <Button
              size={"lg"}
              className="grow-0 bg-sky-700 px-10 py-8 text-lg text-white"
            >
              Start Collecting Feedback Now
            </Button>
          </div>
          <Image
            className="sm:mt-10 md:mt-0"
            src="/HeroGraphic.png"
            width={472}
            height={584}
            alt="Graphic depicting three people giving each other feedback in the cloud"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8 ">
          <div className="md:col-span-2">
            <h2 className="mb-12 font-serif text-3xl">Keep it forever.</h2>
            <p className="mb-16 text-lg md:max-w-lg">
              Whether you are a student or a freelancer, work for a tiny startup
              or a big multinational corporation, our app empowers you to not
              only facilitate but truly own your own feedback.
            </p>
          </div>
          {FeatureCard(
            <Joystick />,
            "You're in control.",
            "With our app, you are the sole owner feedback you've received, which means you can take it with you hassle-free even after you change employers or projects. You no longer need to rely on formal feedback procedures to facilitate feedback sessions. Instead, you can request feedback at your own pace, on your own terms, and without any institutional barriers."
          )}
          {FeatureCard(
            <Microscope />,
            "Science has your back.",
            "Our app has been designed with the latest best practices in organizational psychology in mind. We understand that top-down feedback processes are often ineffective and outdated and often come only once a year. We take an approach to feedback that is more suitable for the digital age: Quick, easy feedback at any time. You can use it to request feedback after a project has ended or even after you've just delivered a presentation. "
          )}
          {FeatureCard(
            <Users />,
            "Size doesn't matter.",
            "We believe that continuous feedback is essential to personal and professional growth. That's why our app works seamlessly with teams and companies of any size, empowering individuals to take ownership of their feedback and use it to improve their performance."
          )}
          {FeatureCard(
            <Sprout />,
            "Feedback needs to be actionable.",
            "We guide the feedback givers so you can get feedback that you can actually use. Many of us have given feedback before… but was it any good? This is then also an added bonus for people you ask for feedback: They learn something, too! So don't be shy - ask away!"
          )}
        </div>
      </main>
    </>
  );
};

export default LegoHome;
