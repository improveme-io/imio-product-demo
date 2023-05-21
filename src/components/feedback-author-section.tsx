import { FieldArray, FieldArrayItem } from "houseform";
import { TrashIcon, UserIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { type z } from "zod";
import { authorSchema, emailSchema, nameSchema } from "~/utils/validation";

type Author = z.infer<typeof authorSchema>;

function isAuthor(value: unknown): value is Author {
  return authorSchema.safeParse(value).success;
}

type FeedbackAuthorSectionProps = {
  authors?: Author[];
};

export const FeedbackAuthorSection = (props: FeedbackAuthorSectionProps) => {
  const initialValue = props.authors ?? [
    {
      email: "",
      firstName: "",
      lastName: "",
    },
  ];

  return (
    <>
      <h2 className="mb-4 flex text-xl">
        <UserIcon className="mr-2" />
        Feedback Authors
      </h2>
      <p className="max-w-lg text-sm text-stone-500">
        Specify who you would like to get feedback from. All Feedback Authors
        will recieve the same Prompts (Questions) from you.
      </p>
      <FieldArray<Author> name="authors" initialValue={initialValue}>
        {({ value: authors, add: addToAuthors, remove: removeFromAuthors }) => (
          <>
            <ul>
              {authors.map((author, index) => (
                <li
                  key={`author-${index}`}
                  className="items-start justify-between pt-8 md:flex"
                >
                  <FieldArrayItem<string>
                    name={`authors[${index}].email`}
                    onSubmitValidate={emailSchema}
                    onBlurValidate={emailSchema}
                  >
                    {({ value, setValue, onBlur, errors }) => (
                      <div className="mb-6 mr-6 flex flex-grow flex-col md:mb-0">
                        <Label className="mb-2">E-Mail Address</Label>
                        <Input
                          type="email"
                          placeholder="todd@burchik.com"
                          value={value}
                          onChange={(e) => {
                            setValue(e.target.value);
                          }}
                          onBlur={() => {
                            onBlur();
                          }}
                        />
                        {errors.map((error) => (
                          <p key={`authors[${index}].email-${error}`}>
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </FieldArrayItem>
                  <FieldArrayItem<string>
                    name={`authors[${index}].firstName`}
                    onSubmitValidate={nameSchema}
                    onBlurValidate={nameSchema}
                  >
                    {({ value, setValue, onBlur, errors }) => (
                      <div className="mb-6 mr-6 flex flex-grow flex-col md:mb-0">
                        <Label className="mb-2">First Name</Label>
                        <Input
                          type="text"
                          placeholder="Todd"
                          value={value}
                          onChange={(e) => {
                            setValue(e.target.value);
                          }}
                          onBlur={onBlur}
                        />
                        {errors.map((error) => (
                          <p key={`authors[${index}].firstName-${error}`}>
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </FieldArrayItem>
                  <FieldArrayItem<string>
                    name={`authors[${index}].lastName`}
                    onSubmitValidate={nameSchema}
                    onBlurValidate={nameSchema}
                  >
                    {({ value, setValue, onBlur, errors }) => (
                      <div className="mb-6 mr-6 flex flex-grow flex-col md:mb-0">
                        <Label className="mb-2">Last Name</Label>
                        <Input
                          type="text"
                          placeholder="Burchik"
                          value={value}
                          onChange={(e) => {
                            setValue(e.target.value);
                          }}
                          onBlur={onBlur}
                        />
                        {errors.map((error) => (
                          <p key={`authors[${index}].lastName-${error}`}>
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </FieldArrayItem>
                  {/* TODO(@kristof): trashcan looks stupid left on mobile, I'm so bad at CSS, can't fix it, sorry  */}
                  <Button
                    disabled={authors.length < 2}
                    variant={"outline"}
                    onClick={() => {
                      removeFromAuthors(index);
                    }}
                    className="flex-grow-0 md:mt-[22px]"
                  >
                    <TrashIcon size={16} />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              disabled={authors.some((author) => !isAuthor(author))}
              variant={"outline"}
              onClick={() => {
                addToAuthors({ email: "", firstName: "", lastName: "" });
              }}
              className="mt-6 flex-grow-0"
            >
              Add New Author…
            </Button>
          </>
        )}
      </FieldArray>
    </>
  );
};
