"use client";

import { useState } from "react";

type Provider = {
  id: string;
  name: string;
  getUrl: (type: "movie" | "tv", tmdbId: string, season?: number, episode?: number) => string;
};

const PROVIDERS: Provider[] = [
  {
    id: "cinesrc",
    name: "CineSrc (Recommended)",
    getUrl: (type, id, s, e) => `https://cinesrc.st/embed/${type}/${id}${type === "tv" ? `?s=${s}&e=${e}` : ""}`
  },
  {
    id: "vidlink",
    name: "VidLink (Fast)",
    getUrl: (type, id, s, e) => `https://vidlink.pro/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vidfast",
    name: "VidFast",
    getUrl: (type, id, s, e) => `https://vidfast.pro/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "videasy",
    name: "VidEasy",
    getUrl: (type, id, s, e) => `https://videasy.net/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "fmovies",
    name: "FMovies",
    getUrl: (type, id, s, e) => `https://www.fmovies.gd/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vidzee",
    name: "VidZee",
    getUrl: (type, id, s, e) => `https://vidzee.wtf/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vixsrc",
    name: "VixSrc",
    getUrl: (type, id, s, e) => `https://vixsrc.to/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vidnest",
    name: "VidNest",
    getUrl: (type, id, s, e) => `https://vidnest.fun/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },

  {
    id: "primewire",
    name: "PrimeWire",
    getUrl: (type, id, s, e) => `https://primewire.mov/${type}/${id}${type === "tv" ? `?s=${s}&e=${e}` : ""}`
  },
  {
    id: "aeon-watch",
    name: "Aeon-Watch",
    getUrl: (type, id, s, e) => `https://thisiscinema.pages.dev/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  }
];

interface VideoPlayerProps {
  type: "movie" | "tv";
  tmdbId: string;
  season?: number;
  episode?: number;
}

export default function VideoPlayer({ type, tmdbId, season, episode }: VideoPlayerProps) {
  const [activeProvider, setActiveProvider] = useState<Provider>(PROVIDERS[0]);
  const [iframeKey, setIframeKey] = useState(0); // To force reload iframe

  const url = activeProvider.getUrl(type, tmdbId, season, episode);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = PROVIDERS.find(p => p.id === e.target.value);
    if (provider) {
      setActiveProvider(provider);
      setIframeKey(k => k + 1);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Provider Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "12px 24px", borderRadius: "40px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", color: "var(--foreground)" }}>
          Server / Provider
        </div>
        <select 
          value={activeProvider.id}
          onChange={handleProviderChange}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "40px",
            padding: "8px 32px 8px 16px",
            fontSize: "14px",
            color: "var(--foreground)",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235f6368%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px top 50%",
            backgroundSize: "12px auto"
          }}
        >
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Video Player */}
      <div style={{ 
        width: "100%", 
        aspectRatio: "16/9", 
        background: "#000", 
        borderRadius: "16px", 
        overflow: "hidden",
        boxShadow: "var(--shadow-md)"
      }}>
        {type === 'tv' && (!season || !episode) ? (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            Please select a season and episode to start watching.
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={url}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        )}
      </div>
    </div>
  );
}
