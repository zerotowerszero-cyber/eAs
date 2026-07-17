"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

export default function NotepadPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== "notepad1234") {
      setError("Incorrect password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/notepad");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to load notepad");
      }
      
      setContent(data.content || "");
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    setSaveStatus("Saving...");
    try {
      const res = await fetch("/api/notepad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "notepad1234", content })
      });
      
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      
      setSaveStatus("Saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      setSaveStatus("Error saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced auto-save
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const timeoutId = setTimeout(() => {
      saveContent();
    }, 1500);
    
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>

          <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: "100%",
                height: "64px",
                padding: "0 32px",
                fontSize: "18px",
                fontWeight: "500",
                border: "1px solid transparent",
                borderRadius: "40px",
                background: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                boxShadow: "0 1px 6px rgba(32,33,36,.28)",
                textAlign: "center",
                letterSpacing: password.length > 0 ? "4px" : "normal",
                fontFamily: password.length > 0 ? "'Google Sans Mono', 'Roboto Mono', monospace" : "'Google Sans Text', 'Google Sans', sans-serif",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
                e.currentTarget.style.background = "var(--surface)";
              }}
              onBlur={(e) => e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)"}
              onMouseOver={(e) => {
                if (document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 2px 8px rgba(32,33,36,.15)";
                }
              }}
              onMouseOut={(e) => {
                if (document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
                }
              }}
            />
            {error && <div style={{ color: "#d93025", textAlign: "center", fontSize: "14px", fontWeight: "500" }}>{error}</div>}
            
            <button
              type="submit"
              disabled={loading || password.length === 0}
              style={{
                background: loading || password.length === 0 ? "#dadce0" : "var(--primary)",
                color: loading || password.length === 0 ? "#5f6368" : "white",
                border: "none",
                borderRadius: "32px",
                padding: "16px 48px",
                fontSize: "18px",
                fontWeight: "500",
                cursor: loading || password.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: loading || password.length === 0 ? "none" : "0 1px 6px rgba(32,33,36,.28)",
                marginTop: "8px"
              }}
              onMouseOver={(e) => {
                if (!loading && password.length > 0) {
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 4px 12px rgba(32,33,36,.15)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading && password.length > 0) {
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? "Verifying..." : "Submit"}
            </button>
          </form>

        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, padding: "32px 24px", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8vh" }}>
          <h1 className="hero-title" style={{ fontSize: "clamp(24px, 4vw, 36px)", margin: 0 }}>Global Notepad</h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "14px", color: "#5f6368", fontWeight: "500" }}>
              {saveStatus}
            </span>
            <button
              onClick={saveContent}
              disabled={isSaving}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "32px",
                padding: "8px 24px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 6px rgba(32,33,36,.28)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 4px 12px rgba(32,33,36,.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isSaving ? "Saving..." : "Save Now"}
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing... this will automatically sync across all your devices!"
          style={{
            flex: 1,
            width: "100%",
            minHeight: "400px",
            padding: "24px",
            fontSize: "16px",
            lineHeight: "1.6",
            border: "1px solid transparent",
            borderRadius: "24px",
            background: "var(--surface)",
            color: "var(--foreground)",
            outline: "none",
            boxShadow: "0 1px 6px rgba(32,33,36,.28)",
            fontFamily: "'Google Sans Mono', 'Roboto Mono', monospace",
            resize: "none",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 2px 8px rgba(32,33,36,.15)";
          }}
          onBlur={(e) => e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)"}
        />

      </div>
    </main>
  );
}
