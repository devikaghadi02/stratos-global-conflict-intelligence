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
                setEvents(data.intelligence.events);
            }

            /*
            FLOW 3 — IMPACT
            */
            if (data.impact?.impacts) {
                setSystemImpact(data.impact.impacts);
            }

            /*
            FLOW 4 — RISKS
            */
            if (data.forecast?.risks) {
                setRiskForecast(data.forecast.risks);
            }

            /*
            FLOW 5 — NARRATIVES
            */
            if (data.narrative_reality?.narrative_checks) {
                setNarratives(data.narrative_reality.narrative_checks);
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