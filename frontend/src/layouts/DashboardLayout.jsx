import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Shield, FileText, Activity, BarChart2, TrendingUp, Eye, Bot, Plus } from "lucide-react";

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const getPageTitle = (path) => {
        if (path.includes("analysis")) return "Document Analysis";
        if (path.includes("events")) return "Event Feed";
        if (path.includes("impact")) return "Impact Analysis";
        if (path.includes("risk")) return "Risk Forecast";
        if (path.includes("narrative")) return "Narrative Analysis";
        if (path.includes("assistant")) return "AI Assistant";
        return "Dashboard";
    };

    const navItems = [
        { label: "Document Analysis", icon: FileText, path: "/dashboard/analysis" },
        { label: "Event Feed", icon: Activity, path: "/dashboard/events" },
        { label: "Impact Analysis", icon: BarChart2, path: "/dashboard/impact" },
        { label: "Risk Forecast", icon: TrendingUp, path: "/dashboard/risk" },
        { label: "Narrative Analysis", icon: Eye, path: "/dashboard/narrative" },
        { label: "AI Assistant", icon: Bot, path: "/dashboard/assistant" },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] text-white">
            {/* Sidebar */}
            <aside className="w-[240px] flex-shrink-0 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
                {/* Top Section */}
                <div className="px-6 py-6 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-[var(--color-cyan-brand)]" />
                        <span className="font-heading font-[700] text-[20px] tracking-tight">STRATOS</span>
                    </div>
                    <p className="text-[12px] font-[500] text-[var(--color-text-muted)] mt-0.5 tracking-wide uppercase">
                        Conflict Intelligence
                    </p>
                </div>

                {/* Nav Section */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <div className="text-[11px] text-[var(--color-text-muted)] font-[600] tracking-[0.1em] px-3 mb-3">
                        NAVIGATION
                    </div>
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-150
                  font-heading text-[14px] font-[500]
                  ${isActive
                                        ? "bg-[rgba(34,211,238,0.08)] text-[var(--color-cyan-brand)] border-l-2 border-[var(--color-cyan-brand)] rounded-l-none pl-2.5"
                                        : "text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"}
                `}
                            >
                                <item.icon className="w-[17px] h-[17px]" />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="px-4 py-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#34d399] rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                        <span className="text-[13px] font-[500] text-[var(--color-text-secondary)]">Pipeline Active</span>
                    </div>
                    <div className="mt-1 text-[12px] text-[var(--color-text-muted)] pl-4">6 feeds connected</div>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[var(--color-bg)]">
                {/* Top Bar */}
                <header className="h-[64px] border-b border-[var(--color-border)] px-8 flex items-center justify-between flex-shrink-0 bg-[rgba(15,17,23,0.8)] backdrop-blur-md z-10">
                    <h2 className="font-heading font-[600] text-[18px] text-white">
                        {getPageTitle(location.pathname)}
                    </h2>
                    <button
                        onClick={() => navigate("/dashboard/analysis")}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-[rgba(34,211,238,0.3)] text-[var(--color-cyan-brand)] hover:bg-[rgba(34,211,238,0.05)] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Analysis
                    </button>
                </header>

                {/* Content Area */}
                <section className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <div className="max-w-[1100px] mx-auto w-full h-full">
                        <Outlet />
                    </div>
                </section>
            </main>
        </div>
    );
}
