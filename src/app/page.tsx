import Header from "@/components/Header";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div className="container" style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <section className="hero" style={{ padding: 0 }}>
          <h1 className="hero-title animate-fade-up">
            Code anything.
            <br />
            Make it eAs.
          </h1>
          <p className="hero-subtitle animate-fade-up delay-1" style={{ marginBottom: 0 }}>
            We are focused on making anything that is coding. Whether that is a website, a browser, an app, or a bot.
          </p>
        </section>
      </div>
    </main>
  );
}
