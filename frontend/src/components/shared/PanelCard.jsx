// src/components/shared/PanelCard.jsx
import { motion } from "framer-motion";

export default function PanelCard({ title, icon, children, className = "", accentColor = "#00d4ff", badge, actions }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`panel-hover rounded-lg border flex flex-col overflow-hidden ${className}`}
            style={{
                background: "#0d1525",
                borderColor: "#1a2d4a",
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b shrink-0"
                style={{
                    borderColor: "#1a2d4a",
                    background: `linear-gradient(90deg, ${accentColor}08 0%, transparent 100%)`,
                }}
            >
                <div className="flex items-center gap-2">
                    {icon && (
                        <span style={{ color: accentColor }} className="text-sm">
                            {icon}
                        </span>
                    )}
                    <span
                        className="text-xs font-mono font-semibold tracking-widest uppercase"
                        style={{ color: accentColor }}
                    >
                        {title}
                    </span>
                    {badge && (
                        <span
                            className="text-xs font-mono px-1.5 py-0.5 rounded"
                            style={{ background: `${accentColor}20`, color: accentColor }}
                        >
                            {badge}
                        </span>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto">{children}</div>
        </motion.div>
    );
}