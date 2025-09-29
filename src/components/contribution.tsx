"use client";

import Link from "next/link";
import { EditIcon, ViewIcon, CheckIcon } from "lucide-react";

import { UserItem } from "~/components/user-item";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

type ContributionProps = {
  hasStarted?: boolean;
  hasFinished?: boolean;
  slug: string;
  requesterEmail: string;
  requestName: string;
  requesterFirstName?: string;
  requesterLastName?: string;
  requesterProfileUrl?: string;
  onAuthor: () => void;
};
export const Contribution = (props: ContributionProps) => {
  return (
    <Card className="group flex flex-col">
      <CardHeader>
        <CardTitle className="text-md flex items-center justify-between font-normal">
          <UserItem
            firstName={props.requesterFirstName}
            lastName={props.requesterLastName}
            email={props.requesterEmail}
            profileImageUrl={props.requesterProfileUrl}
          />

          {props.hasFinished && (
            <CheckIcon className="ml-auto h-5 w-5 text-green-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-between">
        <Label className="text-md">{props.requestName}</Label>

        {!props.hasFinished && (
          <Button
            variant="default"
            onClick={() => {
              props.onAuthor();
            }}
            className="mt-4"
          >
            <EditIcon className="mr-2" />
            {props.hasStarted ? "Continue Authoring" : "Author Feedback"}
          </Button>
        )}
        {props.hasFinished && (
          <Button
            asChild
            variant={"outline"}
            className="mt-4 transition-opacity duration-300 hover:bg-stone-50 group-hover:opacity-100 dark:hover:bg-stone-50 dark:hover:text-stone-950 pointerdevice:opacity-0"
          >
            <Link href={`/feedback/${props.slug}`}>
              <ViewIcon className="mr-2" />
              View
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
