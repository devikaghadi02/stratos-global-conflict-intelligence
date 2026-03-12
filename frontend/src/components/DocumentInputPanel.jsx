// src/components/DocumentInputPanel.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Zap, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import PanelCard from "./shared/PanelCard";
import { LoadingSpinner } from "./shared/Badge";

const SAMPLE_TEXT = `Russian forces have intensified shelling along the eastern front, targeting key pipeline infrastructure near Kharkiv. Ukrainian officials report significant damage to gas transit facilities that supply central Europe.

European energy futures rose 8.3% following reports of disruptions to the Nord Stream auxiliary corridor. Germany's energy ministry convened an emergency session to assess reserve capacity.

The Strait of Hormuz shipping lanes have seen a 34% reduction in tanker traffic over the past 72 hours as regional tensions escalate. Lloyd's of London has upgraded the risk classification for the Persian Gulf.

Beijing reiterated its neutrality stance while simultaneously increasing LNG purchases from Qatar at a 12% premium. Trade analysts see this as strategic stockpiling ahead of anticipated supply disruptions.

US Treasury Department announced targeted sanctions on three Russian state energy entities. Markets responded with Brent crude climbing to $97.40 per barrel in early trading.`;

export default function DocumentInputPanel() {
    const { documentText, setDocumentText, queryText, setQueryText, isAnalyzing, analysisError, analyzeDocument } = useApp();
    const [expanded, setExpanded] = useState(true);

    return (
        <PanelCard
            title="Document Input"
            icon={<FileText size={13} />}
            accentColor="#0077ff"
            actions={
                <button onClick={() => setExpanded((v) => !v)} className="text-slate-500 hover:text-slate-300 transition-colors">
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            }
        >
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 flex flex-col gap-3">
                            {/* Query input */}
                            <div>
                                <label className="text-xs font-mono text-slate-500 tracking-wider mb-1 block">ANALYSIS QUERY</label>
                                <input
                                    type="text"
                                    value={queryText}
                                    onChange={(e) => setQueryText(e.target.value)}
                                    placeholder="energy impact"
                                    className="w-full text-xs font-mono px-3 py-2 rounded border outline-none transition-colors"
                                    style={{
                                        background: "#080c14",
                                        borderColor: "#1a2d4a",
                                        color: "#00d4ff",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#0077ff")}
                                    onBlur={(e) => (e.target.style.borderColor = "#1a2d4a")}
                                />
                            </div>

                            {/* Text area */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-mono text-slate-500 tracking-wider">GEOPOLITICAL DOCUMENT</label>
                                    <button
                                        onClick={() => setDocumentText(SAMPLE_TEXT)}
                                        className="text-xs font-mono text-slate-600 hover:text-cyan-400 transition-colors"
                                    >
                                        load sample
                                    </button>
                                </div>
                                <textarea
                                    value={documentText}
                                    onChange={(e) => setDocumentText(e.target.value)}
                                    placeholder="Paste geopolitical news article or intelligence report here..."
                                    rows={7}
                                    className="w-full text-xs font-mono px-3 py-2 rounded border outline-none resize-none transition-colors leading-relaxed"
                                    style={{
                                        background: "#080c14",
                                        borderColor: "#1a2d4a",
                                        color: "#e2e8f0",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#0077ff")}
                                    onBlur={(e) => (e.target.style.borderColor = "#1a2d4a")}
                                />
                                <div className="flex justify-end mt-1">
                                    <span className="text-xs font-mono text-slate-600">
                                        {documentText.split(/\s+/).filter(Boolean).length} words
                                    </span>
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {analysisError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-start gap-2 px-3 py-2 rounded border text-xs font-mono"
                                        style={{ background: "#ef444415", borderColor: "#ef444440", color: "#ef4444" }}
                                    >
                                        <AlertCircle size={12} className="mt-0.5 shrink-0" />
                                        <span>{analysisError} — displaying mock data.</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Analyze button */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={analyzeDocument}
                                disabled={isAnalyzing || !documentText.trim()}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded font-mono text-sm font-semibold tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    background: isAnalyzing ? "#0077ff30" : "linear-gradient(90deg, #0077ff, #00d4ff40)",
                                    border: "1px solid #0077ff60",
                                    color: "#00d4ff",
                                }}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <LoadingSpinner size={14} color="#00d4ff" />
                                        ANALYZING...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={14} />
                                        ANALYZE DOCUMENT
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PanelCard>
    );
}