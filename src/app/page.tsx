"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function AntEasterEgg() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        bottom: '40px',
        animation: 'walkAcross 15s linear forwards',
      }}>
        <div style={{
          fontSize: '32px',
          animation: 'wiggle 0.3s infinite alternate',
          transform: 'scaleX(-1)',
          display: 'inline-block'
        }}>
          🐜
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes walkAcross {
          0% { left: -50px; }
          100% { left: 100vw; }
        }
        @keyframes wiggle {
          0% { transform: scaleX(-1) translateY(0) rotate(-10deg); }
          100% { transform: scaleX(-1) translateY(-4px) rotate(10deg); }
        }
      `}} />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [codeClickCount, setCodeClickCount] = useState(0);
  
  const [weClickCount, setWeClickCount] = useState(0);
  const [whetherClickCount, setWhetherClickCount] = useState(0);
  const [focusedClickCount, setFocusedClickCount] = useState(0);

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
      fetch("/api/user/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence: userAuth.clickCode })
      }).then(res => {
        if (res.ok) router.push("/49218");
      });
    }
  };

  const isAntTriggered = weClickCount >= 3 && whetherClickCount >= 3 && focusedClickCount >= 3;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: "64px" }}>
      {isAntTriggered && <AntEasterEgg />}
      <Header />

      <div className="container" style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <section className="hero" style={{ padding: 0 }}>
          <h1 className="hero-title animate-fade-up">
            <span onClick={handleCodeClick} style={{ cursor: "text" }}>Code</span> anything.
            <br />
            Make it <span onClick={handleEasClick} style={{ cursor: "text" }}>eAs</span>.
          </h1>
          <p className="hero-subtitle animate-fade-up delay-1" style={{ marginBottom: 0 }}>
            <span onClick={() => setWeClickCount(p => p + 1)} style={{ cursor: "text" }}>We</span> are <span onClick={() => setFocusedClickCount(p => p + 1)} style={{ cursor: "text" }}>focused</span> on making anything that is coding. <span onClick={() => setWhetherClickCount(p => p + 1)} style={{ cursor: "text" }}>Whether</span> that is a <span onClick={() => handleSequenceClick(0)} style={{ cursor: "text" }}>website</span>, a <span onClick={() => handleSequenceClick(1)} style={{ cursor: "text" }}>browser</span>, an <span onClick={() => handleSequenceClick(2)} style={{ cursor: "text" }}>app</span>, or a <span onClick={() => handleSequenceClick(3)} style={{ cursor: "text" }}>bot</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
