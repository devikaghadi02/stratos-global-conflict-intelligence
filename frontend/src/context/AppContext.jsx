import { createContext, useState, useCallback, useContext } from "react"; // Added useContext
import {
    mockDocumentStats,
    mockEvidenceChunks,
    mockGeopoliticalSignals,
    mockEvents,
    mockSystemImpact,
    mockRiskForecast,
    mockNarratives,
    mockChatHistory,
    mockPipelineStatus,
} from "../data/mockData";
import { ingestDocument } from "../api/ingestService";

export const AppContext = createContext(null);

// Custom hook to use the AppContext
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};

export function AppProvider({ children }) {
    const [pipelineStatus] = useState(mockPipelineStatus);

    const [documentText, setDocumentText] = useState("");
    const [queryText, setQueryText] = useState("energy impact");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);

    const [documentStats, setDocumentStats] = useState(mockDocumentStats);
    const [evidenceChunks, setEvidenceChunks] = useState(mockEvidenceChunks);
    const [geopoliticalSignals, setGeopoliticalSignals] = useState(mockGeopoliticalSignals);
    const [events, setEvents] = useState(mockEvents);
    const [systemImpact, setSystemImpact] = useState(mockSystemImpact);
    const [riskForecast, setRiskForecast] = useState(mockRiskForecast);
    const [narratives, setNarratives] = useState(mockNarratives);

    const [chatHistory, setChatHistory] = useState(mockChatHistory);
    const [isChatLoading, setIsChatLoading] = useState(false);

    const analyzeDocument = useCallback(async () => {
        if (!documentText.trim()) return;
        setIsAnalyzing(true);
        setAnalysisError(null);
        try {
            const data = await ingestDocument(documentText, queryText);

            /*
            FLOW 1 — INGESTION
            */
            if (data.ingestion) {
                setDocumentStats(data.ingestion.document_stats || {});
                setEvidenceChunks(data.ingestion.evidence_chunks || []);
                setGeopoliticalSignals(data.ingestion.geopolitical_signals || []);
            }

            /*
            FLOW 2 — EVENTS
            */
            if (data.intelligence?.events) {
                // Map backend event fields to frontend if necessary
                const mappedEvents = data.intelligence.events.map(event => ({
                    ...event,
                    id: event.id || Math.random().toString(36).substr(2, 9),
                    timestamp: event.timestamp || new Date().toISOString(),
                }));
                setEvents(mappedEvents);
            }

            /*
            FLOW 3 — IMPACT
            */
            if (data.impact?.impacts) {
                const SEVERITY_SCORES = { CRITICAL: 90, HIGH: 75, MEDIUM: 50, LOW: 25, NONE: 10 };
                
                const mappedImpacts = data.impact.impacts.map(impact => {
                    const currentScore = SEVERITY_SCORES[impact.severity] || 30;
                    // Add some synthetic variance for the "forecast" look
                    const forecastScore = Math.min(100, currentScore + (Math.random() * 15 - 5));
                    
                    return {
                        system: impact.system,
                        current: currentScore,
                        forecast: Math.round(forecastScore),
                        status: impact.severity, // UI expects 'status'
                        trend: forecastScore > currentScore ? "up" : "down"
                    };
                });
                setSystemImpact(mappedImpacts);
            }

            /*
            FLOW 4 — RISKS
            */
            if (data.forecast?.risks) {
                const LIKELIHOOD_MAP = { CRITICAL: 90, HIGH: 75, MEDIUM: 50, LOW: 25 };
                
                const mappedRisks = data.forecast.risks.map(risk => ({
                    id: risk.id || Math.random().toString(36).substr(2, 9),
                    date: risk.timeframe || "Upcoming",
                    scenario: risk.scenario,
                    probability: LIKELIHOOD_MAP[risk.likelihood] || 40, // UI expects numeric probability
                    severity: risk.impact_severity,
                    systems: risk.affected_systems || [],
                    timeframe: risk.timeframe
                }));
                setRiskForecast(mappedRisks);
            }

            /*
            FLOW 5 — NARRATIVES
            */
            if (data.narrative_reality?.narrative_checks) {
                const mappedNarratives = data.narrative_reality.narrative_checks.map(check => ({
                    id: check.id || Math.random().toString(36).substr(2, 9),
                    narrative: check.narrative,
                    alignment: check.verdict, // UI expects 'alignment'
                    confidence: check.confidence_score,
                    evidence: check.reasoning,
                    signals: check.evidence_refs || []
                }));
                setNarratives(mappedNarratives);
            }
        } catch (err) {
            setAnalysisError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    }, [documentText, queryText]);

    const sendChatMessage = useCallback(async (message) => {
        const userMsg = {
            role: "user",
            content: message,
            timestamp: new Date().toTimeString().slice(0, 8),
        };
        setChatHistory((prev) => [...prev, userMsg]);
        setIsChatLoading(true);

        await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

        const mockResponses = [
            "Based on current signals, energy systems face an 88% disruption severity index...",
            "Shipping route analysis shows a 34% traffic reduction through Hormuz...",
            "The economic impact matrix indicates moderate-to-high pressure...",
            "Narrative analysis identifies 3 verified signal clusters and 1 unverifiable claim..."
        ];

        const aiMsg = {
            role: "assistant",
            content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
            timestamp: new Date().toTimeString().slice(0, 8),
        };
        setChatHistory((prev) => [...prev, aiMsg]);
        setIsChatLoading(false);
    }, []);

    return (
        <AppContext.Provider
            value={{
                pipelineStatus,
                documentText, setDocumentText,
                queryText, setQueryText,
                isAnalyzing, analysisError,
                analyzeDocument,
                documentStats,
                evidenceChunks,
                geopoliticalSignals,
                events,
                systemImpact,
                riskForecast,
                narratives,
                chatHistory,
                isChatLoading,
                sendChatMessage,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}