import { UserItem } from "~/components/user-item";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";

import { FeedbackRequestView } from "~/components/feedback-request-view";

type FeedbackRequestDialogProps = {
  title?: string;
  paragraph?: string;
  feedbackItems?: { prompt: string | null }[];
  ownerEmail?: string;
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
      <DialogContent className="inset-10 overflow-y-scroll bg-stone-50 sm:h-auto sm:w-auto sm:max-w-none">
        <FeedbackRequestView
          title={props.title}
          paragraph={props.paragraph}
          feedbackItems={props.feedbackItems}
          renderOwner={<UserItem className="mr-0" email={props.ownerEmail} />}
        />
        <DialogFooter>{props.renderDialogFooter}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
