import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: [
          "border border-emerald-500",
          "bg-gradient-to-r from-black/40 to-black/60",
          "text-white font-semibold",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
          "hover:bg-black/50",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
          "before:-translate-x-full hover:before:translate-x-full",
          "before:transition-transform before:duration-700",
          "backdrop-blur-[2px]",
        ].join(" "),
        destructive:
          "bg-red-600/80 text-white hover:bg-red-600/90 border border-red-500",
        outline:
          "border border-emerald-500 bg-transparent hover:bg-emerald-500/10 text-emerald-500",
        secondary:
          "bg-white/10 text-white hover:bg-white/20 border border-white/20",
        ghost: "text-white hover:bg-white/10",
        link: "text-emerald-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2", 
        sm: "h-9 px-5 text-xs",    
        lg: "h-12 px-10 text-base", 
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
