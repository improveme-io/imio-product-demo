import React from "react";
import { Field } from "houseform";

import { EditButton } from "~/components/edit-button";
import { Input } from "~/components/ui/input";
import { feedbackTitleSchema } from "~/utils/validation";

type FeedBackTitleSectionProps = {
  title: string | null | undefined;
};

export const FeedbackTitleSection = (props: FeedBackTitleSectionProps) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <Field<string>
      name="title"
      initialValue={props.title ?? "Untitled Feedback Request"}
      onSubmitValidate={feedbackTitleSchema}
      onBlurValidate={feedbackTitleSchema}
    >
      {({ value, setValue, errors }) => (
        <>
          <div className="mt-8 mb-8 flex flex-row sm:mb-0">
            <h1 className="w-full text-2xl">
              {isEditing && (
                <div className="flex flex-row items-center">
                  <Input
                    autoFocus
                    placeholder="Untitled Feedback Request"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") {
                        setIsEditing(false);
                      }
                    }}
                    onBlur={() => setIsEditing(false)}
                    className="grow text-2xl"
                  />
                </div>
              )}
              {!isEditing && (
                <div
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="group"
                >
                  <span>{value}</span>
                  <span className="pointerdevice:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <EditButton />
                  </span>
                </div>
              )}
            </h1>
          </div>
          {errors.map((error) => (
            <p key={`title-${error}`}>{error}</p>
          ))}
        </>
      )}
    </Field>
  );
};
