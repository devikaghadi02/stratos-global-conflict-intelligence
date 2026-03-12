export default function PageHeader({ title, description, badge, action }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-8 border-b border-slate-800/50">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
                        {title}
                    </h1>
                    {badge && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 uppercase">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                    {description}
                </p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
