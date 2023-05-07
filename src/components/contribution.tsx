"use client";

import { Button } from "~/components/ui/button";
import { EditIcon, ViewIcon, CheckIcon } from "lucide-react";

import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";

import { UserItem } from "~/components/user-item";

type ContributionProps = {
  email: string;
  requestName: string;
  requesterInitials: string;
  requesterName: string;
  done: boolean;
};
export const Contribution = (props: ContributionProps) => {
  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex items-center">
        <UserItem initials={props.requesterInitials} email={props.email} />
        {props.done ? (
          <CheckIcon className="ml-auto h-5 w-5 text-green-500" />
        ) : (
          <></>
        )}
      </div>
      <Label>{props.requestName}</Label>
      {props.done ? (
        <Button
          variant={"outline"}
          className="mt-4 opacity-0 hover:bg-slate-50 group-hover:opacity-100"
        >
          <ViewIcon className="mr-2" />
          View
        </Button>
      ) : (
        <Button className="mt-4">
          <EditIcon className="mr-2" />
          Author Feedback
        </Button>
      )}
    </Card>
  );
};
