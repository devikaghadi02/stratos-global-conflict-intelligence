import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export default function Button({
    children,
    onClick,
    variant = "primary",
    size = "md",
    className,
    type = "button",
    disabled = false,
    icon: Icon
}) {
    const variants = {
        primary: "bg-brand-cyan text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
        outline: "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white",
        ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={twMerge(
                "inline-flex items-center justify-center rounded-lg font-semibold tracking-tight transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {Icon && <Icon className={clsx("mr-2", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />}
            {children}
        </motion.button>
    );
}
