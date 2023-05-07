"use client";

import { Button } from "~/components/ui/button";
import { EditIcon, ViewIcon, TrashIcon } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { UserItem } from "./user-item";

type FeedbackRequestItemProps = {
  title: string;
  slug: string;
  authors: { email: string; id: string }[];
};
export const FeedbackRequestItem = (props: FeedbackRequestItemProps) => {
  return (
    <Card className="mb-8">
      <div className="flex justify-between">
        <h3 className="flex text-xl">{props.title}</h3>
        <p>{props.slug}</p>
        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100">
          <Button variant="ghost" className="text-red-500">
            <TrashIcon className="mr-2 h-4 w-4 text-red-500" />
            Delete
          </Button>
          <Button variant="ghost">
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline">
            <ViewIcon className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
      <div className="my-4 flex gap-4">
        <div className="mb-4 flex flex-grow flex-col">
          <Label>Authors</Label>
          <div className="mt-2 flex">
            {props.authors.map((author) => (
              <UserItem key={author.id} email={author.email} initials={"fb"} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
