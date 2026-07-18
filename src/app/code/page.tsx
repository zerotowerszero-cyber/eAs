"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function CodePage() {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await fetch("/api/user/init");
        if (!res.ok) throw new Error("Failed to initialize user");
        const data = await res.json();
        setCode(data.clickCode);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchCode();
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{
          background: "var(--surface)",
          padding: "48px",
          borderRadius: "24px",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%"
        }}>
          <h1 style={{ fontSize: "24px", marginBottom: "16px", color: "var(--foreground)" }}>Your Access Code</h1>
          <p style={{ color: "#5f6368", marginBottom: "32px", fontSize: "16px" }}>
            This code is unique to your device. Use it on the homepage to unlock the hidden section.
          </p>
          
          {error ? (
            <div style={{ color: "#d93025" }}>{error}</div>
          ) : code ? (
            <div style={{
              fontSize: "48px",
              fontWeight: "700",
              letterSpacing: "8px",
              fontFamily: "'Google Sans Mono', monospace",
              color: "var(--primary)",
              background: "rgba(26, 115, 232, 0.1)",
              padding: "16px 24px",
              borderRadius: "16px",
              display: "inline-block"
            }}>
              {code}
            </div>
          ) : (
            <div style={{ color: "var(--primary)" }}>Generating...</div>
          )}
        </div>
      </div>
    </main>
  );
}
