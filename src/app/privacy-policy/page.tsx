import Header from "@/components/Header";

export default function PrivacyPolicyPage() {
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
          Privacy Policy
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
            At eAs, accessible from eas.cx, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by eAs and how we use it.
          </p>
          
          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>1. Information We Collect</h2>
          <p>
            We collect information to provide better services to all our users. The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>2. How We Use Your Information</h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>3. Log Files</h2>
          <p>
            eAs follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>4. Cookies and Web Beacons</h2>
          <p>
            Like any other website, eAs uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>5. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
          </p>
        </div>
      </div>
    </main>
  );
}
