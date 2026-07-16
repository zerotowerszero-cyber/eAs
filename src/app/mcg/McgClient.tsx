"use client";

import { useState } from "react";

export default function McgClient() {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setCode(null);

    try {
      const res = await fetch("/api/mcg/generate", {
        method: "POST"
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate code");
      }

      setCode(data.code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {code ? (
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", color: "#5f6368", marginBottom: "12px", fontWeight: "500" }}>NEW SINGLE-USE ACCESS CODE</div>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "24px",
            fontSize: "40px",
            fontWeight: "700",
            letterSpacing: "6px",
            fontFamily: "monospace",
            color: "var(--primary)",
            boxShadow: "var(--shadow-sm)"
          }}>
            {code}
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(code)}
            style={{
              marginTop: "16px",
              background: "transparent",
              border: "none",
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px"
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      ) : null}

      {error && <div style={{ color: "#d93025", textAlign: "center", fontWeight: "500" }}>{error}</div>}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          background: "var(--primary)",
          color: "white",
          border: "none",
          borderRadius: "32px",
          height: "64px",
          fontSize: "18px",
          fontWeight: "500",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: "0 1px 6px rgba(32,33,36,.28)",
          opacity: loading ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 4px 12px rgba(32,33,36,.15)";
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
          }
        }}
      >
        {loading ? "Generating..." : "Generate Code"}
      </button>

    </div>
  );
}
