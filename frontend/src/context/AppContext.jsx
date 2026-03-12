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
import { ingestDocument, askAssistant } from "../api/ingestService";

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
                // Backend events are usually fine as is, but ensure consistency
                setEvents(data.intelligence.events.map(ev => ({
                    ...ev,
                    timestamp: ev.timestamp || new Date().toISOString(),
                    impact: ev.impact || [] // Ensure impact array exists
                })));
            }

            /*
            FLOW 3 — IMPACT
            Map backend impact to SystemImpactMatrix expected format
            */
            if (data.impact?.impacts) {
                const severityMap = {
                    "CRITICAL": 90,
                    "HIGH": 75,
                    "MEDIUM": 50,
                    "LOW": 25,
                    "NONE": 10
                };

                const mappedImpact = data.impact.impacts.map(imp => ({
                    system: imp.system.split(' ')[0], // Extract first word (Energy, Trade, etc.)
                    status: imp.severity,
                    current: severityMap[imp.severity] || 20,
                    forecast: (severityMap[imp.severity] || 20) + (imp.severity === "CRITICAL" ? 5 : 10),
                    trend: "up"
                }));
                setSystemImpact(mappedImpact);
            }

            /*
            FLOW 4 — RISKS
            Map backend risk to RiskForecastTimeline and RiskPage expected format
            */
            if (data.forecast?.risks) {
                const mappedRisks = data.forecast.risks.map(r => ({
                    id: r.id,
                    scenario: r.title, // Keep for Timeline
                    title: r.title,    // Add for RiskPage
                    severity: r.severity,
                    probability: r.probability,
                    timeframe: r.timeframe,
                    date: "Q2 2026", // Mock date context
                    systems: r.affected_systems || []
                }));
                // Set as object to satisfy RiskPage.jsx expectations
                setRiskForecast({ risks: mappedRisks });
            }

            /*
            FLOW 5 — NARRATIVES
            Map backend narrative checks to NarrativeRealityPanel expected format
            */
            if (data.narrative_reality?.narrative_checks) {
                const mappedNarratives = data.narrative_reality.narrative_checks.map(n => ({
                    id: n.narrative_id,
                    alignment: n.alignment === "PARTIAL" ? "PARTIALLY_ALIGNED" : n.alignment, // Handle enum mismatch
                    narrative: n.narrative_title,
                    verdict: n.verdict,
                    evidence: n.reality_check || n.verdict, // Use reality_check for the main text
                    signals: n.misleading_elements || [],
                    confidence: n.alignment_score || 70
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

        try {
            // Use real assistant API with required context
            const response = await askAssistant(message, {
                evidenceChunks: evidenceChunks, // Backend requires evidenceChunks array
                events: events,
                riskScenarios: riskForecast?.risks || [],
                conversationHistory: chatHistory.map(m => ({ role: m.role, content: m.content }))
            });

            const aiMsg = {
                role: "assistant",
                content: response.answer || response.content || "I'm processing your request.",
                timestamp: new Date().toTimeString().slice(0, 8),
            };
            setChatHistory((prev) => [...prev, aiMsg]);
        } catch (err) {
            console.error("Assistant error:", err);
            const errorMsg = {
                role: "assistant",
                content: "I'm sorry, I encountered an error connecting to the intelligence engine.",
                timestamp: new Date().toTimeString().slice(0, 8),
            };
            setChatHistory((prev) => [...prev, errorMsg]);
        } finally {
            setIsChatLoading(false);
        }
    }, [evidenceChunks, events, riskForecast, chatHistory]);

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