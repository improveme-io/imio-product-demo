import { type ChangeEvent } from "react";
import { FieldArray, FieldArrayItem } from "houseform";
import { PuzzleIcon, PlusSquareIcon, FilePlus2Icon } from "lucide-react";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import { FeedbackItem } from "~/components/feedback-item";
import { feedbackItemSchema, promptSchema } from "~/utils/validation";

const MAX_FEEDBACK_ITEMS = 10;

type FeedbackItem = z.infer<typeof feedbackItemSchema>;

function isFeedbackItem(value: unknown): value is FeedbackItem {
  return feedbackItemSchema.safeParse(value).success;
}

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

  const template = [
    "What aspects of my contributions to the group project do you think were particularly helpful or effective?",
    "How could I have better aligned my contributions with the goals of the project?",
    "Did you observe any missed opportunities where my skills or knowledge could have been better utilized for the success of the project?",
  ];

  return (
    <section className="pb-64">
      <h2 className="mb-4 mt-8 flex text-xl">
        <PuzzleIcon className="mr-2" />
        Feedback Items
      </h2>
      <p className="w-4/6 px-3 py-1 pl-8">
        Feedback authors will be presented with several Feedback Items. Feedback
        items generally consist of a prompt and some kind of input provided by
        the author. Most commonly, a question and prose written as an answer.
      </p>
      <FieldArray<FeedbackItem>
        name="feedbackItems"
        initialValue={initialValue}
      >
        {({
          value: feedbackItems,
          add: addToFeedbackItems,
          remove: removeFromFeedbackItems,
        }) => (
          <>
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
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
            <div className="flex justify-between">
              <Button
                className="my-12 bg-white"
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
                <span className="mr-2">
                  <PlusSquareIcon size={20} />
                </span>
                Add New Feedback Item (
                {MAX_FEEDBACK_ITEMS - feedbackItems.length} left)
              </Button>
              <Button
                className="my-16 grow-0 px-10 py-8 text-lg text-white"
                disabled={feedbackItems.some(
                  (feedbackItem) => !isFeedbackItem(feedbackItem)
                )}
                size={"lg"}
                onClick={() => {
                  // TODO: remember last selection
                  template.map((_) => addToFeedbackItems({ prompt: _ }));
                }}
              >
                <span className="mr-2">
                  <FilePlus2Icon size={20} />
                </span>
                Add All Standard UVA Course Questions ({template.length} items)
              </Button>
            </div>
          </>
        )}
      </FieldArray>
    </section>
  );
};
