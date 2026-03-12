// src/components/layout/TopBar.jsx
import { motion } from "framer-motion";
import { Shield, Wifi, Clock, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/useApp";

function LiveDot({ active = true }) {
    if (!active) return <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />;
    return (
        <span className="relative inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-400 animate-ping opacity-60" />
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
            className="flex items-center justify-between px-6 py-3 border-b shrink-0 relative z-10"
            style={{
                background: "linear-gradient(90deg, #080c14 0%, #0d1525 50%, #080c14 100%)",
                borderColor: "#1a2d4a",
            }}
        >
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Shield size={18} style={{ color: "#00d4ff" }} />
                    <span
                        className="font-display text-2xl tracking-widest"
                        style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.5)" }}
                    >
                        STRATOS
                    </span>
                </div>
                <div className="h-5 w-px" style={{ background: "#1a2d4a" }} />
                <span className="text-xs font-mono text-slate-500 tracking-wider">
                    GLOBAL CONFLICT INTELLIGENCE PLATFORM
                </span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <LiveDot />
                    <span className="text-xs font-mono text-green-400">PIPELINE ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wifi size={12} style={{ color: "#06b6d4" }} />
                    <span className="text-xs font-mono text-slate-400">FEEDS: 6/6</span>
                </div>
                <div
                    className="flex items-center gap-2 px-3 py-1 rounded"
                    style={{ background: "#ef444415", border: "1px solid #ef444430" }}
                >
                    <AlertTriangle size={12} style={{ color: "#ef4444" }} />
                    <span className="text-xs font-mono" style={{ color: "#ef4444" }}>
                        THREAT LEVEL: HIGH
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>DOCS: {documentStats?.total_words?.toLocaleString() || "847"} WORDS</span>
                <span>CHUNKS: {documentStats?.total_chunks || 7}</span>
                <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span className="text-slate-400">{now} UTC</span>
                </div>
            </div>
        </motion.header>
    );
}