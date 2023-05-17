"use client";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { LeafIcon } from "lucide-react";
import Image from "next/image";

type FeedbackRequestViewProps = {
  title?: string;
  paragraph?: string;
  feedbackItems?: { prompt: string }[];
  renderOwner?: React.ReactNode;
};

export const FeedbackRequestView = (props: FeedbackRequestViewProps) => {
  return (
    <section>
      <div className="mx-auto max-w-4xl">
        <Image
          className="mr-4"
          src="/Logo.svg"
          width={78 / 2}
          height={60 / 2}
          alt="improveme.io logo"
        />
        <h1 className="px-8 pb-8 pt-20 font-serif text-3xl">{props.title}</h1>
      </div>
      <div className="mx-auto flex max-w-4xl flex-col px-8 pb-8">
        <div className="flex items-center pb-8">
          <div className="mr-3">
            <LeafIcon size={20} />
          </div>
          <p className="mr-2">Feedback Request from</p>
          {props.renderOwner}
        </div>
        <p className="mb-12 max-w-2xl leading-6">{props.paragraph}</p>
        <ul>
          {props.feedbackItems?.map((item, index) => (
            <li key={`feedback-item-${index}`} className="mt-4 max-w-4xl">
              <Label className="mb-8 block max-w-3xl text-xl">
                {item.prompt}
              </Label>
              <Textarea
                disabled
                className="mb-20 mt-2 h-96 font-mono text-xl"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
