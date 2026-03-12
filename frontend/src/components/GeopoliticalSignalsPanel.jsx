// src/components/GeopoliticalSignalsPanel.jsx
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";
import PanelCard from "./shared/PanelCard";

const DOMAIN_COLORS = {
    ENERGY: "#f59e0b",
    TRADE: "#00d4ff",
    CONFLICT: "#ef4444",
    DIPLOMACY: "#8b5cf6",
    LOGISTICS: "#10b981",
    ECONOMY: "#0077ff",
};

const DOMAIN_ICONS = {
    ENERGY: "⚡",
    TRADE: "📦",
    CONFLICT: "🎯",
    DIPLOMACY: "🤝",
    LOGISTICS: "🚢",
    ECONOMY: "📈",
};

export default function GeopoliticalSignalsPanel() {
    const { geopoliticalSignals } = useApp();

    const radarData = geopoliticalSignals.map((s) => ({
        subject: s.domain,
        value: s.severity,
    }));

    return (
        <PanelCard
            title="Geopolitical Signals"
            icon={<Radio size={13} />}
            accentColor="#f59e0b"
        >
            {/* Radar Chart */}
            <div className="px-4 pt-4" style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius={75}>
                        <PolarGrid stroke="#1a2d4a" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}
                        />
                        <Radar
                            name="Severity"
                            dataKey="value"
                            stroke="#f59e0b"
                            fill="#f59e0b"
                            fillOpacity={0.15}
                            strokeWidth={1.5}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Signal list */}
            <div className="px-4 pb-4 flex flex-col gap-2">
                {geopoliticalSignals.map((signal, i) => {
                    const color = DOMAIN_COLORS[signal.domain] || "#64748b";
                    return (
                        <motion.div
                            key={signal.domain}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="rounded p-2.5"
                            style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{DOMAIN_ICONS[signal.domain]}</span>
                                    <span className="text-xs font-mono font-semibold" style={{ color }}>
                                        {signal.domain}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-500">{signal.count} signals</span>
                                    <span className="text-xs font-mono font-bold" style={{ color }}>
                                        {signal.severity}
                                    </span>
                                </div>
                            </div>

                            {/* Severity bar */}
                            <div className="h-0.5 w-full rounded-full" style={{ background: "#1a2d4a" }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${signal.severity}%` }}
                                    transition={{ duration: 1, delay: 0.3 + i * 0.06, ease: "easeOut" }}
                                    className="h-full rounded-full"
                                    style={{ background: color }}
                                />
                            </div>

                            {/* Terms */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {signal.terms.map((term) => (
                                    <span
                                        key={term}
                                        className="text-xs font-mono px-1.5 py-0.5 rounded"
                                        style={{ background: "#1a2d4a", color: "#64748b" }}
                                    >
                                        {term}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </PanelCard>
    );
}