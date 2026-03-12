import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import DocumentAnalysisPage from "./pages/dashboard/DocumentAnalysisPage";
import EventsPage from "./pages/dashboard/EventsPage";
import ImpactPage from "./pages/dashboard/ImpactPage";
import RiskPage from "./pages/dashboard/RiskPage";
import NarrativePage from "./pages/dashboard/NarrativePage";
import AssistantPage from "./pages/dashboard/AssistantPage";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard with nested routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/analysis" replace />} />
            <Route path="analysis" element={<DocumentAnalysisPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="impact" element={<ImpactPage />} />
            <Route path="risk" element={<RiskPage />} />
            <Route path="narrative" element={<NarrativePage />} />
            <Route path="assistant" element={<AssistantPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;