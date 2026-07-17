"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [codeClickCount, setCodeClickCount] = useState(0);

  const handleEasClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      router.push("/movies");
    }
  };

  const handleCodeClick = () => {
    const newCount = codeClickCount + 1;
    setCodeClickCount(newCount);
    if (newCount >= 5) {
      router.push("/notepad");
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div className="container" style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <section className="hero" style={{ padding: 0 }}>
          <h1 className="hero-title animate-fade-up">
            <span 
              onClick={handleCodeClick} 
              style={{ cursor: "text" }}
            >
              Code
            </span> anything.
            <br />
            Make it <span 
              onClick={handleEasClick} 
              style={{ cursor: "text" }}
            >
              eAs
            </span>.
          </h1>
          <p className="hero-subtitle animate-fade-up delay-1" style={{ marginBottom: 0 }}>
            We are focused on making anything that is coding. Whether that is a website, a browser, an app, or a bot.
          </p>
        </section>
      </div>

      <footer style={{ 
        padding: "24px", 
        display: "flex", 
        justifyContent: "center", 
        gap: "24px", 
        color: "#5f6368", 
        fontSize: "14px",
        background: "var(--background)"
      }}>
        <Link href="/privacy-policy" style={{ textDecoration: "none", color: "inherit" }} onMouseOver={e => e.currentTarget.style.textDecoration = "underline"} onMouseOut={e => e.currentTarget.style.textDecoration = "none"}>
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" style={{ textDecoration: "none", color: "inherit" }} onMouseOver={e => e.currentTarget.style.textDecoration = "underline"} onMouseOut={e => e.currentTarget.style.textDecoration = "none"}>
          Terms of Service
        </Link>
      </footer>
    </main>
  );
}
