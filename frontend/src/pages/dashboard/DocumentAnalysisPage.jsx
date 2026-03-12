import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/useApp";
import { Zap, FileSearch, AlertCircle, Loader2 } from "lucide-react";

export default function DocumentAnalysisPage() {
    const {
        documentText, setDocumentText,
        queryText, setQueryText,
        isAnalyzing, analysisError,
        analyzeDocument,
        evidenceChunks
    } = useApp();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-5xl"
        >
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-[48px] font-[800] text-white leading-tight">Document Analysis</h1>
                <p className="text-[16px] text-[var(--color-text-secondary)] mt-1">
                    Paste a geopolitical document to extract intelligence signals and evidence.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column: Input */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
                        <div className="mb-6">
                            <label className="block text-[14px] font-[500] text-[var(--color-text-secondary)] mb-2">Analysis Query</label>
                            <input
                                type="text"
                                value={queryText}
                                onChange={(e) => setQueryText(e.target.value)}
                                className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[15px] text-white outline-none focus:border-[var(--color-cyan-brand)]/40 transition-all"
                                placeholder="e.g. energy supply impact"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[14px] font-[500] text-[var(--color-text-secondary)]">Document</label>
                                <button
                                    onClick={() => setDocumentText("Sample Document: Recent satellite imagery indicates significant troop movements along the northern corridor...")}
                                    className="text-[13px] text-[var(--color-cyan-brand)] hover:underline"
                                >
                                    load sample →
                                </button>
                            </div>
                            <textarea
                                value={documentText}
                                onChange={(e) => setDocumentText(e.target.value)}
                                className="w-full min-h-[220px] bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl p-4 text-[15px] text-white outline-none focus:border-[var(--color-cyan-brand)]/40 transition-all resize-y leading-relaxed"
                                placeholder="Paste a news article, intelligence briefing, or geopolitical report here..."
                            />
                        </div>

                        <button
                            onClick={analyzeDocument}
                            disabled={isAnalyzing || !documentText.trim()}
                            className="w-full bg-[var(--color-cyan-brand)] text-[#0f1117] py-3.5 rounded-xl text-[16px] font-[600] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-[18px] h-[18px]" />
                                    Analyze Document
                                </>
                            )}
                        </button>

                        {analysisError && (
                            <div className="bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.2)] rounded-xl px-4 py-3 mt-4 flex items-center gap-2 text-[14px] text-[var(--color-amber-brand)]">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {analysisError}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-[20px] font-[600]">Evidence Chunks</h3>
                            <span className="bg-[rgba(34,211,238,0.08)] text-[var(--color-cyan-brand)] px-3 py-1 rounded-full text-[13px] font-mono font-[500]">
                                {evidenceChunks.length}
                            </span>
                        </div>

                        {evidenceChunks.map((chunk, i) => {
                            const scorePercent = Math.round(chunk.score * 100);
                            const relevance = chunk.relevance || "MEDIUM";

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 hover:border-[rgba(34,211,238,0.2)] transition-all group"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-[700] uppercase tracking-wider ${scorePercent > 85 ? 'bg-red-500/10 text-red-400' :
                                                    scorePercent > 70 ? 'bg-amber-500/10 text-amber-400' :
                                                        'bg-cyan-500/10 text-cyan-400'
                                                }`}>
                                                RELEVANCE: {relevance}
                                            </span>
                                            <span className="text-[13px] text-[var(--color-text-muted)] font-mono">
                                                CHUNK #{chunk.chunk_id !== undefined ? chunk.chunk_id : i + 1}
                                            </span>
                                        </div>
                                        <span className="text-[12px] font-mono text-[var(--color-text-muted)]">
                                            {chunk.word_count}w
                                        </span>
                                    </div>

                                    <p className="text-[16px] text-white leading-relaxed mb-6">
                                        {chunk.text}
                                    </p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border)]">
                                        <span className="text-[13px] text-[var(--color-text-muted)] font-[500]">Score</span>
                                        <div className="flex-1 h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${scorePercent > 85 ? 'bg-[var(--color-red-brand)]' :
                                                        scorePercent > 70 ? 'bg-[var(--color-amber-brand)]' :
                                                            'bg-[var(--color-cyan-brand)]'
                                                    }`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${scorePercent}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                            />
                                        </div>
                                        <span className="text-[14px] font-mono font-[500] text-[var(--color-text-secondary)]">
                                            {scorePercent}%
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
