import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const GeneralError = () => {
  return (
    <div className="grid h-screen place-items-center">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong, please try again.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const UnathorizedError = () => {
  return (
    <div className="grid h-screen place-items-center">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unauthorized</AlertTitle>
        <AlertDescription>
          You are not authorized to view this page.
        </AlertDescription>
      </Alert>
    </div>
  );
};
