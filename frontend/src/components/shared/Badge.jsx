// src/components/shared/Badge.jsx
const SEVERITY_STYLES = {
    CRITICAL: { bg: "#ef444420", color: "#ef4444", border: "#ef444440" },
    EXTREME: { bg: "#ef444430", color: "#ff6060", border: "#ef444460" },
    HIGH: { bg: "#f59e0b20", color: "#f59e0b", border: "#f59e0b40" },
    ELEVATED: { bg: "#f59e0b15", color: "#fbbf24", border: "#f59e0b30" },
    MEDIUM: { bg: "#8b5cf620", color: "#8b5cf6", border: "#8b5cf640" },
    LOW: { bg: "#10b98120", color: "#10b981", border: "#10b98140" },
    ACTIVE: { bg: "#10b98120", color: "#10b981", border: "#10b98140" },
    IDLE: { bg: "#1a2d4a", color: "#64748b", border: "#1a2d4a" },
};

export function SeverityBadge({ level, className = "" }) {
    const style = SEVERITY_STYLES[level] || SEVERITY_STYLES.MEDIUM;
    return (
        <span
            className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${className}`}
            style={{ background: style.bg, color: style.color, borderColor: style.border }}
        >
            {level}
        </span>
    );
}

export function DomainBadge({ domain }) {
    const colors = {
        ENERGY: "#f59e0b",
        TRADE: "#00d4ff",
        CONFLICT: "#ef4444",
        DIPLOMACY: "#8b5cf6",
        LOGISTICS: "#10b981",
        ECONOMY: "#0077ff",
        SHIPPING: "#06b6d4",
    };
    const c = colors[domain] || "#64748b";
    return (
        <span
            className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
            style={{ background: `${c}20`, color: c }}
        >
            {domain}
        </span>
    );
}

// src/components/shared/LoadingSpinner.jsx
export function LoadingSpinner({ size = 16, color = "#00d4ff" }) {
    return (
        <div
            className="inline-block rounded-full border-2 border-transparent animate-spin"
            style={{
                width: size,
                height: size,
                borderTopColor: color,
                borderRightColor: `${color}40`,
            }}
        />
    );
}