import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowRight, ChevronDown, FileText, Activity, BarChart2, TrendingUp, Eye, Bot } from "lucide-react";

export default function LandingPage() {
    const features = [
        { title: "Document Analysis", desc: "Extract evidence chunks with relevance scoring from raw documents.", icon: FileText },
        { title: "Event Detection", desc: "Identify geopolitical events and track dominant narratives in real time.", icon: Activity },
        { title: "Impact Mapping", desc: "Visualize severity across energy, trade, logistics, and economic systems.", icon: BarChart2 },
        { title: "Risk Forecasting", desc: "Predict disruption scenarios with probability and timeframe estimates.", icon: TrendingUp },
        { title: "Narrative Analysis", desc: "Compare public narratives against verified intelligence signals.", icon: Eye },
        { title: "AI Assistant", desc: "Ask natural language questions about the analyzed conflict.", icon: Bot },
    ];

    const steps = [
        { id: "01", icon: FileText, title: "Paste Your Document", desc: "Drop in any news article, intelligence report, or geopolitical briefing." },
        { id: "02", icon: Shield, title: "Extract Intelligence", desc: "AI identifies events, signals, narratives, and affected systems automatically." },
        { id: "03", icon: BarChart2, title: "Explore the Impact", desc: "Navigate detailed analysis across energy, trade, logistics, and economic systems." },
    ];

    return (
        <div className="bg-[#0f1117] font-['Plus_Jakarta_Sans'] text-white overflow-x-hidden">
            <style>
                {`
                    @keyframes pulse-dot {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.5); opacity: 0.4; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-pulse-dot {
                        animation: pulse-dot 2s infinite;
                    }
                `}
            </style>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-[rgba(15,17,23,0.9)] backdrop-blur-xl border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-[22px] h-[22px] text-[var(--color-cyan-brand)]" />
                        <span className="font-[700] text-[20px]">STRATOS</span>
                        <div className="w-[1px] h-4 bg-[var(--color-border)] mx-1"></div>
                        <span className="text-[14px] text-[var(--color-text-secondary)]">Intelligence Platform</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            to="/dashboard"
                            className="px-5 py-2 bg-transparent border border-cyan-400/30 text-cyan-400 rounded-lg text-sm font-[500] hover:bg-cyan-900/10 transition-all"
                        >
                            Open Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-[64px] overflow-hidden">
                <div className="max-w-[1200px] mx-auto w-full px-[32px] flex flex-col md:flex-row items-center gap-[64px] relative z-10">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col justify-center pr-0 md:pr-4 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-[rgba(34,211,238,0.08)] border border-cyan-400/20 rounded-full px-4 py-1.5 text-cyan-400 text-[13px] font-[600] mb-8 w-fit mx-auto md:mx-0"
                        >
                            Geopolitical Intelligence · Powered by AI
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-[48px] md:text-[56px] font-[800] leading-[1.1] mb-6"
                        >
                            When Conflict Spreads,<br />
                            Data Tells the <span style={{ color: '#22d3ee' }}>Truth.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-[18px] text-[var(--color-text-secondary)] leading-[1.7] max-w-md mx-auto md:mx-0 mb-8"
                        >
                            STRATOS maps how geopolitical events ripple through energy systems, trade routes, and economic stability. Not speculation. Verified signals.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start"
                        >
                            <Link
                                to="/dashboard"
                                className="bg-[var(--color-cyan-brand)] text-[#0f1117] px-8 py-4 rounded-xl font-[600] text-[16px] flex items-center justify-center gap-2 hover:brightness-110 transition-all hover:scale-[1.02]"
                            >
                                Launch Dashboard <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="#features"
                                className="border border-[var(--color-border)] text-[var(--color-text-secondary)] px-8 py-4 rounded-xl text-[16px] flex items-center justify-center gap-2 hover:border-cyan-400/30 hover:text-white transition-all"
                            >
                                How It Works <ChevronDown className="w-5 h-5" />
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="flex flex-wrap gap-4 justify-center md:justify-start"
                        >
                            {["6 Intelligence Modules", "Real-time Signal Analysis", "AI-Powered Insights"].map((pill, i) => (
                                <div key={i} className="bg-[rgba(255,255,255,0.04)] border border-[var(--color-border)] rounded-full px-4 py-2 text-[13px] text-[var(--color-text-secondary)]">
                                    {pill}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Column: Live Dashboard Preview Mockup */}
                    <div className="flex-1 flex items-center justify-center relative mt-16 md:mt-0">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.1)_0%,_transparent_70%)] pointer-events-none z-0"></div>

                        <div className="relative w-full max-w-[440px] z-10 py-10">
                            {/* Floating Badge (Moved slightly down to avoid navbar overlap) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="absolute -top-4 right-0 bg-[#0f1117] border border-[rgba(34,211,238,0.3)] rounded-xl px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-2 z-20 backdrop-blur-md"
                            >
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                                <span className="text-[13px] text-white/90 font-[600] tracking-wide">6 signals active</span>
                            </motion.div>

                            {/* Card 1: System Impact */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.7 }}
                                className="bg-[#1a1f2e]/90 border border-[#2a3347] rounded-2xl p-5 mb-4 shadow-2xl backdrop-blur-sm"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-[600] tracking-[0.15em] text-white/40 font-mono uppercase">System Impact</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                        <span className="text-[12px] text-green-400 font-[700] uppercase tracking-wider">Live</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[#0f1117] rounded-xl p-3 text-center border border-white/5">
                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-[600]">Energy</span>
                                        <div className="text-[28px] font-[700] text-red-400 font-mono mt-1">88</div>
                                        <div className="text-[9px] font-[800] text-red-400 mt-1 uppercase tracking-widest">Critical</div>
                                    </div>
                                    <div className="bg-[#0f1117] rounded-xl p-3 text-center border border-white/5">
                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-[600]">Trade</span>
                                        <div className="text-[28px] font-[700] text-amber-400 font-mono mt-1">72</div>
                                        <div className="text-[9px] font-[800] text-amber-400 mt-1 uppercase tracking-widest">High</div>
                                    </div>
                                    <div className="bg-[#0f1117] rounded-xl p-3 text-center border border-white/5">
                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-[600]">Logistics</span>
                                        <div className="text-[28px] font-[700] text-amber-400 font-mono mt-1">81</div>
                                        <div className="text-[9px] font-[800] text-amber-400 mt-1 uppercase tracking-widest">High</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 2: Critical Event */}
                            <motion.div
                                initial={{ opacity: 0, x: 25 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.7 }}
                                className="bg-[#1a1f2e]/95 border border-[#2a3347] rounded-2xl p-5 mb-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ml-8 relative z-11 backdrop-blur-md"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse-dot"></div>
                                        <span className="text-[11px] font-[600] font-mono tracking-[0.2em] text-red-400">CRITICAL EVENT</span>
                                    </div>
                                    <span className="text-[12px] text-white/40 font-[500]">4h ago</span>
                                </div>
                                <h3 className="text-[16px] font-[700] text-white leading-tight">
                                    Pipeline Attack — Eastern Ukraine
                                </h3>
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1 text-[10px] font-mono font-[700] tracking-wider uppercase">Conflict</span>
                                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 text-[10px] font-mono font-[700] tracking-wider uppercase">Energy</span>
                                    <span className="bg-white/10 text-white/70 rounded-full px-3 py-1 text-[10px] font-[700] tracking-wide uppercase">Eastern Europe</span>
                                </div>
                            </motion.div>

                            {/* Card 3: Risk Forecast */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.7 }}
                                className="bg-[#1a1f2e]/90 border border-[#2a3347] rounded-2xl p-5 shadow-2xl mr-6 backdrop-blur-sm"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-[600] font-mono tracking-[0.15em] text-white/40 uppercase">Risk Forecast</span>
                                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2.5 py-0.5 text-[10px] font-[800] tracking-widest">CRITICAL</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[38px] font-[800] text-red-400 leading-none">78%</span>
                                        <span className="text-[10px] text-white/30 mt-2 uppercase tracking-[0.2em] font-[700]">Probability</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[15px] font-[700] text-white leading-snug">Energy Price Spike &gt;$110/bbl</h4>
                                        <p className="text-[12px] text-white/40 mt-1 font-[500]">24–48h · Global Corridor</p>

                                        <div className="w-full h-[6px] bg-[#0f1117] rounded-full mt-3 overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "78%" }}
                                                transition={{ duration: 1.2, delay: 1 }}
                                                className="h-full bg-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                    <ChevronDown className="w-6 h-6 text-white/20" />
                </div>
            </section>

            {/* How It Works Section */}
            <section id="features" className="py-[120px] bg-[#0f1117]">
                <div className="max-w-[1100px] mx-auto px-8">
                    <div className="text-center mb-16">
                        <span className="text-[12px] font-[600] text-cyan-400 tracking-[0.15em] uppercase">How It Works</span>
                        <h2 className="text-[40px] font-[700] mt-2">Intelligence in three steps</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 relative group hover:border-cyan-400/20 transition-all"
                            >
                                <div className="absolute top-4 right-6 text-[80px] font-[800] text-white/5 pointer-events-none">{step.id}</div>
                                <div className="w-[48px] h-[48px] bg-[rgba(34,211,238,0.08)] rounded-full flex items-center justify-center text-[var(--color-cyan-brand)] mb-6">
                                    <step.icon className="w-[22px] h-[22px]" />
                                </div>
                                <h3 className="text-[20px] font-[600] mb-3">{step.title}</h3>
                                <p className="text-[16px] text-[var(--color-text-secondary)] leading-[1.7]">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-[120px] bg-gradient-to-b from-[#0f1117] to-[#131825]">
                <div className="max-w-[1100px] mx-auto px-8">
                    <div className="text-center mb-16">
                        <span className="text-[12px] font-[600] text-cyan-400 tracking-[0.15em] uppercase">What You Get</span>
                        <h2 className="text-[40px] font-[700] mt-2">Six intelligence modules</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7 hover:border-cyan-400/25 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.1)] transition-all cursor-default"
                            >
                                <div className="w-[44px] h-[44px] bg-[rgba(34,211,238,0.08)] rounded-full flex items-center justify-center text-[var(--color-cyan-brand)] mb-4">
                                    <feature.icon className="w-[20px] h-[20px]" />
                                </div>
                                <h3 className="text-[18px] font-[600] mb-2">{feature.title}</h3>
                                <p className="text-[15px] text-[var(--color-text-secondary)] leading-[1.6]">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-[100px] bg-[var(--color-surface)] border-y border-[var(--color-border)] text-center px-8">
                <h2 className="text-[42px] font-[800] mb-4">Start analyzing a conflict now.</h2>
                <p className="text-[17px] text-[var(--color-text-secondary)] mb-10">Free to use. No setup required.</p>
                <Link
                    to="/dashboard"
                    className="bg-[var(--color-cyan-brand)] text-[#0f1117] px-8 py-4 rounded-xl font-[600] text-[16px] inline-flex items-center gap-2 hover:brightness-110 transition-all hover:scale-[1.02]"
                >
                    Launch Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-[var(--color-border)] px-8 text-center bg-[#0f1117]">
                <p className="text-[14px] text-[var(--color-text-muted)] mb-2">
                    STRATOS — Built for AUGENBLICK Hackathon 2026
                </p>
                <p className="text-[12px] text-[var(--color-text-muted)] opacity-60">
                    Global Conflict Impact Intelligence Platform
                </p>
            </footer>
        </div>
    );
}
