import { motion } from "framer-motion";
import { useApp } from "../../context/useApp";
import { Clock, MapPin, Tag } from "lucide-react";
import { useState } from "react";

const SEVERITY_COLORS = {
    CRITICAL: "#f87171", // red
    HIGH: "#fbbf24",    // amber
    MEDIUM: "#a78bfa",  // purple/indigo
    LOW: "#34d399"      // green
};

const SEVERITY_BADGES = {
    CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
    HIGH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    MEDIUM: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
};

export default function EventsPage() {
    const { events } = useApp();
    const [filter, setFilter] = useState("All");

    const filteredEvents = events?.filter(e =>
        filter === "All" || e.severity === filter.toUpperCase()
    ) || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl"
        >
            {/* Page Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-1">
                    <h1 className="text-[48px] font-[800] text-white leading-tight">Event Feed</h1>
                    <span className="bg-[rgba(34,211,238,0.08)] text-[var(--color-cyan-brand)] px-3 py-1 rounded-full text-[14px] font-mono font-[600] mt-4">
                        {filteredEvents.length}
                    </span>
                </div>
                <p className="text-[16px] text-[var(--color-text-secondary)]">
                    Detected geopolitical events sorted by recency and severity.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 mb-12">
                {["All", "Critical", "High", "Medium"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-5 py-2 rounded-full text-[14px] font-[600] border transition-all ${filter === f
                            ? "bg-[rgba(34,211,238,0.08)] border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                            : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Timeline Content */}
            <div className="relative pl-10">
                {/* Vertical Line */}
                <div className="absolute left-5 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[var(--color-border)] via-[var(--color-border)] to-transparent"></div>

                <div className="space-y-10">
                    {filteredEvents.map((event, i) => (
                        <div key={i} className="relative">
                            {/* Timeline Dot */}
                            <div
                                className="absolute -left-[25px] top-6 w-[11px] h-[11px] rounded-full z-10"
                                style={{
                                    backgroundColor: SEVERITY_COLORS[event.severity] || SEVERITY_COLORS.LOW,
                                    boxShadow: `0 0 0 6px ${SEVERITY_COLORS[event.severity]}25`
                                }}
                            ></div>

                            {/* Event Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 hover:border-[rgba(255,255,255,0.1)] transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 text-[13px] font-mono text-[var(--color-text-muted)]">
                                        <Clock className="w-3.5 h-3.5" />
                                        {event.timestamp}
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-[700] border uppercase tracking-wider ${SEVERITY_BADGES[event.severity]}`}>
                                        {event.severity}
                                    </span>
                                </div>

                                <h3 className="text-[24px] font-[700] text-white mb-2 group-hover:text-[var(--color-cyan-brand)] transition-colors">
                                    {event.title}
                                </h3>

                                <div className="flex items-center gap-4 text-[15px] text-[var(--color-text-secondary)] mb-6">
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                                        {event.category}
                                    </div>
                                    <span className="text-[var(--color-text-muted)]">·</span>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                                        {event.region}
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {event.impact?.map((system, j) => (
                                        <span
                                            key={j}
                                            className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-full px-3 py-1 text-[13px] font-[500] text-[var(--color-text-secondary)]"
                                        >
                                            {system}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
