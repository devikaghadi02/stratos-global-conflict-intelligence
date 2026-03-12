import { motion } from "framer-motion";
import { useApp } from "../../context/useApp";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Zap, Package, Ship, BarChart3, Anchor, TrendingUp } from "lucide-react";

const SYSTEM_ICONS = {
    energy: Zap,
    trade: Package,
    logistics: Ship,
    economy: BarChart3,
    maritime: Anchor
};

const STATUS_CONFIG = {
    CRITICAL: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", bar: "bg-red-500" },
    HIGH: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", bar: "bg-amber-500" },
    ELEVATED: { color: "text-amber-300", bg: "bg-amber-500/5", border: "border-amber-500/10", bar: "bg-amber-300" },
    MEDIUM: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", bar: "bg-purple-500" },
    LOW: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" },
};

export default function ImpactPage() {
    const { systemImpact } = useApp();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-5xl"
        >
            {/* Page Header */}
            <div className="mb-10">
                <h1 className="text-[48px] font-[800] text-white leading-tight">Impact Analysis</h1>
                <p className="text-[16px] text-[var(--color-text-secondary)] mt-1">
                    Current severity levels and forecasted risk across interconnected global systems.
                </p>
            </div>

            {/* Grid of System Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                {systemImpact?.map((system, i) => {
                    const config = STATUS_CONFIG[system.status] || STATUS_CONFIG.LOW;
                    const Icon = SYSTEM_ICONS[system.system.toLowerCase()] || Zap;
                    const trendVal = system.forecast - system.current;
                    const trendPrefix = trendVal >= 0 ? "+" : "";

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col hover:border-white/10 transition-all group"
                        >
                            <div className={`p-2.5 rounded-lg border w-fit mb-4 ${config.bg} ${config.border}`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>

                            <span className="text-[14px] font-[500] text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider font-heading">
                                {system.system}
                            </span>

                            <div className="flex items-baseline gap-1">
                                <span className={`text-5xl font-bold tracking-tighter mono ${config.color}`}>
                                    {system.current}
                                </span>
                                <span className="text-[14px] font-mono text-[var(--color-text-muted)]">/100</span>
                            </div>

                            <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-[700] border uppercase tracking-widest w-fit ${config.bg} ${config.border} ${config.color}`}>
                                {system.status}
                            </div>

                            <div className="mt-auto pt-6">
                                <div className="flex justify-between items-center mb-1.5 text-[12px] font-mono">
                                    <span className="text-[var(--color-text-muted)] uppercase">Forecast</span>
                                    <span className="text-red-400 font-[600]">{trendPrefix}{trendVal}</span>
                                </div>
                                {/* Visual Bar */}
                                <div className="w-full h-[3px] bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${system.current}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full ${config.bar}`}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Chart Section */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-[20px] font-[600] text-white">System Comparison</h3>
                        <p className="text-[14px] text-[var(--color-text-secondary)]">Current impact severity vs future probability</p>
                    </div>
                    <div className="flex items-center gap-6 font-mono text-[13px]">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-[var(--color-cyan-brand)]"></div>
                            <span className="text-[var(--color-text-secondary)]">Current</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-blue-600/30 border border-blue-500/40"></div>
                            <span className="text-[var(--color-text-secondary)]">Forecast</span>
                        </div>
                    </div>
                </div>

                <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={systemImpact} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a3347" />
                            <XAxis
                                dataKey="system"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#8892a4', fontSize: 13, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#4a5568', fontSize: 12, family: 'IBM Plex Mono' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{
                                    backgroundColor: '#1a1f2e',
                                    border: '1px solid #2a3347',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                }}
                            />
                            <Bar
                                dataKey="current"
                                fill="#22d3ee"
                                radius={[4, 4, 0, 0]}
                                barSize={32}
                            />
                            <Bar
                                dataKey="forecast"
                                fill="rgba(37, 99, 235, 0.2)"
                                stroke="#3b82f6"
                                strokeWidth={1}
                                radius={[4, 4, 0, 0]}
                                barSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}
