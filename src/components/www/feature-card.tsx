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
      <CardHeader className="flex flex-row">
        <div className="ml-0 mr-1 w-10">
          <props.Icon />
        </div>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="ml-11">{props.paragraph}</p>
      </CardContent>
    </Card>
  );
};
