// src/data/mockData.js

export const mockDocumentStats = {
    total_chars: 4821,
    total_words: 847,
    total_chunks: 7,
    embedding_dim: 384,
    processed_at: "2026-03-12T06:34:45.958Z",
};

export const mockEvidenceChunks = [
    {
        chunk_id: 0,
        text: "Russian forces have intensified shelling along the eastern front, targeting key pipeline infrastructure near Kharkiv. Ukrainian officials report significant damage to gas transit facilities that supply central Europe.",
        score: 0.94,
        relevance: "CRITICAL",
        position: 1,
        word_count: 34,
    },
    {
        chunk_id: 1,
        text: "European energy futures rose 8.3% following reports of disruptions to the Nord Stream auxiliary corridor. Germany's energy ministry convened an emergency session to assess reserve capacity.",
        score: 0.87,
        relevance: "HIGH",
        position: 2,
        word_count: 29,
    },
    {
        chunk_id: 2,
        text: "The Strait of Hormuz shipping lanes have seen a 34% reduction in tanker traffic over the past 72 hours as regional tensions escalate. Lloyd's of London has upgraded the risk classification for the Persian Gulf.",
        score: 0.81,
        relevance: "HIGH",
        position: 3,
        word_count: 38,
    },
    {
        chunk_id: 3,
        text: "Beijing reiterated its neutrality stance while simultaneously increasing LNG purchases from Qatar at a 12% premium. Trade analysts see this as strategic stockpiling ahead of anticipated supply disruptions.",
        score: 0.73,
        relevance: "MEDIUM",
        position: 4,
        word_count: 31,
    },
    {
        chunk_id: 4,
        text: "US Treasury Department announced targeted sanctions on three Russian state energy entities. Markets responded with Brent crude climbing to $97.40 per barrel in early trading.",
        score: 0.68,
        relevance: "MEDIUM",
        position: 5,
        word_count: 27,
    },
];

export const mockGeopoliticalSignals = [
    { domain: "ENERGY", terms: ["pipeline", "LNG", "crude", "gas", "reserves"], count: 18, severity: 92 },
    { domain: "TRADE", terms: ["sanctions", "tariffs", "exports", "supply chain"], count: 12, severity: 74 },
    { domain: "CONFLICT", terms: ["military", "shelling", "forces", "strikes"], count: 21, severity: 88 },
    { domain: "DIPLOMACY", terms: ["neutrality", "negotiations", "bilateral"], count: 7, severity: 45 },
    { domain: "LOGISTICS", terms: ["shipping", "tanker", "Strait", "routes"], count: 15, severity: 81 },
    { domain: "ECONOMY", terms: ["futures", "markets", "Brent", "USD"], count: 9, severity: 67 },
];

export const mockEvents = [
    {
        id: 1,
        timestamp: "2026-03-12T05:12:00Z",
        title: "Pipeline Infrastructure Attack — Eastern Ukraine",
        category: "CONFLICT",
        severity: "CRITICAL",
        region: "Eastern Europe",
        impact: ["ENERGY", "TRADE"],
    },
    {
        id: 2,
        timestamp: "2026-03-12T04:47:00Z",
        title: "Hormuz Tanker Traffic Drops 34%",
        category: "LOGISTICS",
        severity: "HIGH",
        region: "Middle East",
        impact: ["SHIPPING", "ENERGY"],
    },
    {
        id: 3,
        timestamp: "2026-03-12T03:30:00Z",
        title: "US Treasury Sanctions on Russian Energy Entities",
        category: "DIPLOMACY",
        severity: "HIGH",
        region: "Global",
        impact: ["ECONOMY", "TRADE"],
    },
    {
        id: 4,
        timestamp: "2026-03-12T02:15:00Z",
        title: "Germany Emergency Energy Council Convened",
        category: "ENERGY",
        severity: "MEDIUM",
        region: "Western Europe",
        impact: ["ENERGY", "ECONOMY"],
    },
    {
        id: 5,
        timestamp: "2026-03-12T01:00:00Z",
        title: "China Strategic LNG Stockpiling — Qatar Purchases +12%",
        category: "TRADE",
        severity: "MEDIUM",
        region: "Asia-Pacific",
        impact: ["TRADE", "ENERGY"],
    },
    {
        id: 6,
        timestamp: "2026-03-11T22:40:00Z",
        title: "NATO Emergency Defence Committee Activated",
        category: "DIPLOMACY",
        severity: "HIGH",
        region: "Europe",
        impact: ["DIPLOMACY", "CONFLICT"],
    },
];

export const mockSystemImpact = [
    { system: "Energy", current: 88, forecast: 94, trend: "up", status: "CRITICAL" },
    { system: "Trade", current: 72, forecast: 78, trend: "up", status: "HIGH" },
    { system: "Logistics", current: 81, forecast: 85, trend: "up", status: "HIGH" },
    { system: "Economy", current: 64, forecast: 71, trend: "up", status: "ELEVATED" },
    { system: "Shipping", current: 79, forecast: 88, trend: "up", status: "HIGH" },
];

export const mockRiskForecast = [
    {
        id: 1,
        date: "Mar 13",
        scenario: "Energy Price Spike >$110/bbl",
        probability: 78,
        severity: "CRITICAL",
        systems: ["Energy", "Economy"],
        timeframe: "24–48h",
    },
    {
        id: 2,
        date: "Mar 14",
        scenario: "Complete Hormuz Blockade",
        probability: 34,
        severity: "EXTREME",
        systems: ["Shipping", "Energy", "Trade"],
        timeframe: "48–72h",
    },
    {
        id: 3,
        date: "Mar 15",
        scenario: "European Gas Reserve Crisis",
        probability: 61,
        severity: "HIGH",
        systems: ["Energy", "Economy"],
        timeframe: "72–96h",
    },
    {
        id: 4,
        date: "Mar 16",
        scenario: "Supply Chain Cascade Failure",
        probability: 45,
        severity: "HIGH",
        systems: ["Trade", "Logistics", "Economy"],
        timeframe: "96–120h",
    },
    {
        id: 5,
        date: "Mar 18",
        scenario: "Diplomatic Resolution Pathway Opens",
        probability: 29,
        severity: "LOW",
        systems: ["Diplomacy"],
        timeframe: "5–7 days",
    },
];

export const mockNarratives = [
    {
        id: 1,
        narrative: "Russia–Ukraine conflict will cut off all European gas supply within days",
        alignment: "CONTRADICTED",
        confidence: 82,
        evidence: "Current pipeline flow at 61% capacity. Reserves cover 4.2 months. Narrative overstates immediacy.",
        signals: ["Pipeline flow data", "EU reserve reports", "German ministry statements"],
    },
    {
        id: 2,
        narrative: "Hormuz closure is imminent and will halt global oil trade",
        alignment: "PARTIALLY_ALIGNED",
        confidence: 67,
        evidence: "Traffic down 34% but complete closure requires coordinated military action not yet observed.",
        signals: ["AIS tracking data", "Lloyd's risk assessments"],
    },
    {
        id: 3,
        narrative: "China is exploiting crisis to dominate LNG markets",
        alignment: "ALIGNED",
        confidence: 74,
        evidence: "Purchases increased 12% above market rate. Consistent with strategic stockpiling pattern observed in 2022.",
        signals: ["Trade flow data", "LNG pricing feeds", "Port activity reports"],
    },
    {
        id: 4,
        narrative: "Global recession is inevitable within 6 months",
        alignment: "UNVERIFIABLE",
        confidence: 31,
        evidence: "Insufficient current data to confirm or deny. Multiple economic models produce conflicting outputs.",
        signals: ["IMF forecasts", "Market futures"],
    },
];

export const mockChatHistory = [
    {
        role: "assistant",
        content: "STRATOS Intelligence Assistant online. I have analyzed the current geopolitical document set. Ask me anything about the conflict's systemic impacts.",
        timestamp: "06:34:45",
    },
];

export const mockPipelineStatus = {
    flow1: { label: "Document Ingestion", status: "ACTIVE", latency: "142ms" },
    flow2: { label: "Event Extraction", status: "ACTIVE", latency: "287ms" },
    flow3: { label: "Impact Analysis", status: "ACTIVE", latency: "431ms" },
    flow4: { label: "Risk Forecasting", status: "IDLE", latency: "—" },
    flow5: { label: "Narrative Analysis", status: "ACTIVE", latency: "198ms" },
    flow6: { label: "AI Assistant", status: "ACTIVE", latency: "63ms" },
};