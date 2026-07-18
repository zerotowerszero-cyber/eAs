"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function CorruptionEasterEgg() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage sequence:
    // 0: Initial holes
    // 1: Bugs appear
    // 2: Bigger animals (lizards/birds)
    // 3: Overload / glitching
    // 4: 0s and 1s matrix
    // 5: Close tab
    
    const timers = [
      setTimeout(() => setStage(1), 2000),
      setTimeout(() => setStage(2), 4000),
      setTimeout(() => setStage(3), 6000),
      setTimeout(() => setStage(4), 8500),
      setTimeout(() => {
        window.close();
        // Fallback if window.close() blocked
        document.body.innerHTML = '<div style="background:black;color:#0f0;height:100vh;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:24px;">SYSTEM FAILURE</div>';
      }, 12000)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999,
      pointerEvents: 'none',
      overflow: 'hidden',
      mixBlendMode: stage >= 3 ? 'difference' : 'normal',
      filter: stage >= 3 ? 'contrast(200%) hue-rotate(90deg)' : 'none',
      background: stage >= 4 ? 'black' : 'transparent',
    }}>
      {/* Stage 0: Holes */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '100px', height: '100px', background: 'black', borderRadius: '50%', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }} />
      <div style={{ position: 'absolute', top: '60%', right: '20%', width: '150px', height: '120px', background: 'black', borderRadius: '40% 60% 50% 40%', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }} />
      <div style={{ position: 'absolute', top: '10%', right: '40%', width: '80px', height: '90px', background: 'black', borderRadius: '50%', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }} />

      {/* Stage 1: Bugs */}
      {stage >= 1 && stage < 4 && Array.from({ length: 30 }).map((_, i) => (
        <div key={`bug-${i}`} style={{
          position: 'absolute',
          fontSize: '24px',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `scurry ${2 + Math.random() * 2}s infinite linear`,
          transform: `rotate(${Math.random() * 360}deg)`
        }}>
          🐜
        </div>
      ))}

      {/* Stage 2: Bigger Animals */}
      {stage >= 2 && stage < 4 && Array.from({ length: 8 }).map((_, i) => (
        <div key={`animal-${i}`} style={{
          position: 'absolute',
          fontSize: '64px',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `scurry ${1.5 + Math.random()}s infinite linear reverse`,
          transform: `rotate(${Math.random() * 360}deg)`
        }}>
          {['🦎', '🐸', '🦅', '🦉'][i % 4]}
        </div>
      ))}

      {/* Stage 3: Glitch Overlay */}
      {stage >= 3 && stage < 4 && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          animation: 'glitch 0.2s infinite'
        }} />
      )}

      {/* Stage 4: Matrix */}
      {stage >= 4 && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          fontFamily: 'monospace',
          color: '#0f0',
          fontSize: '20px',
          lineHeight: '20px',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          padding: '20px'
        }}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} style={{ animation: `scroll ${Math.random() * 2 + 1}s infinite linear` }}>
              {Array.from({ length: 100 }).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scurry {
          0% { margin-top: 0; margin-left: 0; }
          25% { margin-top: -50px; margin-left: 50px; }
          50% { margin-top: 20px; margin-left: 100px; }
          75% { margin-top: 80px; margin-left: -20px; }
          100% { margin-top: 0; margin-left: 0; }
        }
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-5px, 5px) }
          40% { transform: translate(-5px, -5px) }
          60% { transform: translate(5px, 5px) }
          80% { transform: translate(5px, -5px) }
          100% { transform: translate(0) }
        }
        @keyframes scroll {
          0% { transform: translateY(-100%) }
          100% { transform: translateY(100vh) }
        }
      `}} />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [codeClickCount, setCodeClickCount] = useState(0);
  const [makeClickCount, setMakeClickCount] = useState(0);
  
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

  const handleMakeClick = () => {
    const newCount = makeClickCount + 1;
    setMakeClickCount(newCount);
    if (newCount >= 4) {
      router.push("/ai");
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

  const isCorruptionTriggered = weClickCount >= 3 && whetherClickCount >= 3 && focusedClickCount >= 3;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: "64px" }}>
      {isCorruptionTriggered && <CorruptionEasterEgg />}
      <Header />

      <div className="container" style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <section className="hero" style={{ padding: 0 }}>
          <h1 className="hero-title animate-fade-up">
            <span onClick={handleCodeClick} style={{ cursor: "text" }}>Code</span> anything.
            <br />
            <span onClick={handleMakeClick} style={{ cursor: "text" }}>Make</span> it <span onClick={handleEasClick} style={{ cursor: "text" }}>eAs</span>.
          </h1>
          <p className="hero-subtitle animate-fade-up delay-1" style={{ marginBottom: 0 }}>
            <span onClick={() => setWeClickCount(p => p + 1)} style={{ cursor: "text" }}>We</span> are <span onClick={() => setFocusedClickCount(p => p + 1)} style={{ cursor: "text" }}>focused</span> on making anything that is coding. <span onClick={() => setWhetherClickCount(p => p + 1)} style={{ cursor: "text" }}>Whether</span> that is a <span onClick={() => handleSequenceClick(0)} style={{ cursor: "text" }}>website</span>, a <span onClick={() => handleSequenceClick(1)} style={{ cursor: "text" }}>browser</span>, an <span onClick={() => handleSequenceClick(2)} style={{ cursor: "text" }}>app</span>, or a <span onClick={() => handleSequenceClick(3)} style={{ cursor: "text" }}>bot</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
