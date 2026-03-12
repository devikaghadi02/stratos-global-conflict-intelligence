// src/api/ingestService.js

const BASE_URL = "http://192.168.0.101:5000/api";

export async function ingestDocument(text, query = "energy impact") {
    const response = await fetch(`${BASE_URL}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, query }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Ingest API error ${response.status}: ${err}`);
    }

    const json = await response.json();
    if (!json.success) throw new Error("API returned success: false");
    return json.data;
}

export async function askAssistant(question, context = {}) {
    // Placeholder for Flow 6 AI assistant endpoint
    // Replace with actual endpoint when available
    const response = await fetch(`${BASE_URL}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
    });

    if (!response.ok) throw new Error(`Assistant API error ${response.status}`);
    const json = await response.json();
    return json.answer || json.data?.answer;
}