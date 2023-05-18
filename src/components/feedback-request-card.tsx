"use client";

import { Button } from "~/components/ui/button";
import { EditIcon, ViewIcon, TrashIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { UserItem } from "./user-item";
import Link from "next/link";
import { FeedbackRequestDialog } from "~/components/feedback-request-dialog";

type FeedbackRequestCardProps = {
  slug: string;
  title: string;
  paragraph: string;
  feedbackItems: { prompt: string | null }[];
  ownerEmail: string;
  authors: { email: string; id: string }[];
  canEdit?: boolean;
};

export const FeedbackRequestCard = (props: FeedbackRequestCardProps) => {
  return (
    <Card className="group mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{props.title}</CardTitle>
          <div className="flex justify-end gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button variant="ghost" className="text-red-500">
              <TrashIcon className="mr-2 h-4 w-4 text-red-500" />
              Delete
            </Button>
            {props.canEdit && (
              <Button asChild variant="ghost">
                <Link href={`/feedback/${props.slug}`}>
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}
            <FeedbackRequestDialog
              title={props.title}
              paragraph={props.paragraph}
              feedbackItems={props.feedbackItems}
              ownerEmail={props.ownerEmail}
              renderDialogTrigger={
                <Button variant="outline">
                  <ViewIcon className="mr-2 h-4 w-4" />
                  {props.canEdit ? "Preview" : "View"}
                </Button>
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="my-4 flex gap-4">
        <div className="mb-4 flex flex-grow flex-col">
          <Label>Authors</Label>
          <div className="mt-2 flex">
            {props.authors.map((author) => (
              // TODO: initials function
              <UserItem key={author.id} email={author.email} initials={"fb"} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
