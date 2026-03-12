// src/components/shared/Badge.jsx

const SEVERITY_CLASSES = {
    EXTREME: "bg-brand-critical/10 text-brand-critical border-brand-critical/20",
    CRITICAL: "bg-brand-critical/10 text-brand-critical border-brand-critical/20",
    HIGH: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
    ELEVATED: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
    MEDIUM: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    LOW: "bg-brand-success/10 text-brand-success border-brand-success/20",
    ACTIVE: "bg-brand-success/10 text-brand-success border-brand-success/20",
    IDLE: "bg-slate-800 text-slate-500 border-slate-700",
};

export function SeverityBadge({ level, className = "" }) {
    const classes = SEVERITY_CLASSES[level] || SEVERITY_CLASSES.MEDIUM;
    return (
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm uppercase tracking-tight ${classes} ${className}`}>
            {level}
        </span>
    );
}

export function DomainBadge({ domain }) {
    const colors = {
        ENERGY: "text-brand-accent bg-brand-accent/10",
        TRADE: "text-brand-secondary bg-brand-secondary/10",
        CONFLICT: "text-brand-critical bg-brand-critical/10",
        DIPLOMACY: "text-purple-400 bg-purple-400/10",
        LOGISTICS: "text-brand-success bg-brand-success/10",
        ECONOMY: "text-blue-400 bg-blue-400/10",
        SHIPPING: "text-cyan-400 bg-cyan-400/10",
    };
    const c = colors[domain] || "text-slate-500 bg-slate-500/10";
    return (
        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${c}`}>
            {domain}
        </span>
    );
}

export function LoadingSpinner({ size = 16, color = "currentColor" }) {
    return (
        <div
            className="inline-block rounded-full border-2 border-transparent animate-spin"
            style={{
                width: size,
                height: size,
                borderTopColor: color,
                borderRightColor: "rgba(255,255,255,0.1)",
            }}
        />
    );
}
