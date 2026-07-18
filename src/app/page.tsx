"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [codeClickCount, setCodeClickCount] = useState(0);

  const [userAuth, setUserAuth] = useState<any>(null);
  
  const [clickCounts, setClickCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    fetch("/api/user/init").then(res => res.json()).then(data => {
      setUserAuth(data);
    }).catch(err => console.error(err));
  }, []);

  const handleEasClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      if (userAuth?.clickAuthGranted) {
        router.push("/49218");
      }
    }
  };

  const handleCodeClick = () => {
    const newCount = codeClickCount + 1;
    setCodeClickCount(newCount);
    if (newCount >= 5) {
      router.push("/notepad");
    }
  };

  const handleSequenceClick = (index: number) => {
    if (!userAuth || !userAuth.clickCode) return;
    
    const newCounts = [...clickCounts];
    newCounts[index]++;
    setClickCounts(newCounts);

    const targetCounts = userAuth.clickCode.split('').map(Number);
    
    if (
      newCounts[0] === targetCounts[0] &&
      newCounts[1] === targetCounts[1] &&
      newCounts[2] === targetCounts[2] &&
      newCounts[3] === targetCounts[3]
    ) {
      // Validate with server and redirect
      fetch("/api/user/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence: userAuth.clickCode })
      }).then(res => {
        if (res.ok) router.push("/49218");
      });
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: "64px" }}>
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
            We are focused on making anything that is coding. Whether that is a <span onClick={() => handleSequenceClick(0)} style={{ cursor: "text" }}>website</span>, a <span onClick={() => handleSequenceClick(1)} style={{ cursor: "text" }}>browser</span>, an <span onClick={() => handleSequenceClick(2)} style={{ cursor: "text" }}>app</span>, or a <span onClick={() => handleSequenceClick(3)} style={{ cursor: "text" }}>bot</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
