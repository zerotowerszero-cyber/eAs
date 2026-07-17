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

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>1. Definitions</h2>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of the United States.
          </p>
          
          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>2. License</h2>
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

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>3. User Content and Comments</h2>
          <p>
            Certain parts of this website offer the opportunity for users to post and exchange opinions and information in certain areas of the website. eAs does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of eAs, its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.
          </p>
          <p>
            To the extent permitted by applicable laws, eAs shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
          </p>
          <p>
            eAs reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
          </p>
          <p>
            You warrant and represent that:
          </p>
          <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
            <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
            <li>The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy;</li>
            <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
          </ul>
          <p>
            You hereby grant eAs a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>4. Global Notepad and Services</h2>
          <p>
            Features such as the Global Notepad, encrypted URLs, and media search tools are provided "as is". While eAs strives for 100% uptime and data integrity, we are not responsible for any data loss, corruption, or unauthorized access resulting from the use of our services. You are solely responsible for ensuring you have adequate backups of any data you store on the eAs platform.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>5. Hyperlinking to our Content</h2>
          <p>
            The following organizations may link to our Website without prior written approval:
          </p>
          <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
            <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
          </ul>
          <p>
            We may consider and approve other link requests from the following types of organizations:
          </p>
          <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>commonly-known consumer and/or business information sources;</li>
            <li>dot.com community sites;</li>
            <li>associations or other groups representing charities;</li>
            <li>online directory distributors;</li>
            <li>internet portals;</li>
            <li>accounting, law and consulting firms; and</li>
            <li>educational institutions and trade associations.</li>
          </ul>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>6. iFrames</h2>
          <p>
            Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>7. Content Liability</h2>
          <p>
            We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>8. Reservation of Rights</h2>
          <p>
            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>9. Removal of links from our website</h2>
          <p>
            If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
          </p>
          <p>
            We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
          </p>

          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>10. Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
          <p>
            The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
          </p>
          <p>
            As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
          </p>
        </div>
      </div>
    </main>
  );
}
