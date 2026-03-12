// src/components/AIChatPanel.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { useApp } from "../context/useApp";
import PanelCard from "./shared/PanelCard";
import { LoadingSpinner } from "./shared/Badge";

const QUICK_QUESTIONS = [
    "How does this affect oil supply?",
    "Are shipping routes disrupted?",
    "What's the economic outlook?",
    "Analyze narrative accuracy",
];

function ChatMessage({ msg }) {
    const isUser = msg.role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}
        >
            <div
                className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5"
                style={{
                    background: isUser ? "#0077ff20" : "#00d4ff15",
                    border: `1px solid ${isUser ? "#0077ff40" : "#00d4ff30"}`,
                }}
            >
                {isUser ? (
                    <User size={11} style={{ color: "#0077ff" }} />
                ) : (
                    <Bot size={11} style={{ color: "#00d4ff" }} />
                )}
            </div>
            <div
                className={`flex-1 rounded p-3 text-xs leading-relaxed ${isUser ? "text-right" : ""}`}
                style={{
                    background: isUser ? "#0077ff15" : "#111d30",
                    border: `1px solid ${isUser ? "#0077ff25" : "#1a2d4a"}`,
                    color: isUser ? "#93c5fd" : "#cbd5e1",
                    maxWidth: "85%",
                    marginLeft: isUser ? "auto" : "0",
                    marginRight: isUser ? "0" : "auto",
                }}
            >
                {msg.content}
                <div className="text-xs font-mono mt-1.5" style={{ color: "#334155" }}>
                    {msg.timestamp}
                </div>
            </div>
        </motion.div>
    );
}

function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2"
        >
            <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ background: "#00d4ff15", border: "1px solid #00d4ff30" }}
            >
                <Bot size={11} style={{ color: "#00d4ff" }} />
            </div>
            <div
                className="px-3 py-2.5 rounded flex items-center gap-1.5"
                style={{ background: "#111d30", border: "1px solid #1a2d4a" }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#00d4ff" }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export default function AIChatPanel() {
    const { chatHistory, isChatLoading, sendChatMessage } = useApp();
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isChatLoading]);

    const handleSend = () => {
        const msg = input.trim();
        if (!msg || isChatLoading) return;
        setInput("");
        sendChatMessage(msg);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <PanelCard
            title="AI Intelligence Assistant"
            icon={<Sparkles size={13} />}
            accentColor="#00d4ff"
            badge="STRATOS-AI"
        >
            <div className="px-3 pt-3 flex flex-wrap gap-1.5 border-b pb-3" style={{ borderColor: "#1a2d4a" }}>
                {QUICK_QUESTIONS.map((q) => (
                    <button
                        key={q}
                        onClick={() => sendChatMessage(q)}
                        disabled={isChatLoading}
                        className="text-xs font-mono px-2.5 py-1 rounded transition-colors disabled:opacity-40"
                        style={{ background: "#00d4ff10", border: "1px solid #00d4ff25", color: "#64748b" }}
                        onMouseEnter={(e) => { e.target.style.color = "#00d4ff"; e.target.style.borderColor = "#00d4ff50"; }}
                        onMouseLeave={(e) => { e.target.style.color = "#64748b"; e.target.style.borderColor = "#00d4ff25"; }}
                    >
                        {q}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3 p-3 overflow-y-auto" style={{ height: 280 }}>
                {chatHistory.map((msg, i) => (
                    <ChatMessage key={i} msg={msg} />
                ))}
                <AnimatePresence>{isChatLoading && <TypingIndicator />}</AnimatePresence>
                <div ref={bottomRef} />
            </div>

            <div className="px-3 py-3 border-t flex gap-2" style={{ borderColor: "#1a2d4a" }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about conflict impacts, signals, forecasts..."
                    disabled={isChatLoading}
                    className="flex-1 text-xs font-mono px-3 py-2 rounded outline-none transition-colors disabled:opacity-50"
                    style={{ background: "#080c14", border: "1px solid #1a2d4a", color: "#e2e8f0" }}
                    onFocus={(e) => (e.target.style.borderColor = "#00d4ff50")}
                    onBlur={(e) => (e.target.style.borderColor = "#1a2d4a")}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isChatLoading}
                    className="w-8 h-8 rounded flex items-center justify-center transition-all disabled:opacity-40 shrink-0"
                    style={{ background: "linear-gradient(135deg, #0077ff, #00d4ff40)", border: "1px solid #00d4ff40" }}
                >
                    {isChatLoading ? (
                        <LoadingSpinner size={12} color="#00d4ff" />
                    ) : (
                        <Send size={13} style={{ color: "#00d4ff" }} />
                    )}
                </motion.button>
            </div>
        </PanelCard>
    );
}