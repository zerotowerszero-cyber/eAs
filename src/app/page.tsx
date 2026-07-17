"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    </main>
  );
}
