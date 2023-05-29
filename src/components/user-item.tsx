"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/utils/style";

type UserItemProps = {
  email: string | null | undefined;
  initials?: string;
  name?: string;
  firstName?: string | null;
  lastName?: string | null;
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
    <div className={cn("mr-6 inline-flex items-center", props.className)}>
      <Avatar className="mr-2 text-xs">
        <AvatarImage></AvatarImage>
        <AvatarFallback>{renderedInitials}</AvatarFallback>
      </Avatar>
      {renderedUsername}
    </div>
  );
};
