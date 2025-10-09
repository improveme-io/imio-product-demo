"use client";

import { Button } from "~/components/ui/button";
import { EditIcon, HelpCircleIcon, TrashIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import React from "react";
import { cn } from "~/utils/style";

type FeedbackItemProps = {
  index: number;
  prompt: string;
  editing: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onRemove: () => void;
};

// TODO: this needs to be broken up and moved into the section component
export const FeedbackItem = (props: FeedbackItemProps) => {
  const [currentPrompt, setCurrentPrompt] = React.useState<string | null>(
    props.prompt
  );
  const [isEditing, setIsEditing] = React.useState(props.editing);
  const cardTitleClassNames = "flex w-full leading-7 min-h-20 items-start";

  return (
    <Card className="group mt-6 animate-in slide-in-from-left duration-500 sm:mt-6">
      <CardHeader>
        <div className="relative flex items-center justify-between">
          {isEditing ? (
            <CardTitle className={cardTitleClassNames}>
              <HelpCircleIcon
                size={32}
                className="mr-4 shrink-0 text-stone-400"
              />
              <Input
                autoFocus
                className="relative -top-1 text-lg dark:placeholder-stone-500"
                type="text"
                value={props.prompt}
                onChange={(e) => {
                  setCurrentPrompt(e.target.value);
                  props.onChange(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    setIsEditing(false);
                  }
                }}
                onBlur={() => setIsEditing(false)}
                placeholder="Type Your Question Here..."
              />
            </CardTitle>
          ) : (
            <CardTitle
              onClick={() => {
                setIsEditing(true);
              }}
              className={cardTitleClassNames}
            >
              <HelpCircleIcon
                size={32}
                className="mr-4 shrink-0 text-stone-400"
              />
              <span className={cn([currentPrompt ? "" : "text-stone-400"])}>
                {currentPrompt ? currentPrompt : "Untitled Feedback Item"}
              </span>
              <Button
                className="ml-auto transition-opacity duration-300 group-hover:opacity-100 pointerdevice:opacity-0"
                variant={"outline"}
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </CardTitle>
          )}
        </div>
      </CardHeader>
      <CardContent className="mt-4 flex grow flex-col">
        <Label className="mb-2">Type</Label>
        <div className="flex flex-col sm:flex-row">
          <Select defaultValue="PROSE">
            <SelectTrigger disabled className="sm:w-96">
              <SelectValue placeholder="Select Feedback Item Type…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROSE">Prose</SelectItem>
              <SelectItem value="SHORT_PROSE">
                Short Prose (240 char max)
              </SelectItem>
              <SelectItem value="VIDEO">Video</SelectItem>
            </SelectContent>
          </Select>
          <p className="pt-3 text-xs sm:w-96 sm:px-3 sm:py-1 sm:pt-0">
            The author will be shown the prompt you have defined and will be
            asked to answer in prose at a minimum of 240 characters.
          </p>
          <Button
            variant={"ghost"}
            onClick={props.onRemove}
            className="ml-auto text-red-500 transition-opacity duration-300 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 pointerdevice:opacity-0"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
