import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function Card({ children, className, hover = true }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={twMerge(
                "saas-card relative overflow-hidden",
                hover ? "cursor-default" : "",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

export function CardHeader({ title, subtitle, icon: Icon, action }) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
                {Icon && (
                    <div className="p-2.5 bg-slate-800/50 rounded-lg border border-slate-800 text-brand-cyan">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-heading font-semibold text-white tracking-tight">{title}</h3>
                    {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
