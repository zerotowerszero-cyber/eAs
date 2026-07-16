import Logo from "@/components/Logo";

export default function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo-container" style={{ userSelect: "none" }}>
          <Logo className="logo-icon" />
          <span>eAs</span>
        </div>
        <nav>
          <a href="https://sailwhale.eas.cx" className="btn-sailwhale">
            Sailwhale
          </a>
        </nav>
      </div>
    </header>
  );
}
