import { SendIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Field } from "houseform";
import { z } from "zod";

const paragraphSchema = z
  .string()
  .min(140, "* That's less than half a tweet! Please write a bit more.");

type FeedbackParagraphSectionProps = {
  paragraph: string;
};

export const FeedbackParagraphSection = (
  props: FeedbackParagraphSectionProps
) => {
  return (
    <>
      <div className="mt-12 flex items-center justify-between">
        <h2 className="mb-4 flex text-xl">
          <SendIcon className="mr-2" />
          Introductory Paragraph
        </h2>
      </div>
      <Field<string>
        name="paragraph"
        initialValue={props.paragraph}
        onSubmitValidate={paragraphSchema}
        onBlurValidate={paragraphSchema}
      >
        {({ value, setValue, onBlur, errors }) => (
          <>
            <Label className="mb-2">
              Write some text to explain on a personal level what kind of
              feedback you are asking for and why.
            </Label>
            <Textarea
              value={value}
              placeholder="I really enjoyed working with you on the project. I'm very eager to learn from my experiences and hope you'll support me on that journey. Thank you in advance for your thoughtful input!"
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onBlur={() => {
                onBlur();
              }}
              className="mt-2 h-96 font-mono text-xl placeholder:text-stone-200"
            />
            {errors.map((error) => (
              <p key={`paragraph-${error}`}>{error}</p>
            ))}
          </>
        )}
      </Field>
    </>
  );
};
