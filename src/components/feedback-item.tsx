"use client";

import { Button } from "~/components/ui/button";
import { EditIcon } from "lucide-react";
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

type FeedbackItemProps = {
  title: string | null;
  editing: boolean;
};

export const FeedbackItem = (props: FeedbackItemProps) => {
  return (
    <Card className="group mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <h3 className="flex text-xl">{props.title}</h3>
          {!props.editing && (
            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100">
              <Button variant={"outline"}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant={"destructive"}>Remove</Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {props.editing ? (
          <div className="my-4">
            <div className="mb-4 flex flex-grow flex-col">
              <Label>Type</Label>
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
                  The author will be shown the propt you&apos;ve defined and
                  will be asked to answer in prose at a minimum of 240
                  characters.
                </p>
              </div>
            </div>
            <div className="flex flex-grow flex-col">
              <Label>Prompt</Label>
              <Input
                type="text"
                placeholder="What do you wish {Author} would change in the future?"
              />
            </div>
            <div className="mt-8 flex justify-end">
              <Button variant={"ghost"} className="mr-2">
                Discard
              </Button>
              <Button>Save</Button>
            </div>
          </div>
        ) : (
          <div className="my-4 flex gap-4">
            <div className="mb-4 flex flex-grow flex-col">
              <Label>Type</Label>
              <div>Prose</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
