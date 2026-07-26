import { Link } from 'react-router-dom';
import { Shield, Eye } from 'lucide-react';

const LAST_UPDATED = 'July 2026';

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>
);
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
);
const UL: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-4 space-y-2">{children}</ul>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={16} />
            </div>
            <span className="font-black text-lg tracking-tighter text-blue-600">NovaBit</span>
          </Link>
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Eye size={20} className="text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-400 font-medium">Last updated: {LAST_UPDATED} &middot; Effective date: {LAST_UPDATED}</p>
        </div>

        <P>
          NovaBit Exchange O&Uuml; (&ldquo;NovaBit,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a company
          registered in the Republic of Estonia (registry code: pending, registered address: Tallinn, Estonia), is committed
          to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal
          data when you use our platform and services (the &ldquo;Services&rdquo;).
        </P>
        <P>
          This Privacy Policy is issued in compliance with the EU General Data Protection Regulation (GDPR) (EU 2016/679),
          the Estonian Personal Data Protection Act, and applicable anti-money laundering regulations as enforced by the
          Estonian Financial Intelligence Unit (FIU).
        </P>

        <H2>1. Data Controller</H2>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6">
          <p className="text-gray-700 font-bold mb-1">NovaBit Exchange O&Uuml;</p>
          <p className="text-gray-500 text-sm">Registered in the Republic of Estonia</p>
          <p className="text-gray-500 text-sm mt-2">Email: <a href="mailto:dpo@novabit.exchange" className="text-blue-600 hover:underline">dpo@novabit.exchange</a></p>
        </div>

        <H2>2. Personal Data We Collect</H2>
        <h3 className="text-sm font-bold text-gray-800 mt-6 mb-2">2.1 Identity &amp; Verification Data</h3>
        <UL>
          <li>Full legal name, date of birth, nationality, and country of residence</li>
          <li>Government-issued identification documents (passport, national ID card, or driver&rsquo;s license)</li>
          <li>Photographs or video for liveness verification</li>
          <li>Proof of address (utility bill, bank statement)</li>
          <li>Tax identification number where applicable</li>
        </UL>

        <h3 className="text-sm font-bold text-gray-800 mt-6 mb-2">2.2 Account &amp; Contact Data</h3>
        <UL>
          <li>Email address</li>
          <li>Username and encrypted password</li>
          <li>Two-factor authentication settings and backup methods</li>
          <li>IP addresses and device information</li>
          <li>Browser type, operating system, and access timestamps</li>
        </UL>

        <h3 className="text-sm font-bold text-gray-800 mt-6 mb-2">2.3 Financial &amp; Transaction Data</h3>
        <UL>
          <li>Wallet addresses and transaction history</li>
          <li>Deposit and withdrawal records</li>
          <li>Trading history (orders, fills, volume)</li>
          <li>Staking participation and reward history</li>
          <li>Bank account details for fiat processing</li>
          <li>Source of funds declaration where required</li>
        </UL>

        <h3 className="text-sm font-bold text-gray-800 mt-6 mb-2">2.4 Technical &amp; Usage Data</h3>
        <UL>
          <li>Log data (access times, pages viewed, actions taken)</li>
          <li>API usage patterns and rate limit events</li>
          <li>Cookies and similar tracking technologies (see Section 8)</li>
          <li>Device fingerprinting for fraud prevention</li>
        </UL>

        <H2>3. How We Use Your Data</H2>
        <h3 className="text-sm font-bold text-gray-800 mt-4 mb-2">3.1 Legal Obligations (GDPR Art. 6(1)(c))</h3>
        <UL>
          <li>KYC identity verification as required by Estonian FIU regulations</li>
          <li>Anti-money laundering (AML) and counter-terrorist financing (CTF) compliance</li>
          <li>Transaction monitoring and suspicious activity reporting</li>
          <li>Maintaining records for regulatory retention periods (minimum 5 years)</li>
          <li>Responding to lawful requests from regulatory authorities</li>
        </UL>

        <h3 className="text-sm font-bold text-gray-800 mt-4 mb-2">3.2 Contract Performance (GDPR Art. 6(1)(b))</h3>
        <UL>
          <li>Creating and maintaining your account</li>
          <li>Processing deposits, withdrawals, and trades</li>
          <li>Calculating and distributing staking rewards</li>
          <li>Providing customer support</li>
          <li>Enforcing our Terms of Service</li>
        </UL>

        <h3 className="text-sm font-bold text-gray-800 mt-4 mb-2">3.3 Legitimate Interests (GDPR Art. 6(1)(f))</h3>
        <UL>
          <li>Fraud detection and prevention</li>
          <li>Platform security monitoring and threat detection</li>
          <li>Improving and optimizing our Services</li>
          <li>Marketing communications (with consent where required)</li>
          <li>Internal analytics and reporting</li>
        </UL>

        <H2>4. Data Retention</H2>
        <P>
          We retain personal data only for as long as necessary to fulfill the purposes described in this Policy, unless
          a longer retention period is required by applicable law. In accordance with Estonian AML regulations, identity
          verification records and transaction data are retained for a minimum of five (5) years after termination of
          the business relationship.
        </P>

        <H2>5. Data Sharing &amp; Disclosure</H2>
        <P>We may share your personal data with:</P>
        <UL>
          <li><strong>Service Providers:</strong> Third-party vendors who assist us in providing the Services, including cloud hosting, KYC/identity verification, payment processing, and blockchain analytics. All providers are bound by data processing agreements (DPAs) per GDPR Art. 28.</li>
          <li><strong>Regulatory Authorities:</strong> The Estonian Financial Intelligence Unit (FIU), Data Protection Inspectorate, law enforcement agencies, and courts as required by applicable law.</li>
          <li><strong>Financial Institutions:</strong> Banking partners for fiat currency processing, subject to their own privacy policies.</li>
          <li><strong>Corporate Transactions:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred subject to appropriate safeguards.</li>
        </UL>
        <P>We do not sell your personal data to third parties.</P>

        <H2>6. International Data Transfers</H2>
        <P>
          Your personal data is primarily processed within the European Economic Area (EEA). Where we transfer data
          outside the EEA, we ensure appropriate safeguards are in place, including European Commission adequacy
          decisions, Standard Contractual Clauses (SCCs), or Binding Corporate Rules where applicable.
        </P>

        <H2>7. Your Rights</H2>
        <P>Under the GDPR, you have the following rights:</P>
        <UL>
          <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
          <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
          <li><strong>Right to Erasure:</strong> Request deletion, subject to legal retention obligations</li>
          <li><strong>Right to Restrict Processing:</strong> Limit processing in certain circumstances</li>
          <li><strong>Right to Data Portability:</strong> Receive data in a structured, machine-readable format</li>
          <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
          <li><strong>Right to Lodge a Complaint:</strong> File a complaint with the Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon) or your local authority</li>
        </UL>
        <P>To exercise your rights, contact us at <a href="mailto:dpo@novabit.exchange" className="text-blue-600 hover:underline">dpo@novabit.exchange</a>. We will respond within thirty (30) days.</P>

        <H2>8. Cookies &amp; Tracking Technologies</H2>
        <P>
          NovaBit uses essential cookies required for platform operation, including session management and security.
          We may also use analytics cookies to improve user experience. Non-essential cookies are placed only with
          your consent. You can manage cookie preferences through your browser settings.
        </P>

        <H2>9. Data Security</H2>
        <P>We implement appropriate technical and organizational measures to protect your personal data:</P>
        <UL>
          <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
          <li>Multi-factor authentication for administrative access</li>
          <li>Regular security audits and penetration testing</li>
          <li>Access controls and role-based permissions</li>
          <li>Incident response and breach notification procedures per GDPR Art. 33&amp;34</li>
        </UL>

        <H2>10. Automated Decision-Making</H2>
        <P>
          NovaBit may use automated decision-making for fraud detection, transaction monitoring, and risk scoring
          as required for AML compliance. Where such processing produces legal effects, you have the right to human
          intervention and to contest the decision under GDPR Art. 22.
        </P>

        <H2>11. Children&rsquo;s Privacy</H2>
        <P>
          Our Services are not directed to individuals under 18. We do not knowingly collect personal data from
          children and will delete any such information if discovered.
        </P>

        <H2>12. Changes to This Policy</H2>
        <P>
          We may update this Privacy Policy from time to time. Material changes will be communicated via email or
          platform notice. Continued use after modifications constitutes acceptance.
        </P>

        <H2>13. Contact &amp; Complaints</H2>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-4">
          <p className="text-gray-700 font-bold mb-1">Data Protection Officer</p>
          <p className="text-gray-500 text-sm">Email: <a href="mailto:dpo@novabit.exchange" className="text-blue-600 hover:underline">dpo@novabit.exchange</a></p>
          <p className="text-gray-500 text-sm mt-1">NovaBit Exchange O&Uuml;</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
          <p className="text-gray-700 font-bold mb-1">Estonian Data Protection Inspectorate</p>
          <p className="text-gray-500 text-sm">Andmekaitse Inspektsioon</p>
          <p className="text-gray-500 text-sm">V&auml;ike-Ameerika 19, 10129 Tallinn, Estonia</p>
          <p className="text-gray-500 text-sm">Phone: +372 627 4135 | <a href="https://www.aki.ee" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.aki.ee</a></p>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs text-gray-400">&copy; 2026 NovaBit Exchange O&Uuml;. All rights reserved. Registered in Estonia.</p>
        </div>
      </footer>
    </div>
  );
}