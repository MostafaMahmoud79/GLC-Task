import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CustomInput({
  className,
  type,
  icon,
  disabled,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: ReactNode;
}) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute start-3 sm:start-4 top-1/2 -translate-y-1/2 z-10">
          {icon}
        </span>
      )}

      <input
        type={type}
        disabled={disabled}
        data-slot="input"
        className={cn(
          "rounded-[8px] bg-[#FFFFFF66] file:text-foreground",
          "placeholder:capitalize placeholder:text-[#62626B]",
          "selection:bg-primary selection:text-primary-foreground",
          "dark:bg-input/30 border-[#FFFFFF] border-[1px]",
          "flex h-[50px] sm:h-[57px] w-full min-w-0",
          "text-sm sm:text-base shadow-xs transition-all duration-200",
          "outline-none focus:ring-2 focus:ring-[#9414FF] focus:border-[#9414FF]",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent",
          "file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "aria-invalid:border-destructive",
          className,
          icon ? "ps-[44px] sm:ps-[52px] pe-3 sm:pe-4" : "px-3 sm:px-4"
        )}
        {...props}
      />
    </div>
  );
}