"use client";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

type FeedbackRequestViewProps = {
  title?: string;
  paragraph?: string;
  feedbackItems?: { prompt: string }[];
  renderOwner?: React.ReactNode;
};

export const FeedbackRequestView = (props: FeedbackRequestViewProps) => {
  return (
    <section className="overflow-y-scroll">
      <div>
        <h1 className="p-8 font-serif text-3xl">{props.title}</h1>
      </div>
      <div className="flex flex-col px-8 pb-8">
        <div className="flex items-center">
          <p className="mr-2">Feedback Request from</p>
          {props.renderOwner}
        </div>
        <p className="mb-12">{props.paragraph}</p>
        <ul>
          {props.feedbackItems?.map((item, index) => (
            <li key={`feedback-item-${index}`} className="mt-4">
              <Label>{item.prompt}</Label>
              <Textarea disabled className="mt-2 h-96 font-mono text-xl" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
