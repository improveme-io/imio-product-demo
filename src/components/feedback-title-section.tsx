import { Button } from "~/components/ui/button";
import React from "react";
import { Field } from "houseform";

import { CardTitle } from "~/components/ui/card";
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
    >
      {({ value, setValue, onBlur, errors }) => (
        <>
          <div className="flex flex-row">
            <CardTitle className="text-2xl">
              {isEditing && (
                <div className="flex flex-row items-center">
                  <Input
                    placeholder="Untitled Feedback Request"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onBlur={onBlur}
                    className="text-2xl"
                  />
                  <Button
                    size={"sm"}
                    onClick={() => setIsEditing(false)}
                    className="ml-5"
                  >
                    Save
                  </Button>
                </div>
              )}
              {!isEditing && (
                <div>
                  <span>{value}</span>
                  <EditButton onClick={() => setIsEditing(true)} />
                </div>
              )}
            </CardTitle>
          </div>
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </>
      )}
    </Field>
  );
};
