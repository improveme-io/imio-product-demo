"use client";

import Link from "next/link";
import { EditIcon, ViewIcon, CheckIcon } from "lucide-react";

import { cn } from "~/utils/style";
import { UserItem } from "~/components/user-item";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

type ContributionProps = {
  slug: string;
  email: string | null;
  requestName: string | null;
  requesterFirstName?: string;
  requesterLastName?: string;
  done: boolean;
};
export const Contribution = (props: ContributionProps) => {
  return (
    <Card className="group flex flex-col">
      <CardHeader>
        <CardTitle className="text-md flex items-center justify-between font-normal">
          <UserItem
            firstName={props.requesterFirstName}
            lastName={props.requesterLastName}
            email={props.email}
          />
          {props.done ? (
            <CheckIcon className="ml-auto h-5 w-5 text-green-500" />
          ) : (
            <></>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-between">
        <Label className="text-md">{props.requestName}</Label>
        <Button
          asChild
          variant={props.done ? "outline" : "default"}
          className={cn(
            "mt-4",
            // props.done && "bg-green-500 text-white" : "bg-blue-500 text-white"
            props.done &&
              "opacity-0 transition-opacity duration-300 hover:bg-slate-50 group-hover:opacity-100"
          )}
        >
          <Link href={`/feedback/${props.slug}`}>
            {props.done ? (
              <>
                <ViewIcon className="mr-2" />
                View
              </>
            ) : (
              <>
                <EditIcon className="mr-2" />
                Author Feedback
              </>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
