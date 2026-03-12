import { Shield, FileText, Activity, Zap, TrendingUp, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { id: "analysis", label: "Analysis", icon: FileText, path: "/dashboard/analysis" },
    { id: "events", label: "Event Feed", icon: Activity, path: "/dashboard/events" },
    { id: "impact", label: "Impact Analysis", icon: Zap, path: "/dashboard/impact" },
    { id: "risk", label: "Risk Forecast", icon: TrendingUp, path: "/dashboard/risk" },
    { id: "narrative", label: "Narrative Analysis", icon: Eye, path: "/dashboard/narrative" },
    { id: "assistant", label: "AI Assistant", icon: Sparkles, path: "/dashboard/assistant" },
];

export default function Sidebar({ activeTab, onNavigate }) {
    return (
        <aside className="w-[260px] flex flex-col h-screen border-r border-slate-800/80 bg-slate-950/50 backdrop-blur-xl sticky top-0 shrink-0">
            {/* Branding */}
            <div className="p-8 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-cyan/10 rounded-xl border border-brand-cyan/20">
                        <Shield className="w-6 h-6 text-brand-cyan" />
                    </div>
                    <span className="text-xl font-heading font-bold text-white tracking-tight italic">
                        STRATOS
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? "bg-brand-cyan/10 text-brand-cyan font-semibold shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                }`}
                        >
                            <Icon className={`w-[18px] h-[18px] ${isActive ? "text-brand-cyan" : "text-slate-500 group-hover:text-slate-300"}`} />
                            <span className="text-sm tracking-tight">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-brand-cyan rounded-full"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User / Footer */}
            <div className="p-6 border-t border-slate-800/50">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800/50 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-indigo flex items-center justify-center text-slate-900 font-bold text-xs">
                        JD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">Intelligence Alpha</p>
                        <p className="text-[10px] text-slate-500 truncate font-mono uppercase tracking-widest">Operator-01</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
