import { motion } from "framer-motion";
import { useApp } from "../../context/useApp";
import { TrendingUp, AlertTriangle, Calendar, Target, ArrowRight } from "lucide-react";

export default function RiskPage() {
    const { riskForecast } = useApp();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl"
        >
            {/* Page Header */}
            <div className="mb-12">
                <h1 className="text-[48px] font-[800] text-white leading-tight">Risk Forecast</h1>
                <p className="text-[16px] text-[var(--color-text-secondary)] mt-1">
                    Predictive disruption scenarios based on current geopolitical signal clusters.
                </p>
            </div>

            <div className="space-y-6">
                {riskForecast?.risks?.map((risk, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 hover:border-[rgba(34,211,238,0.15)] transition-all group relative overflow-hidden"
                    >
                        {/* Background Probability Fill */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${risk.probability}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="absolute left-0 bottom-0 top-0 bg-[var(--color-cyan-brand)] opacity-[0.02]"
                        />

                        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                            {/* Probability Indicator */}
                            <div className="flex flex-col items-center justify-center p-6 bg-[var(--color-surface-2)] rounded-2xl border border-[var(--color-border)] min-w-[140px] shadow-lg">
                                <span className="text-[12px] font-[700] text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Prob.</span>
                                <span className="text-[44px] font-[800] text-[var(--color-cyan-brand)] font-mono leading-none">
                                    {risk.probability}%
                                </span>
                            </div>

                            {/* Risk Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-[800] border uppercase tracking-widest ${risk.probability > 75 ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        risk.probability > 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                        }`}>
                                        {risk.probability > 75 ? 'CRITICAL' : risk.probability > 50 ? 'PROBABLE' : 'POSSIBLE'}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[13px] font-mono text-[var(--color-text-muted)]">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {risk.timeframe}
                                    </div>
                                </div>

                                <h3 className="text-[24px] font-[700] text-white mb-3 group-hover:text-[var(--color-cyan-brand)] transition-colors">
                                    {risk.title}
                                </h3>

                                <p className="text-[16px] text-[var(--color-text-secondary)] leading-relaxed mb-6">
                                    Analysis of current vectors indicates a shift towards {risk.title.toLowerCase()}.
                                    Potential impact concentrated in logistics and maritime trade routes.
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[var(--color-border)]">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-[600] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Impact Radius</span>
                                        <span className="text-[14px] font-[600] text-slate-300">Global Corridor</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-[600] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Confidence</span>
                                        <span className="text-[14px] font-[600] text-slate-300">High (84%)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="md:self-center p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white hover:border-cyan-400/30 transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Probability Legend */}
            <div className="mt-12 p-8 bg-[rgba(34,211,238,0.03)] border border-[rgba(34,211,238,0.1)] rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-[var(--color-cyan-brand)]" />
                    <h3 className="text-[20px] font-[600]">Forecasting Model v2.4</h3>
                </div>
                <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                    The probability scores are generated by STRATOS' Bayesian inference engine, cross-referencing past conflict escalation patterns with real-time news intensity and satellite intelligence counts.
                </p>
            </div>
        </motion.div>
    );
}
