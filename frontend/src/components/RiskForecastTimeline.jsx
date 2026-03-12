// src/components/RiskForecastTimeline.jsx
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useApp } from "../context/useApp";
import PanelCard from "./shared/PanelCard";
import { SeverityBadge, DomainBadge } from "./shared/Badge";

const SEV_COLORS = {
  EXTREME: "#ff4040",
  CRITICAL: "#ef4444",
  HIGH: "#f59e0b",
  ELEVATED: "#fbbf24",
  LOW: "#10b981",
};

function ProbabilityRing({ probability, color }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (probability / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#1a2d4a" strokeWidth="3" />
        <motion.circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <span
        className="absolute text-xs font-mono font-bold"
        style={{ color }}
      >
        {probability}%
      </span>
    </div>
  );
}

export default function RiskForecastTimeline() {
  const { riskForecast } = useApp();

  return (
    <PanelCard
      title="Risk Forecast Timeline"
      icon={<TrendingUp size={13} />}
      accentColor="#ef4444"
    >
      {/* Timeline */}
      <div className="relative px-4 py-4">
        {/* Vertical line */}
        <div
          className="absolute left-8 top-4 bottom-4 w-px"
          style={{ background: "linear-gradient(to bottom, #ef444440, #1a2d4a)" }}
        />

        <div className="flex flex-col gap-3">
          {(riskForecast?.risks || []).map((item, i) => {
            const color = SEV_COLORS[item.severity] || "#64748b";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 pl-8"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{
                    background: `${color}20`,
                    borderColor: color,
                    boxShadow: `0 0 8px ${color}40`,
                    left: "24px",
                    marginTop: "14px",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded p-3 ml-3"
                  style={{ background: "#111d30", border: `1px solid ${color}20` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-medium text-slate-200 leading-tight mb-1">
                        {item.scenario}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-mono"
                          style={{ color: "#64748b" }}
                        >
                          {item.date} · {item.timeframe}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <SeverityBadge level={item.severity} />
                      <ProbabilityRing probability={item.probability} color={color} />
                    </div>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {item.systems.map((s) => (
                      <DomainBadge key={s} domain={s.toUpperCase()} />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PanelCard>
  );
}