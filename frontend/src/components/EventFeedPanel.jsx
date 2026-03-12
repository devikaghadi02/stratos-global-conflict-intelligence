// src/components/EventFeedPanel.jsx
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useApp } from "../context/AppContext";
import PanelCard from "./shared/PanelCard";
import { SeverityBadge, DomainBadge } from "./shared/Badge";

const CATEGORY_COLORS = {
    CONFLICT: "#ef4444",
    ENERGY: "#f59e0b",
    LOGISTICS: "#10b981",
    DIPLOMACY: "#8b5cf6",
    TRADE: "#00d4ff",
    ECONOMY: "#0077ff",
};

function timeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m ago`;
    return `${m}m ago`;
}

export default function EventFeedPanel() {
    const { events } = useApp();

    return (
        <PanelCard
            title="Event Feed"
            icon={<Activity size={13} />}
            accentColor="#10b981"
            badge={`${events.length} EVENTS`}
        >
            <div className="divide-y" style={{ borderColor: "#1a2d4a" }}>
                {events.map((event, i) => {
                    const catColor = CATEGORY_COLORS[event.category] || "#64748b";
                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.06 }}
                            className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-default"
                        >
                            {/* Top row */}
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="flex items-start gap-2">
                                    <div
                                        className="w-0.5 h-full min-h-[40px] rounded-full shrink-0 mt-0.5"
                                        style={{ background: catColor, boxShadow: `0 0 4px ${catColor}60` }}
                                    />
                                    <div>
                                        <p className="text-xs font-medium text-slate-200 leading-tight mb-1">
                                            {event.title}
                                        </p>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span
                                                className="text-xs font-mono"
                                                style={{ color: catColor }}
                                            >
                                                {event.category}
                                            </span>
                                            <span className="text-slate-700">·</span>
                                            <span className="text-xs font-mono text-slate-500">{event.region}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <SeverityBadge level={event.severity} />
                                    <span className="text-xs font-mono text-slate-600">{timeAgo(event.timestamp)}</span>
                                </div>
                            </div>

                            {/* Impact domains */}
                            <div className="flex gap-1 mt-1 ml-3">
                                {event.impact.map((d) => (
                                    <DomainBadge key={d} domain={d} />
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </PanelCard>
    );
}