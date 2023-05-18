"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/utils/style";

type UserItemProps = {
  email: string | null | undefined;
  initials?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
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
    <li className={cn("mr-6 inline-flex", props.className)}>
      <Avatar className="mr-2 h-6 w-6 text-xs text-slate-500">
        <AvatarImage></AvatarImage>
        <AvatarFallback>{renderedInitials}</AvatarFallback>
      </Avatar>
      {renderedUsername}
    </li>
  );
};
