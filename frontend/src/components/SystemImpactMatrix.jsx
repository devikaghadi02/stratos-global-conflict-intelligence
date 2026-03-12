// src/components/SystemImpactMatrix.jsx
import { motion } from "framer-motion";
import { Grid3x3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useApp } from "../context/AppContext";
import PanelCard from "./shared/PanelCard";

const STATUS_COLORS = {
    CRITICAL: "#ef4444",
    HIGH: "#f59e0b",
    ELEVATED: "#fbbf24",
    MEDIUM: "#8b5cf6",
    LOW: "#10b981",
};

const SYSTEM_ICONS = {
    Energy: "⚡",
    Trade: "📦",
    Logistics: "🚢",
    Economy: "📊",
    Shipping: "🛳",
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        return (
            <div
                className="px-3 py-2 rounded border text-xs font-mono"
                style={{ background: "#0d1525", borderColor: "#1a2d4a" }}
            >
                <div style={{ color: "#00d4ff" }}>{payload[0].payload.system}</div>
                <div className="text-slate-400">Current: <span className="text-white">{payload[0].payload.current}%</span></div>
                <div className="text-slate-400">Forecast: <span style={{ color: "#ef4444" }}>{payload[0].payload.forecast}%</span></div>
            </div>
        );
    }
    return null;
};

export default function SystemImpactMatrix() {
    const { systemImpact } = useApp();

    return (
        <PanelCard
            title="System Impact Matrix"
            icon={<Grid3x3 size={13} />}
            accentColor="#ef4444"
        >
            {/* Bar chart */}
            <div className="px-4 pt-4" style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={systemImpact} barGap={2} barSize={20}>
                        <XAxis
                            dataKey="system"
                            tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}
                            axisLine={{ stroke: "#1a2d4a" }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fill: "#64748b", fontSize: 9, fontFamily: "JetBrains Mono" }}
                            axisLine={false}
                            tickLine={false}
                            tickCount={5}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                        <Bar dataKey="current" radius={[2, 2, 0, 0]}>
                            {systemImpact.map((entry) => (
                                <Cell
                                    key={entry.system}
                                    fill={STATUS_COLORS[entry.status] || "#64748b"}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Bar>
                        <Bar dataKey="forecast" radius={[2, 2, 0, 0]} fill="#ef444430" stroke="#ef4444" strokeWidth={1}>
                            {systemImpact.map((entry) => (
                                <Cell key={entry.system} fill="#ef444420" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-4 mb-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-2 rounded-sm" style={{ background: "#f59e0b" }} />
                    <span className="text-xs font-mono text-slate-500">Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-2 rounded-sm border" style={{ background: "#ef444420", borderColor: "#ef4444" }} />
                    <span className="text-xs font-mono text-slate-500">Forecast</span>
                </div>
            </div>

            {/* Grid cards */}
            <div className="grid grid-cols-5 gap-0 border-t" style={{ borderColor: "#1a2d4a" }}>
                {systemImpact.map((system, i) => {
                    const color = STATUS_COLORS[system.status] || "#64748b";
                    return (
                        <motion.div
                            key={system.system}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className="p-3 text-center border-r last:border-r-0"
                            style={{ borderColor: "#1a2d4a" }}
                        >
                            <div className="text-lg mb-1">{SYSTEM_ICONS[system.system]}</div>
                            <div className="text-xs font-mono text-slate-400 mb-1">{system.system}</div>
                            <div className="text-lg font-mono font-bold" style={{ color }}>
                                {system.current}
                            </div>
                            <div
                                className="text-xs font-mono mt-0.5 px-1 rounded"
                                style={{ background: `${color}15`, color }}
                            >
                                {system.status}
                            </div>
                            {system.trend === "up" && (
                                <div className="text-xs font-mono mt-1" style={{ color: "#ef4444" }}>
                                    ↑ {system.forecast - system.current}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </PanelCard>
    );
}