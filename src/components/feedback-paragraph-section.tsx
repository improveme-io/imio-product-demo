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
  onSave: () => void;
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
      <Label className="mb-2">
        Write some text to explain on a personal level what kind of feedback you
        are asking for and why.
      </Label>
      <Field<string>
        name="paragraph"
        initialValue={props.paragraph}
        onSubmitValidate={paragraphSchema}
      >
        {({ value, setValue, onBlur, errors }) => (
          <>
            <Textarea
              value={value}
              placeholder="Thanks for filling out my feedback from. Being able to give and receive feedback is essential to effective teamwork and personal and professional growth. Remember, receiving feedback is an opportunity for growth and improvement, so approach these questions with an open mind and a willingness to learn from your teammates' perspectives. Please answer the questions below and always provide specific examples."
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onBlur={() => {
                onBlur();
                props.onSave();
              }}
              className="mt-2 h-96 font-mono text-xl placeholder:text-stone-200"
            />
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </>
        )}
      </Field>
    </>
  );
};
