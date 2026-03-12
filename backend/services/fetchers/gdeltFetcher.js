import fetch from "node-fetch";

// GDELT provides a 2.0 Doc API that allows searching recent events
// We'll search for recent geopolitical events (last 24 hours)
const GDELT_URL = "https://api.gdeltproject.org/api/v2/doc/doc?format=json&query=(military OR conflict OR diplomatic OR sanction OR blockade OR tension)&mode=artlist&maxrecords=10&sort=hybridrel";

export async function fetchLiveGdeltEvents() {
  console.log("[STRATOS] Fetching live geopolitical events from GDELT...");
  try {
    const response = await fetch(GDELT_URL);
    if (!response.ok) {
      throw new Error(`GDELT API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      return [];
    }

    // Format the articles into STRATOS evidence chunks
    return data.articles.map((article, index) => ({
      text: `[LIVE GDELT EVENT] Title: ${article.title}. Summary: ${article.title}. Source: ${article.domain}. URL: ${article.url}`,
      relevance: 0.95 - (index * 0.01), // Approximate relevance score
      source: "GDELT",
      date: article.seendate || new Date().toISOString()
    }));
  } catch (err) {
    console.error(`[STRATOS] Failed to fetch GDELT data: ${err.message}`);
    return []; // Return empty array so pipeline doesn't crash, just gracefully degrades
  }
}
