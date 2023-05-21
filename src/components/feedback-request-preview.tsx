"use client";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import ReactMarkdown from "react-markdown";

type FeedbackRequestPreviewProps = {
  title?: string;
  paragraph?: string;
  feedbackItems?: { prompt: string | null }[];
  renderOwner?: React.ReactNode;
};

export const FeedbackRequestPreview = (props: FeedbackRequestPreviewProps) => {
  return (
    <section>
      <div className="mx-auto max-w-4xl">
        <h1 className="px-8 pb-8 pt-16 font-serif text-3xl">{props.title}</h1>
      </div>
      <div className="mx-auto flex max-w-4xl flex-col px-8 pb-8">
        <Card className="mb-16 mt-2">
          <CardHeader className="mr-3">
            <div className="flex items-center">
              {props.renderOwner}
              <p className="mx-2">is requesting Your feedback:</p>
            </div>
            <CardContent className="flex items-center px-0">
              <ReactMarkdown className="prose mt-8 max-w-2xl leading-6">
                {props.paragraph ?? ""}
              </ReactMarkdown>
            </CardContent>
          </CardHeader>
        </Card>
        <ul>
          {props.feedbackItems?.map((item, index) => (
            <li key={`feedback-item-${index}`} className="mt-4 max-w-4xl">
              <Label className="mb-8 block max-w-3xl text-xl">
                {item.prompt}
              </Label>
              <Textarea
                disabled
                placeholder="Type Your Answer here, for example: I found your contributions to be particularly helpful or effective when..."
                className="mb-20 mt-2 h-96 bg-white font-mono text-xl placeholder:text-stone-200"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
