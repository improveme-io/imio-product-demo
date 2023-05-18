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

  return (
    <Card className="group mt-6 animate-in slide-in-from-left duration-500">
      <CardHeader>
        <div className="relative flex items-center justify-between">
          <CardTitle className="flex max-w-4xl justify-between leading-7">
            <>
              <HelpCircleIcon
                size={32}
                className="mr-4 shrink-0 text-stone-400"
              />
              {currentPrompt ? (
                currentPrompt
              ) : (
                <span className="text-stone-400">Untitled Feedback Item</span>
              )}
            </>
          </CardTitle>
          <div className="absolute right-0 flex w-1/3 justify-end gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {!isEditing && (
              <Button
                variant={"outline"}
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button variant={"destructive"} onClick={props.onRemove}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="my-4">
            <div className="flex flex-grow flex-col">
              <Label className="mb-2">Prompt</Label>
              <Input
                type="text"
                value={props.prompt}
                onChange={(e) => {
                  setCurrentPrompt(e.target.value);
                  props.onChange(e);
                }}
                onBlur={props.onBlur}
                placeholder="Type Your Question Here..."
              />
            </div>

            <div className="mt-4 flex flex-grow flex-col">
              <Label className="mb-2">Type</Label>
              <div className="flex">
                <Select defaultValue="PROSE">
                  <SelectTrigger disabled className="w-96">
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
                <p className="w-96 px-3 py-1 text-xs">
                  The author will be shown the prompt you have defined and will
                  be asked to answer in prose at a minimum of 240 characters.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
