import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "special";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

const baseStyles =
  "h-12 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-ink text-lime hover:opacity-90",
  secondary: "border-2 border-ink text-ink hover:bg-ink hover:text-lime",
  special: "bg-gradient-to-r from-[#6D28D9] to-[#DB2777] text-white hover:from-[#7C3AED] hover:to-[#EC4899]",
};

export const StandartButton = ({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {isLoading ? "Confirming…" : children}
    </button>
  );
};
