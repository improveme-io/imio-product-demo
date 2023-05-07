"use client";

import { Button } from "~/components/ui/button";
import { EditIcon } from "lucide-react";

type EditButtonProps = {
  onClick?: () => void;
};
export const EditButton = (props: EditButtonProps) => {
  return (
    <Button
      className="ml-5 opacity-0 group-hover:opacity-100"
      variant={"ghost"}
      size={"sm"}
      onClick={props.onClick}
    >
      <EditIcon className="mr-2 h-4 w-4" />
      Edit
    </Button>
  );
};
