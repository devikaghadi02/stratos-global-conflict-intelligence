// src/components/NarrativeRealityPanel.jsx
import { motion } from "framer-motion";
import { Eye, CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import PanelCard from "./shared/PanelCard";

const ALIGNMENT_CONFIG = {
    ALIGNED: {
        label: "Aligned",
        color: "#10b981",
        bg: "#10b98115",
        border: "#10b98130",
        Icon: CheckCircle,
    },
    PARTIALLY_ALIGNED: {
        label: "Partially Aligned",
        color: "#f59e0b",
        bg: "#f59e0b15",
        border: "#f59e0b30",
        Icon: AlertTriangle,
    },
    CONTRADICTED: {
        label: "Contradicted",
        color: "#ef4444",
        bg: "#ef444415",
        border: "#ef444430",
        Icon: XCircle,
    },
    UNVERIFIABLE: {
        label: "Unverifiable",
        color: "#64748b",
        bg: "#64748b15",
        border: "#64748b30",
        Icon: HelpCircle,
    },
};

function ConfidenceBar({ confidence, color }) {
    return (
        <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-mono text-slate-600 w-20 shrink-0">Confidence</span>
            <div className="flex-1 h-1 rounded-full" style={{ background: "#1a2d4a" }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                />
            </div>
            <span className="text-xs font-mono w-8 text-right" style={{ color }}>
                {confidence}%
            </span>
        </div>
    );
}

// Summary counts bar at top
function AlignmentSummary({ narratives }) {
    const counts = narratives.reduce((acc, n) => {
        acc[n.alignment] = (acc[n.alignment] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="flex gap-2 px-4 py-3 border-b" style={{ borderColor: "#1a2d4a" }}>
            {Object.entries(ALIGNMENT_CONFIG).map(([key, cfg]) => {
                const count = counts[key] || 0;
                return (
                    <div
                        key={key}
                        className="flex-1 flex flex-col items-center py-2 rounded"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                        <cfg.Icon size={14} style={{ color: cfg.color }} />
                        <span className="text-xs font-mono font-bold mt-1" style={{ color: cfg.color }}>
                            {count}
                        </span>
                        <span className="text-xs font-mono text-slate-600 text-center leading-tight mt-0.5">
                            {cfg.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default function NarrativeRealityPanel() {
    const { narratives } = useApp();

    return (
        <PanelCard
            title="Narrative vs Reality"
            icon={<Eye size={13} />}
            accentColor="#8b5cf6"
        >
            <AlignmentSummary narratives={narratives} />

            <div className="p-4 flex flex-col gap-3">
                {narratives.map((item, i) => {
                    const cfg = ALIGNMENT_CONFIG[item.alignment] || ALIGNMENT_CONFIG.UNVERIFIABLE;
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded p-3"
                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                        >
                            {/* Header */}
                            <div className="flex items-start gap-2 mb-2">
                                <cfg.Icon size={14} style={{ color: cfg.color }} className="mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span
                                            className="text-xs font-mono font-semibold"
                                            style={{ color: cfg.color }}
                                        >
                                            {cfg.label}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-200 leading-snug italic">
                                        "{item.narrative}"
                                    </p>
                                </div>
                            </div>

                            {/* Evidence */}
                            <p className="text-xs text-slate-400 leading-relaxed mb-2">{item.evidence}</p>

                            {/* Signals */}
                            <div className="flex flex-wrap gap-1 mb-2">
                                {item.signals.map((s) => (
                                    <span
                                        key={s}
                                        className="text-xs font-mono px-1.5 py-0.5 rounded"
                                        style={{ background: "#1a2d4a", color: "#64748b" }}
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>

                            <ConfidenceBar confidence={item.confidence} color={cfg.color} />
                        </motion.div>
                    );
                })}
            </div>
        </PanelCard>
    );
}