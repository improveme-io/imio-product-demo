"use client";

import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";

import { Textarea } from "~/components/ui/textarea";

type FeedbackRequestViewProps = {
  title?: string;
  paragraph?: string;
  feedbackItems?: { prompt: string }[];
};

export const FeedbackRequestView = (props: FeedbackRequestViewProps) => {
  return (
    <section className="overflow-y-scroll">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col px-8 py-8">
        <h3>{props.paragraph}</h3>
        <ul>
          {props.feedbackItems?.map((item, index) => (
            <li key={`feedback-item-${index}`} className="mt-4">
              <Label>{item.prompt}</Label>
              <Textarea disabled className="mt-2 h-16 font-mono text-xl" />
            </li>
          ))}
        </ul>
      </CardContent>
    </section>
  );
};
