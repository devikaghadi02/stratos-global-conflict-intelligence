# STRATOS: Global Conflict Intelligence & Risk Forecast

**STRATOS** is a next-generation geopolitical intelligence platform designed to transform raw global signals into actionable insights. By combining real-time data ingestion with advanced AI analysis, STRATOS provides a comprehensive view of global conflicts, maritime disruptions, and economic risks.

## 🚀 Key Features

### 📡 Live Data Integration
Unlike standard intelligence tools, STRATOS connects to real-world public datasets:
- **GDELT GKG**: Real-time monitoring of geopolitical events and global news signals.
- **Commodity Markets**: Live tracking of Crude Oil (Brent/WTI) prices for economic impact assessment.
- **Maritime Intelligence**: Integration of shipping disruption signals and corridor threat levels.

### 🧠 Unified AI Core (Dual-Provider Architecture)
The backend features a robust `aiClient.js` that ensures 100% uptime:
- **Gemini & OpenRouter**: Intelligent rotation between multiple API providers.
- **Auto-Fallback**: Automatically switches to OpenRouter's free models (Llama 3.1, Gemma 3) if Gemini hits rate limits (429 errors).
- **Key Rotation**: Cycles through multiple API keys to maximize throughput.

### 📊 Intelligence Dashboard
- **Impact Analysis Matrix**: Analyzes the severity of events across 6 critical systems (Energy, Trade, Logistics, etc.).
- **Risk Forecast**: Predictive modeling of supply chain collapses, military escalations, and regional economic shocks.
- **Narrative Integrity**: A "Reality Check" module that verifies news narratives against hard evidence chunks.
- **AI Assistant**: A context-aware chat interface that uses the RAG engine to answer questions based on real document evidence and live events.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express.
- **Analysis Engine**: Python-based RAG (Retrieval-Augmented Generation) for document processing.
- **LLMs**: Google Gemini 2.0/1.5, Meta Llama 3.1, Mistral (via OpenRouter).

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- API Keys: Gemini and/or OpenRouter.

### Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/devikaghadi02/stratos-global-conflict-intelligence.git
   cd stratos-global-conflict-intelligence
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with your GEMINI_API_KEY and OPENROUTER_API_KEY
   node server.js
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📜 License
Internal Development - All Rights Reserved.
