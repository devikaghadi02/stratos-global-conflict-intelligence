// src/context/useApp.js
// Separated from AppContext.jsx to satisfy react-refresh/only-export-components rule
import { useContext } from "react";
import { AppContext } from "./AppContext";

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used inside AppProvider");
    return ctx;
}