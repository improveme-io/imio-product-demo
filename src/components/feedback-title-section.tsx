import { Button } from "~/components/ui/button";
import React from "react";
import { Field } from "houseform";

import { EditButton } from "~/components/edit-button";
import { Input } from "~/components/ui/input";
import { feedbackTitleSchema } from "~/utils/validation";
import { SaveIcon } from "lucide-react";

type FeedBackTitleSectionProps = {
  title: string | null | undefined;
  onSave: () => void;
};

export const FeedbackTitleSection = (props: FeedBackTitleSectionProps) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <Field<string>
      name="title"
      initialValue={props.title ?? "Untitled Feedback Request"}
      onSubmitValidate={feedbackTitleSchema}
    >
      {({ value, setValue, errors }) => (
        <>
          <div className="flex flex-row">
            <h1 className="mt-8 w-full text-2xl">
              {isEditing && (
                <div className="flex flex-row items-center">
                  <Input
                    autoFocus
                    placeholder="Untitled Feedback Request"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onBlur={() => setIsEditing(false)}
                    className="flex-grow text-2xl"
                  />
                  <Button
                    size={"sm"}
                    onClick={() => setIsEditing(false)}
                    className="ml-5"
                  >
                    <SaveIcon
                      onClick={() => {
                        props.onSave();
                      }}
                      className="mr-2 h-4 w-4"
                    />
                    Save
                  </Button>
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
                  <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <EditButton />
                  </span>
                </div>
              )}
            </h1>
          </div>
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </>
      )}
    </Field>
  );
};
