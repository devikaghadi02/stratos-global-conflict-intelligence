#!/usr/bin/env python3
"""
STRATOS RAG Engine — Flow 01
Chunks text, generates embeddings, builds FAISS index, retrieves evidence.
Input:  JSON via stdin  { mode, text, query }
Output: JSON via stdout { document_stats, evidence_chunks, geopolitical_signals }
"""

import sys
import json
import re
import numpy as np


# ─────────────────────────────────────────
# 1. CHUNKING
# ─────────────────────────────────────────

def chunk_text(text, chunk_size=120, overlap=20):
    """
    Split text into overlapping word windows.
    chunk_size: words per chunk
    overlap: words shared between consecutive chunks
    """
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(words):
            break
        start += chunk_size - overlap

    return chunks


# ─────────────────────────────────────────
# 2. EMBEDDINGS
# ─────────────────────────────────────────

def get_embeddings(texts):
    """
    Generate normalized sentence embeddings using all-MiniLM-L6-v2.
    Returns numpy float32 matrix of shape (n, 384).
    """
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(texts, normalize_embeddings=True)
    return embeddings.astype(np.float32)


# ─────────────────────────────────────────
# 3. FAISS INDEX
# ─────────────────────────────────────────

def build_faiss_index(embeddings):
    """
    Build a FAISS flat index using inner product.
    Since vectors are normalized, inner product == cosine similarity.
    """
    import faiss
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings)
    return index


# ─────────────────────────────────────────
# 4. EVIDENCE RETRIEVAL
# ─────────────────────────────────────────

def retrieve_evidence(query, chunks, index, top_k=6):
    """
    Embed the query and retrieve top_k most similar chunks from the index.
    Returns list of { chunk_id, text, score, relevance }.
    """
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("all-MiniLM-L6-v2")

    query_embedding = model.encode([query], normalize_embeddings=True).astype(np.float32)
    k = min(top_k, len(chunks))
    scores, indices = index.search(query_embedding, k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx < len(chunks):
            results.append({
                "chunk_id": int(idx),
                "text": chunks[idx],
                "score": round(float(score), 4),
                "relevance": score_to_label(float(score)),
            })

    return results


def score_to_label(score):
    if score >= 0.75:
        return "HIGH"
    elif score >= 0.50:
        return "MEDIUM"
    else:
        return "LOW"


# ─────────────────────────────────────────
# 5. GEOPOLITICAL SIGNAL EXTRACTION
# ─────────────────────────────────────────

def extract_key_signals(text):
    """
    Regex-based domain signal detector.
    Returns list of { domain, terms, count } sorted by count descending.
    """
    domain_patterns = {
        "ENERGY":     r"\b(oil|gas|pipeline|energy|fuel|LNG|barrel|OPEC|petroleum|electricity|nuclear)\b",
        "TRADE":      r"\b(trade|tariff|export|import|supply chain|embargo|sanctions|WTO|quota|goods)\b",
        "CONFLICT":   r"\b(war|conflict|military|troops|invasion|ceasefire|airstrike|offensive|attack|missile)\b",
        "DIPLOMACY":  r"\b(treaty|diplomatic|negotiation|summit|alliance|UN|NATO|sanctions|agreement|talks)\b",
        "LOGISTICS":  r"\b(shipping|port|freight|logistics|route|transit|blockade|Suez|Strait|canal|vessel)\b",
        "ECONOMIC":   r"\b(GDP|inflation|recession|currency|debt|IMF|World Bank|economy|market|ruble|dollar)\b",
    }

    signals = []
    for domain, pattern in domain_patterns.items():
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            unique_terms = list(set(m.lower() for m in matches))[:6]
            signals.append({
                "domain": domain,
                "terms": unique_terms,
                "count": len(matches),
            })

    signals.sort(key=lambda x: x["count"], reverse=True)
    return signals


# ─────────────────────────────────────────
# 6. MAIN ENTRY POINT
# ─────────────────────────────────────────

def main():
    raw = sys.stdin.read().strip()

    try:
        input_data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
        sys.exit(1)

    mode = input_data.get("mode", "ingest")

    if mode != "ingest":
        print(json.dumps({"error": f"Unknown mode: {mode}"}))
        sys.exit(1)

    text = input_data.get("text", "").strip()
    query = input_data.get("query", "geopolitical conflict impact energy trade").strip()

    if not text:
        print(json.dumps({"error": "No text provided"}))
        sys.exit(1)

    # Step 1 — Chunk
    chunks = chunk_text(text, chunk_size=120, overlap=20)

    if not chunks:
        print(json.dumps({"error": "Document produced no chunks after processing"}))
        sys.exit(1)

    # Step 2 — Embed
    embeddings = get_embeddings(chunks)

    # Step 3 — Index
    index = build_faiss_index(embeddings)

    # Step 4 — Retrieve
    evidence = retrieve_evidence(query, chunks, index, top_k=6)

    # Step 5 — Signals
    signals = extract_key_signals(text)

    # Output
    output = {
        "document_stats": {
            "total_chars": len(text),
            "total_words": len(text.split()),
            "total_chunks": len(chunks),
            "embedding_dim": int(embeddings.shape[1]),
        },
        "evidence_chunks": evidence,
        "geopolitical_signals": signals,
    }

    print(json.dumps(output))


if __name__ == "__main__":
    main()