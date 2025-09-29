"use client";

import { Button } from "~/components/ui/button";
import { EditIcon, TrashIcon, ViewIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { UserItem } from "./user-item";
import Link from "next/link";
import format from "date-fns/format";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import { cn } from "~/utils/style";

type FeedbackRequestCardProps = {
  slug: string;
  title: string;
  paragraph: string;
  feedbackItems: { prompt: string | null }[];
  ownerEmail: string;
  authors: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    profileImageUrl?: string;
  }[];
  canEdit?: boolean;
  onDelete?: () => void;
  disabled?: boolean;
  created: number | Date;
};

export const FeedbackRequestCard = (props: FeedbackRequestCardProps) => {
  return (
    <Card
      className={cn([
        "group mb-8 transition sm:my-2",
        props.canEdit && "bg-neutral-100 hover:bg-white dark:bg-neutral-800",
      ])}
    >
      <CardHeader>
        <div className="flex flex-col justify-between sm:flex-row sm:items-center">
          <CardTitle>
            {props.canEdit && <span className="text-stone-500">[Draft:]</span>}{" "}
            {props.title}
          </CardTitle>
          <div className="mt-3 flex flex-col items-end justify-end gap-3 transition-opacity duration-300 group-hover:opacity-100 sm:mt-0 sm:flex-row sm:items-center pointerdevice:pointerdevice:opacity-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-destructive dark:hover:text-red-50"
                  disabled={props.disabled}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this Feedback Request and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={props.onDelete}
                  >
                    Yes, Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button asChild variant="ghost" disabled={props.disabled}>
              <Link href={`/feedback/${props.slug}`}>
                {props.canEdit ? (
                  <>
                    <EditIcon className="mr-2 h-4 w-4" />
                    {"Edit"}
                  </>
                ) : (
                  <>
                    <ViewIcon className="mr-2 h-4 w-4" />
                    {"View"}
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div
          className={cn([
            "mb-4 flex flex-grow flex-col",
            props.canEdit ?? "opacity-50",
          ])}
        >
          <Label>Authors</Label>
          <div className="flex flex-wrap">
            {props.authors.map((author) => (
              <>
                {author.firstName.length != 0 &&
                  author.lastName.length != 0 &&
                  author.email.length != 0 && (
                    <UserItem
                      key={author.id}
                      firstName={author.firstName}
                      lastName={author.lastName}
                      profileImageUrl={author.profileImageUrl}
                      email={author.email}
                      className="mt-2"
                    />
                  )}
              </>
            ))}
          </div>
          <Label className="mt-4 font-normal text-stone-500">
            Created {format(props.created, "PPP")}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
