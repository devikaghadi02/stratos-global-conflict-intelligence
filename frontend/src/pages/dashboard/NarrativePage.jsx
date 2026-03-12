import { motion } from "framer-motion";
import { useApp } from "../../context/useApp";
import { ShieldCheck, AlertCircle, Info, ExternalLink } from "lucide-react";

export default function NarrativePage() {
    const { narratives } = useApp();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-5xl"
        >
            {/* Page Header */}
            <div className="mb-12">
                <h1 className="text-[48px] font-[800] text-white leading-tight">Narrative Analysis</h1>
                <p className="text-[16px] text-[var(--color-text-secondary)] mt-1">
                    Comparing geopolitical rhetoric against verified physical and digital intelligence signals.
                </p>
            </div>

            <div className="space-y-8">
                {narratives?.map((narrative, i) => {
                    const confidence = narrative.confidence || 0;
                    const alignment = narrative.alignment || 'UNVERIFIED';

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Verification Header */}
                            <div className={`px-8 py-3 border-b flex justify-between items-center ${confidence > 80 ? 'bg-emerald-500/5 border-emerald-500/10' :
                                    confidence > 50 ? 'bg-amber-500/5 border-amber-500/10' :
                                        'bg-red-500/5 border-red-500/10'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className={`w-4 h-4 ${confidence > 80 ? 'text-emerald-400' :
                                            confidence > 50 ? 'text-amber-400' :
                                                'text-red-400'
                                        }`} />
                                    <span className="text-[12px] font-[700] uppercase tracking-widest text-[var(--color-text-secondary)]">Verification Confidence</span>
                                </div>
                                <span className={`text-[16px] font-mono font-[800] ${confidence > 80 ? 'text-emerald-400' :
                                        confidence > 50 ? 'text-amber-400' :
                                            'text-red-400'
                                    }`}>
                                    {confidence}%
                                </span>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className={`px-3 py-1 rounded-full text-[12px] font-[700] border uppercase tracking-widest ${alignment === 'ALIGNED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            alignment === 'PARTIALLY_ALIGNED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                alignment === 'CONTRADICTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        }`}>
                                        {alignment.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Public Narrative */}
                                    <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl p-6 relative">
                                        <div className="absolute -top-3 left-4 bg-[#2a3347] px-3 py-0.5 rounded text-[10px] font-[700] uppercase tracking-widest text-[#8892a4] border border-[#3b4661]">
                                            Public Narrative
                                        </div>
                                        <p className="text-[16px] text-[#cbd5e1] leading-relaxed italic mb-4">
                                            "{narrative.narrative}"
                                        </p>
                                        <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)] font-[500]">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Source: Public Media / Official Statements
                                        </div>
                                    </div>

                                    {/* Signal Reality */}
                                    <div className="bg-[rgba(34,211,238,0.03)] border border-[rgba(34,211,238,0.1)] rounded-xl p-6 relative">
                                        <div className="absolute -top-3 left-4 bg-[var(--color-cyan-brand)] px-3 py-0.5 rounded text-[10px] font-[700] uppercase tracking-widest text-[#0f1117] shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                            Signal Reality
                                        </div>
                                        <p className="text-[16px] text-white leading-relaxed font-[500] mb-4">
                                            {narrative.evidence}
                                        </p>
                                        <div className="flex items-center gap-2 text-[12px] text-cyan-400/60 font-[500]">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Verified by OSINT & Satellite Clusters
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Metadata */}
                                <div className="mt-8 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <span className="text-[11px] font-[600] text-[var(--color-text-muted)] uppercase tracking-wider block mb-3">Sources & Evidence</span>
                                        <div className="flex flex-wrap gap-2">
                                            {narrative.signals?.map(s => (
                                                <span key={s} className="px-3 py-1 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-full text-[12px] font-[500] text-[var(--color-text-secondary)] flex items-center gap-1.5 cursor-pointer hover:border-white/10 transition-all">
                                                    {s} <ExternalLink className="w-3 h-3 text-[var(--color-text-muted)]" />
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-[var(--color-text-muted)] bg-[rgba(255,255,255,0.02)] px-4 py-2 rounded-xl border border-[var(--color-border)] h-fit">
                                        <Info className="w-4 h-4" />
                                        <span className="text-[13px] font-[500]">Conflict Vector: {confidence > 50 ? 'DECEPTION DETECTED' : 'SIGNAL ALIGNMENT'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
