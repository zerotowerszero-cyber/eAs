"use client";

import { useEffect, useState } from "react";

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
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
      {error ? (
        <div style={{ color: "#d93025", fontFamily: "'Google Sans', sans-serif" }}>{error}</div>
      ) : code ? (
        <div style={{
          fontSize: "clamp(64px, 15vw, 120px)",
          fontWeight: "700",
          letterSpacing: "16px",
          fontFamily: "'Google Sans Mono', monospace",
          color: "var(--foreground)",
          opacity: 0.9
        }}>
          {code}
        </div>
      ) : (
        <div style={{ color: "var(--foreground)", opacity: 0.5, fontFamily: "'Google Sans', sans-serif" }}>...</div>
      )}
    </main>
  );
}
