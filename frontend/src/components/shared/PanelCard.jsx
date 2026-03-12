// src/components/shared/PanelCard.jsx
import { motion } from "framer-motion";

export default function PanelCard({ title, icon, children, className = "", accentColor, badge, actions }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`glass-panel rounded-xl flex flex-col overflow-hidden group transition-all duration-300 hover:border-slate-700 ${className}`}
        >
            {/* Header */}
            <div className="panel-header-gradient flex items-center justify-between px-4 py-2.5 border-b border-slate-800/50 shrink-0">
                <div className="flex items-center gap-2">
                    {icon && (
                        <span className="text-slate-400 group-hover:text-brand-secondary transition-colors duration-300">
                            {icon}
                        </span>
                    )}
                    <span className="text-[11px] font-heading font-semibold tracking-[0.15em] uppercase text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
                        {title}
                    </span>
                    {badge && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                            {badge}
                        </span>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </motion.div>
    );
}
