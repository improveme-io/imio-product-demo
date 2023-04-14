import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("border border-slate-100 bg-white", {
  variants: {
    variant: {
      default: "",
      shadow: "drop-shadow-md",
      hoverable: "hover:border-slate-200 hover:bg-slate-50",
    },
    weight: {
      default: "px-4 py-4 rounded-lg",
      sm: "p-2 rounded-md",
      lg: "p-8 rounded-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    weight: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, weight, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, weight, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export { Card };
