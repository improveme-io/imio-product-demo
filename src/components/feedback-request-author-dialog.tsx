import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Card, CardHeader } from "~/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Label } from "~/components/ui/label";
import { Button } from "./ui/button";

type FeedbackRequestAuthorDialogProps = {
  title?: string | null;
  paragraph?: string;
  feedbackItems: {
    id: string;
    prompt: string;
    payload: string;
  }[];
  renderAuthor?: React.ReactNode;
  renderOwner?: React.ReactNode;
  hasErrors?: boolean;
  onSubmit?: () => void;
  renderDialogTrigger?: React.ReactNode;
  renderDialogFooter?: React.ReactNode;
};

export const FeedbackRequestAuthorDialog = (
  props: FeedbackRequestAuthorDialogProps,
) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.renderDialogTrigger}</DialogTrigger>
      {/* TODO: it is transparent without setting a background, investigate our UI library configuration */}

      <DialogContent className="bg-background h-full overflow-y-scroll sm:inset-10 sm:h-auto sm:w-auto sm:max-w-none">
        <section>
          <Card className="mt-6 mb-16 sm:mx-12 sm:mt-3">
            <CardHeader className="mr-3">
              <div className="flex flex-col sm:flex-row sm:items-center">
                {props.renderOwner}
                <p className="mx-2">will see the following.</p>
              </div>
            </CardHeader>
          </Card>
          <div className="mx-auto max-w-4xl">
            <h1 className="px-8 pt-16 pb-8 font-serif text-3xl">
              {props.title}
            </h1>
          </div>
          <div className="mx-auto flex max-w-4xl flex-col px-8 pb-8">
            <ul>
              {/* collect unique owner feedback items */}
              {props.feedbackItems.map(
                (item: { id: string; prompt: string; payload: string }) => (
                  <div
                    key={`feedback-item-${item.id}`}
                    className="mt-4 max-w-4xl"
                  >
                    <Label className="mb-8 block max-w-3xl font-serif text-xl font-normal">
                      {item.prompt}
                    </Label>
                    <div className="mb-32 w-full">
                      <li className="mt-8 mb-12 grid w-full grid-cols-4">
                        <div className="w-full">{props.renderAuthor}</div>
                        <ReactMarkdown className="prose dark:prose-invert col-span-3 w-full max-w-2xl text-lg leading-7">
                          {item.payload ?? ""}
                        </ReactMarkdown>
                      </li>
                    </div>
                  </div>
                ),
              )}
            </ul>
          </div>
        </section>
        <DialogFooter className="gap-4">
          <DialogClose asChild>
            <Button variant="outline" size="lg">
              Back to Authoring
            </Button>
          </DialogClose>
          {props.renderDialogFooter}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
