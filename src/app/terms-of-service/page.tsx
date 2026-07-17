import Header from "@/components/Header";

export default function TermsOfServicePage() {
  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div 
        style={{ 
          flex: 1, 
          padding: "64px 24px", 
          maxWidth: "800px", 
          margin: "0 auto", 
          width: "100%", 
          boxSizing: "border-box" 
        }}
      >
        <h1 
          className="hero-title animate-fade-up" 
          style={{ fontSize: "clamp(32px, 5vw, 48px)", marginBottom: "32px", textAlign: "left" }}
        >
          Terms of Service
        </h1>

        <div 
          className="animate-fade-up delay-1" 
          style={{ 
            fontSize: "18px", 
            lineHeight: "1.8", 
            color: "var(--foreground)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            fontFamily: "'Google Sans Text', 'Google Sans', sans-serif"
          }}
        >
          <p>
            Effective Date: July 17, 2026
          </p>
          <p>
            Welcome to eAs! These terms and conditions outline the rules and regulations for the use of eAs's Website, located at eas.cx.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use eAs if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          
          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>1. License</h2>
          <p>
            Unless otherwise stated, eAs and/or its licensors own the intellectual property rights for all material on eAs. All intellectual property rights are reserved. You may access this from eAs for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>
            You must not:
          </p>
          <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>Republish material from eAs</li>
            <li>Sell, rent or sub-license material from eAs</li>
            <li>Reproduce, duplicate or copy material from eAs</li>
            <li>Redistribute content from eAs</li>
          </ul>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>2. User Content</h2>
          <p>
            Certain parts of this website offer the opportunity for users to post and exchange opinions and information in certain areas of the website. eAs does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of eAs, its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.
          </p>
          <p>
            To the extent permitted by applicable laws, eAs shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>3. Hyperlinking to our Content</h2>
          <p>
            The following organizations may link to our Website without prior written approval:
          </p>
          <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses.</li>
          </ul>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>4. Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
