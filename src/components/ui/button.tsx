import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F00] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF6F00] text-white rounded-full shadow-sm hover:bg-[#F57C00] hover:scale-[1.03] active:scale-100",
        destructive:
          "bg-[#EA4335] text-white rounded-full hover:bg-[#C5221F] hover:scale-[1.03] active:scale-100",
        outline:
          "border border-[#E5E7EB] bg-white text-[#5F6368] rounded-full hover:bg-[#F3F4F6] hover:scale-[1.03] active:scale-100",
        secondary:
          "bg-[#F3F4F6] text-[#202124] rounded-full hover:bg-[#E5E7EB] hover:scale-[1.03] active:scale-100",
        ghost:
          "text-[#5F6368] rounded-lg hover:bg-[#F3F4F6] hover:text-[#202124]",
        link:
          "text-[#FF6F00] underline-offset-4 hover:underline rounded-none p-0 h-auto",
        orange:
          "bg-[#FF6F00] text-white rounded-full shadow-sm hover:bg-[#F57C00] hover:shadow-[0_4px_16px_rgba(255,111,0,0.30)] hover:scale-[1.03] active:scale-100",
        glass:
          "bg-white/30 backdrop-blur-md text-gray-900 hover:bg-white/40 border border-white/20 shadow-lg rounded-full",
        "glass-dark":
          "bg-gray-900/30 backdrop-blur-md text-white hover:bg-gray-900/40 border border-gray-700/20 shadow-lg rounded-full",
      },
      size: {
        default: "h-10 px-5 py-2 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
