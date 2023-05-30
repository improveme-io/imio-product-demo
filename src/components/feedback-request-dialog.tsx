import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";

import { FeedbackRequestPreview } from "~/components/feedback-request-preview";

type FeedbackRequestDialogProps = {
  title?: string;
  paragraph?: string;
  feedbackItems?: { prompt: string | null }[];
  renderOwner?: React.ReactNode;
  hasErrors?: boolean;
  onSubmit?: () => void;
  renderDialogTrigger?: React.ReactNode;
  renderDialogFooter?: React.ReactNode;
};

export const FeedbackRequestDialog = (props: FeedbackRequestDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.renderDialogTrigger}</DialogTrigger>
      {/* TODO: it is transparent without setting a background, investigate our UI library configuration */}
      <DialogContent className="h-full overflow-y-scroll bg-background sm:inset-10 sm:h-auto sm:w-auto sm:max-w-none">
        <FeedbackRequestPreview
          title={props.title}
          paragraph={props.paragraph}
          feedbackItems={props.feedbackItems}
          renderOwner={props.renderOwner}
        />
        <DialogFooter className="flex-wrap gap-4">
          {props.renderDialogFooter}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
