import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type FeatureCardProps = {
  Icon: LucideIcon;
  title: string;
  paragraph: string;
};

export const FeatureCard = (props: FeatureCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row space-y-0">
        <div className="mt-1 mr-1 ml-0 w-10 shrink-0">
          <props.Icon />
        </div>
        <CardTitle className="mt-0 leading-7">{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="ml-11">{props.paragraph}</p>
      </CardContent>
    </Card>
  );
};
