import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  const variants = {
    primary: "bg-accent text-accent-ink hover:brightness-110 shadow-sm",
    secondary: "bg-white text-black hover:bg-neutral-200 shadow-sm",
    outline: "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/30",
    ghost: "text-neutral-300 hover:text-white hover:bg-white/10",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
}

