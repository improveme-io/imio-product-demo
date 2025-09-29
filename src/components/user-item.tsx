"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/utils/style";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { MailIcon } from "lucide-react";

type UserItemProps = {
  email: string | undefined;
  initials?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  className?: string;
};

export const UserItem = (props: UserItemProps) => {
  const renderedUsername = [props.firstName ?? "", props.lastName ?? ""].join(
    " "
  );
  const initials = [
    Array.from(props.firstName ?? "")[0],
    Array.from(props.lastName ?? "")[0],
  ].join("");
  const renderedInitials = props.initials ?? initials;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {" "}
          <div className={cn("mr-6 inline-flex items-center", props.className)}>
            <Avatar className="mr-2 text-xs">
              <AvatarImage src={props.profileImageUrl} />
              <AvatarFallback>{renderedInitials}</AvatarFallback>
            </Avatar>
            {renderedUsername}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="flex items-center gap-2">
          <MailIcon size={16} />
          <p>{props.email}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
