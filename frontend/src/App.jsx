// src/App.jsx
import { AppProvider } from "./context/AppContext";
import TopBar from "./components/layout/TopBar";
import IntelStatusBar from "./components/IntelStatusBar";
import DocumentInputPanel from "./components/DocumentInputPanel";
import EvidencePanel from "./components/EvidencePanel";
import GeopoliticalSignalsPanel from "./components/GeopoliticalSignalsPanel";
import EventFeedPanel from "./components/EventFeedPanel";
import SystemImpactMatrix from "./components/SystemImpactMatrix";
import RiskForecastTimeline from "./components/RiskForecastTimeline";
import NarrativeRealityPanel from "./components/NarrativeRealityPanel";
import AIChatPanel from "./components/AIChatPanel";

function Dashboard() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <IntelStatusBar />

      {/* Main scrollable area */}
      <div className="flex-1 overflow-auto p-4">
        {/* ── Row 1: Input + Evidence + Signals ── */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-3">
            <DocumentInputPanel />
          </div>
          <div className="col-span-5">
            <EvidencePanel />
          </div>
          <div className="col-span-4">
            <GeopoliticalSignalsPanel />
          </div>
        </div>

        {/* ── Row 2: Events + Impact Matrix + Risk Timeline ── */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-3">
            <EventFeedPanel />
          </div>
          <div className="col-span-5">
            <SystemImpactMatrix />
          </div>
          <div className="col-span-4">
            <RiskForecastTimeline />
          </div>
        </div>

        {/* ── Row 3: Narrative + AI Chat ── */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <NarrativeRealityPanel />
          </div>
          <div className="col-span-5">
            <AIChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}