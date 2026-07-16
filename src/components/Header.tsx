import Logo from "@/components/Logo";

export default function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <a href="/" className="logo-container" style={{ userSelect: "none", textDecoration: "none", color: "inherit" }}>
          <Logo className="logo-icon" />
          <span>eAs</span>
        </a>
        <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/link-shortener" className="btn-sailwhale" style={{ background: "var(--foreground)", color: "var(--background)", border: "none" }}>
            Shortener
          </a>
          <a href="https://sailwhale.eas.cx" className="btn-sailwhale">
            Sailwhale
          </a>
        </nav>
      </div>
    </header>
  );
}
