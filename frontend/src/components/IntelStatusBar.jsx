import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const STATUS_CLASSES = {
    ACTIVE: "text-brand-success border-brand-success/20 bg-brand-success/5",
    IDLE: "text-slate-500 border-slate-700 bg-slate-800/20",
    ERROR: "text-brand-critical border-brand-critical/20 bg-brand-critical/5",
};

function FlowBadge({ label, status, latency, index }) {
    const classes = STATUS_CLASSES[status] || STATUS_CLASSES.IDLE;
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-md border ${classes}`}
        >
            <span className={`w-1 h-1 rounded-full ${status === 'ACTIVE' ? 'animate-pulse bg-brand-success' : 'bg-current'}`} />
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    {label}
                </span>
                <span className="text-[9px] font-mono opacity-50 font-medium">
                    {latency}
                </span>
            </div>
        </motion.div>
    );
}

export default function IntelStatusBar() {
    const { pipelineStatus, documentStats } = useApp();

    const statItems = [
        { label: "CHARS", value: documentStats?.total_chars?.toLocaleString() || "0" },
        { label: "WORDS", value: documentStats?.total_words?.toLocaleString() || "0" },
        { label: "CHUNKS", value: documentStats?.total_chunks || 0 },
        { label: "EMBED", value: `${documentStats?.embedding_dim || 1536}D` },
    ];

    return (
        <div className="px-6 py-2 bg-slate-900/30 border-b border-slate-800/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-6">
                {statItems.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-medium tracking-tight">
                            {s.label}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-300">
                            {s.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
