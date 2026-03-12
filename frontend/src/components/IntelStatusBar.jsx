import { motion } from "framer-motion";
// Fixed the import path below
import { useApp } from "../context/AppContext";

const FLOW_COLORS = {
    ACTIVE: { dot: "#10b981", text: "#10b981", bg: "#10b98115" },
    IDLE: { dot: "#475569", text: "#475569", bg: "#1a2d4a" },
    ERROR: { dot: "#ef4444", text: "#ef4444", bg: "#ef444415" },
};

function FlowBadge({ label, status, latency, index }) {
    const c = FLOW_COLORS[status] || FLOW_COLORS.IDLE;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.07 }}
            className="flex items-center gap-2 px-3 py-2 rounded border"
            style={{ background: c.bg, borderColor: `${c.dot}30` }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                    background: c.dot,
                    boxShadow: status === "ACTIVE" ? `0 0 6px ${c.dot}` : "none",
                }}
            />
            <div>
                <div className="text-xs font-mono font-medium" style={{ color: c.text }}>
                    {label}
                </div>
                <div className="text-xs font-mono text-slate-600">{latency}</div>
            </div>
        </motion.div>
    );
}

export default function IntelStatusBar() {
    const { pipelineStatus, documentStats } = useApp();

    const statItems = [
        { label: "TOTAL CHARS", value: documentStats?.total_chars?.toLocaleString() || "0" },
        { label: "WORD COUNT", value: documentStats?.total_words?.toLocaleString() || "0" },
        { label: "CHUNKS", value: documentStats?.total_chunks || 0 },
        { label: "EMBED DIM", value: documentStats?.embedding_dim || 0 },
    ];

    return (
        <div
            className="px-4 py-3 border-b shrink-0"
            style={{ background: "#080c14", borderColor: "#1a2d4a" }}
        >
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                    {Object.entries(pipelineStatus || {}).map(([key, flow], i) => (
                        <FlowBadge
                            key={key}
                            label={flow.label}
                            status={flow.status}
                            latency={flow.latency}
                            index={i}
                        />
                    ))}
                </div>

                <div className="h-8 w-px mx-2" style={{ background: "#1a2d4a" }} />

                <div className="flex items-center gap-4">
                    {statItems.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-xs font-mono text-slate-500 tracking-wider">{s.label}</div>
                            <div className="text-sm font-mono font-semibold" style={{ color: "#00d4ff" }}>
                                {s.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}