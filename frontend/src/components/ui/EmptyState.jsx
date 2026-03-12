import { LucideIcon } from "lucide-react";

export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center saas-card bg-slate-900/40 border-dashed">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 mb-6">
                {Icon && <Icon className="w-10 h-10 text-slate-500" />}
            </div>
            <h3 className="text-xl font-heading font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm mb-8">
                {description}
            </p>
            {action && action}
        </div>
    );
}
