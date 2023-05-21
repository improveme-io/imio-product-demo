import { type ChangeEvent } from "react";
import { FieldArray, FieldArrayItem } from "houseform";

import {
  PuzzleIcon,
  PlusSquareIcon,
  FileIcon,
  FilePlus2Icon,
  HelpCircleIcon,
} from "lucide-react";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { FeedbackItem } from "~/components/feedback-item";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/utils/style";
import {
  promptSchema,
  type FeedbackItemForm,
  isFeedbackItem,
} from "~/utils/validation";


const MAX_FEEDBACK_ITEMS = 10;

type FeedbackItemSectionProps = {
  feedbackItems?: { prompt: string | null }[];
};

export const FeedbackItemSection = (props: FeedbackItemSectionProps) => {
  // FIXME: this is horrible, maybe we should get the type from prisma instead of the zod schema... or maybe even generate the zod schema from prisma?
  const sanitizedFeedbackItems = props.feedbackItems?.map((feedbackItem) => {
    return { prompt: feedbackItem.prompt === null ? "" : feedbackItem.prompt };
  });
  const initialValue = sanitizedFeedbackItems ?? [
    {
      prompt: "",
    },
  ];

  const templates = [
    {
      name: "UVA: Management and Leadership in the Digital Age",
      description:
        "Mandatory questions for the group work feedback. Please use this.",
      prompts: [
        "What aspects of my contributions to the group project do you think were particularly helpful or effective?",
        "How could I have better aligned my contributions with the goals of the project?",
        "Did you observe any missed opportunities where my skills or knowledge could have been better utilized for the success of the project?",
      ],
      highlight: true,
    },
    {
      name: "Basic Feedback",
      description: "Very basic feedback: what went well / what went wrong…",
      prompts: ["What did I do well?", "What could I improve on?"],
      highlight: false,
    },
    {
      name: "Project-Based Feedback",
      description: "Ask questions specifically about a single project.",
      prompts: [
        "From your perspective, what areas or aspects of the project do you think I could have done even better? Please provide specific examples.",
        "How could I have better aligned my contributions with the goals of the project? Please provide specific examples.",
      ],
      highlight: false,
    },
  ];

  return (
      <FieldArray<FeedbackItemForm>
        name="feedbackItems"
        initialValue={initialValue}
      >
        {({
          value: feedbackItems,
          add: addToFeedbackItems,
          remove: removeFromFeedbackItems,
        }) => (
          <>
            <div className="mt-8 flex flex-col-reverse ">
              <div className="mr-8 w-full">
                <h2 className="mb-4 flex items-center text-xl">
                  <PuzzleIcon className="mr-2" />
                  Feedback Items
                </h2>
                <p className="w-4/6 px-3 py-1 pl-8">
                  Feedback authors will be presented with Feedback Items
                  (Questions). Use the templates below to create your Request as
                  quickly as possible, or add own your own.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {templates.map((templateItem, index) => (
                    <Card
                      key={index}
                      className={cn(
                        ["my-4 flex flex-col"],
                        templateItem.highlight ? "" : "bg-stone-100"
                      )}
                    >
                      <CardHeader className="pb-1">
                        <CardTitle className="flex items-baseline">
                          <FileIcon className="mr-2 h-4 w-4 shrink-0" />
                          {templateItem.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="my-5">
                          <AccordionItem value="item-1">
                            {templateItem.description}
                            <br />
                            <AccordionTrigger className="text-left">
                              Includes {templateItem.prompts.length} Items…
                            </AccordionTrigger>
                            <AccordionContent>
                              <ol className="">
                                {templateItem.prompts.map((_, index) => (
                                  <li className="mb-3 flex" key={index}>
                                    <HelpCircleIcon
                                      className="relative top-1 mr-2 shrink-0 text-stone-500"
                                      size={16}
                                    />
                                    {_}
                                  </li>
                                ))}
                              </ol>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <Button
                          className="w-full"
                          disabled={feedbackItems.some(
                            (feedbackItem) => !isFeedbackItem(feedbackItem)
                          )}
                          variant={
                            templateItem.highlight ? "default" : "outline"
                          }
                          size={"lg"}
                          onClick={() => {
                            templateItem.prompts.map((_) =>
                              addToFeedbackItems({ prompt: _ })
                            );
                          }}
                        >
                          <FilePlus2Icon className="mr-2 h-5 w-5" />
                          Add Set ({templateItem.prompts.length} items)
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <ul>
                  {feedbackItems.map((_, index) => (
                    <li key={`feedback-item-${index}`}>
                      <FieldArrayItem<string>
                        name={`feedbackItems[${index}].prompt`}
                        onSubmitValidate={promptSchema}
                        onBlurValidate={promptSchema}
                      >
                        {({ value, setValue, onBlur }) => (
                          <FeedbackItem
                            index={index}
                            prompt={value}
                            editing={true}
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>
                            ) => {
                              setValue(event.target.value);
                            }}
                            onBlur={onBlur}
                            onRemove={function (): void {
                              removeFromFeedbackItems(index);
                            }}
                          />
                        )}
                      </FieldArrayItem>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <Separator className="mb-3 mt-5" />

              <Button
                className="mb-12 mt-4 bg-white"
                disabled={feedbackItems.some(
                  (feedbackItem) => !isFeedbackItem(feedbackItem)
                )}
                variant={"outline"}
                size={"lg"}
                onClick={() => {
                  // TODO: remember last selection
                  addToFeedbackItems({ prompt: "" });
                }}
              >
                <PlusSquareIcon className="mr-2 h-5 w-5" />
                Add New Feedback Item (
                {MAX_FEEDBACK_ITEMS - feedbackItems.length} left)
              </Button>
            </div>
          </>
        )}
      </FieldArray>
    </section>
  );
};
