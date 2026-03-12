import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/useApp";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AssistantPage() {
    const { chatHistory, isChatLoading, sendChatMessage } = useApp();
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isChatLoading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isChatLoading) return;
        sendChatMessage(input);
        setInput("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl h-[calc(100vh-160px)] flex flex-col"
        >
            {/* Page Header */}
            <div className="mb-8 flex-shrink-0">
                <h1 className="text-[48px] font-[800] text-white leading-tight">AI Assistant</h1>
                <p className="text-[16px] text-[var(--color-text-secondary)] mt-1">
                    Query the intelligence core with natural language to find connections.
                </p>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                {/* Messages area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
                >
                    {chatHistory?.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <div className="p-4 bg-[var(--color-surface-2)] rounded-2xl border border-[var(--color-border)] mb-4">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <p className="text-[16px] font-[600]">How can I assist your investigation today?</p>
                            <p className="text-[14px] mt-1 max-w-xs uppercase tracking-widest font-mono">Standby for operator input</p>
                        </div>
                    ) : (
                        chatHistory?.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border shadow-sm ${msg.role === 'user'
                                        ? 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-white'
                                        : 'bg-[rgba(34,211,238,0.08)] border-[rgba(34,211,238,0.2)] text-[var(--color-cyan-brand)]'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>

                                {/* Bubble */}
                                <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : ''}`}>
                                    <div className={`p-5 rounded-2xl text-[16px] leading-relaxed ${msg.role === 'user'
                                            ? 'bg-[var(--color-surface-2)] text-white border border-[var(--color-border)] rounded-tr-none'
                                            : 'bg-[var(--color-bg)] text-[#cbd5e1] border border-[var(--color-border)] rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[11px] font-mono text-[var(--color-text-muted)] mt-2 uppercase tracking-widest font-bold">
                                        {msg.timestamp} · {msg.role}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}

                    {isChatLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-6"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.2)] text-[var(--color-cyan-brand)] flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                            <div className="bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-2xl rounded-tl-none p-5 flex gap-1">
                                <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input area */}
                <div className="p-6 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
                    <form onSubmit={handleSubmit} className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about conflict vectors, energy impacts, or narrative shifts..."
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-5 pl-7 pr-16 text-[16px] text-white outline-none focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/5 transition-all shadow-lg"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isChatLoading}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-[var(--color-cyan-brand)] text-[#0f1117] hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center text-[12px] text-[var(--color-text-muted)] mt-4 uppercase tracking-[0.2em] font-bold">
                        STRATOS Intelligence Node · AES-256 Encrypted Session
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
