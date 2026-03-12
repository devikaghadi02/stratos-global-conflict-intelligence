// src/components/EvidencePanel.jsx
import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { useApp } from "../context/AppContext";
import PanelCard from "./shared/PanelCard";
import { SeverityBadge } from "./shared/Badge";

const RELEVANCE_COLOR = {
    CRITICAL: "#ef4444",
    HIGH: "#f59e0b",
    MEDIUM: "#8b5cf6",
    LOW: "#10b981",
};

function ScoreBar({ score }) {
    const pct = Math.round(score * 100);
    const color = score > 0.85 ? "#ef4444" : score > 0.70 ? "#f59e0b" : "#8b5cf6";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full" style={{ background: "#1a2d4a" }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
                />
            </div>
            <span className="text-xs font-mono w-8 text-right" style={{ color }}>
                {pct}%
            </span>
        </div>
    );
}

export default function EvidencePanel() {
    const { evidenceChunks } = useApp();

    return (
        <PanelCard
            title="Evidence Chunks"
            icon={<Database size={13} />}
            accentColor="#00d4ff"
            badge={`${evidenceChunks.length}`}
        >
            <div className="divide-y" style={{ borderColor: "#1a2d4a" }}>
                {evidenceChunks.map((chunk, i) => (
                    <motion.div
                        key={chunk.chunk_id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="p-4 hover:bg-white/[0.02] transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-xs font-mono w-5 h-5 rounded flex items-center justify-center font-bold shrink-0"
                                    style={{ background: "#00d4ff15", color: "#00d4ff" }}
                                >
                                    {chunk.position}
                                </span>
                                <SeverityBadge level={chunk.relevance} />
                            </div>
                            <span className="text-xs font-mono text-slate-600">{chunk.word_count}w</span>
                        </div>

                        <p className="text-xs leading-relaxed text-slate-300 mb-2 font-body">{chunk.text}</p>

                        <ScoreBar score={chunk.score} />
                    </motion.div>
                ))}
            </div>
        </PanelCard>
    );
}