"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/utils/style";

type UserItemProps = {
  email: string | null | undefined;
  initials?: string;
  name?: string;
  className?: string;
};

export const UserItem = (props: UserItemProps) => {
  const renderedUsername = props.name ? props.name : props.email;
  return (
    <li className={cn("mr-6 inline-flex", props.className)}>
      <Avatar className="mr-2 h-6 w-6 text-xs text-slate-500">
        <AvatarImage></AvatarImage>
        <AvatarFallback>{props.initials}</AvatarFallback>
      </Avatar>
      {renderedUsername}
    </li>
  );
};
