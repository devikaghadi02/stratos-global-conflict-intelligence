import { twMerge } from "tailwind-merge";

export default function Badge({ children, variant = "neutral", className }) {
    const variants = {
        neutral: "bg-slate-800 text-slate-400 border-slate-700",
        primary: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20",
        success: "bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20",
        warning: "bg-brand-amber/10 text-brand-amber border-brand-amber/20",
        danger: "bg-brand-rose/10 text-brand-rose border-brand-rose/20",
        indigo: "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20"
    };

    return (
        <span className={twMerge(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
