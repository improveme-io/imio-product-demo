"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type UserItemProps = {
  initials: string;
  email: string | null;
};

export const UserItem = (props: UserItemProps) => {
  return (
    <li className="mr-6 inline-flex">
      <Avatar className="mr-2 h-6 w-6 text-xs text-slate-500">
        <AvatarImage></AvatarImage>
        <AvatarFallback>{props.initials}</AvatarFallback>
      </Avatar>
      {props.email}
    </li>
  );
};
