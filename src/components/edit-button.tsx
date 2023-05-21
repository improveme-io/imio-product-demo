"use client";

import { Button } from "~/components/ui/button";
import { EditIcon } from "lucide-react";

// TODO: I think this is kind of useless, we don't use it in a lot of places and it's such a small component compared to the already existing button...
type EditButtonProps = {
  onClick?: () => void;
};
export const EditButton = (props: EditButtonProps) => {
  return (
    <Button
      className="ml-5"
      variant={"ghost"}
      size={"sm"}
      onClick={props.onClick}
    >
      <EditIcon className="mr-2 h-4 w-4" />
      Edit
    </Button>
  );
};
