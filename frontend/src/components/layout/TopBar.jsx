// src/components/layout/TopBar.jsx
import { motion } from "framer-motion";
import { Shield, Activity, Clock, AlertTriangle, Cpu } from "lucide-react";
import { useApp } from "../../context/useApp";

function LiveDot({ active = true }) {
    if (!active) return <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />;
    return (
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
        </span>
    );
}

export default function TopBar() {
    const { documentStats } = useApp();
    const now = new Date().toUTCString().slice(5, 25);

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between px-6 py-2.5 glass-panel border-b-0 rounded-none z-50 sticky top-0"
        >
            {/* Logo & Platform Info */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                        <Shield size={18} className="text-brand-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading text-lg font-bold tracking-tight text-white leading-tight">
                            STRATOS <span className="text-brand-secondary">INTEL</span>
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                            Conflict Intelligence System
                        </span>
                    </div>
                </div>
            </div>

            {/* Central Status Indicators */}
            <div className="flex items-center gap-8 px-6 py-1.5 bg-slate-900/50 rounded-full border border-slate-800/50 shadow-inner">
                <div className="flex items-center gap-2">
                    <LiveDot />
                    <span className="text-[10px] font-mono font-bold text-slate-300">SYSTEM READY</span>
                </div>
                <div className="h-3 w-px bg-slate-800" />
                <div className="flex items-center gap-2">
                    <Activity size={12} className="text-brand-secondary" />
                    <span className="text-[10px] font-mono font-bold text-slate-300">ENCRYPTION: AES-256</span>
                </div>
                <div className="h-3 w-px bg-slate-800" />
                <div className="flex items-center gap-2">
                    <Cpu size={12} className="text-brand-accent" />
                    <span className="text-[10px] font-mono font-bold text-slate-300">GPU: OPTIMIZED</span>
                </div>
            </div>

            {/* Right Side Info */}
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-500">THREAT LEVEL</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-brand-critical' : 'bg-slate-800'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-brand-critical">CRITICAL (8.4/10)</span>
                </div>

                <div className="h-8 w-px bg-slate-800" />

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-slate-500">CURRENT SESSION</span>
                        <div className="flex items-center gap-1.5 text-slate-300">
                            <Clock size={11} className="text-slate-500" />
                            <span className="text-[10px] font-mono font-semibold uppercase">{now} UTC</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
