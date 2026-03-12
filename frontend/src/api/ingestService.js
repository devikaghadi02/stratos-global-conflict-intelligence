const BASE_URL = "http://localhost:5000/api";
/*
MAIN PIPELINE ENDPOINT
Runs Flow1 → Flow5 together
*/
export async function ingestDocument(text, query = "energy impact") {
    const response = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            query,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Analyze API error ${response.status}: ${err}`);
    }

    const json = await response.json();

    if (!json.success) {
        throw new Error("API returned success: false");
    }

    return json.data;
}

/*
FLOW 6 — AI ASSISTANT
*/
export async function askAssistant(question, context = {}) {
    const response = await fetch(`${BASE_URL}/assistant/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question,
            context,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Assistant API error ${response.status}: ${err}`);
    }

    const json = await response.json();

    if (!json.success) {
        throw new Error("Assistant API returned success: false");
    }

    return json.data;
}
