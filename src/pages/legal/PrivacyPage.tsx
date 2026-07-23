import { Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors">
            <Lock size={20} />
            <span className="font-bold">NovaBit Exchange</span>
          </Link>
          <Link to="/terms" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Terms of Service →
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-3 flex items-center gap-3">
            <Shield size={28} className="text-blue-600" />
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">Last updated: July 14, 2026</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-10 text-sm text-blue-800 leading-relaxed">
          <strong>Our Commitment:</strong> NovaBit Exchange OÜ ("NovaBit", "we", "our") is committed to protecting your privacy and handling your personal data transparently and in compliance with the EU General Data Protection Regulation (GDPR) and Estonian data protection laws. This Privacy Policy explains what data we collect, how we use it, and your rights.
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <Section id="controller" title="1. Data Controller">
            <p>
              <strong>Data Controller:</strong> NovaBit Exchange OÜ<br />
              <strong>Registered in:</strong> Republic of Estonia<br />
              <strong>Email:</strong> privacy@novabit.exchange
            </p>
            <p>
              For GDPR purposes, NovaBit Exchange OÜ is the data controller for all personal data collected through our platform. If you have questions about your data, contact us at the email above.
            </p>
          </Section>

          <Section id="collection" title="2. Information We Collect">
            <p>We collect the following categories of personal data:</p>

            <h3 className="font-bold text-gray-800 text-sm mt-4">a) Account Information</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address</li>
              <li>Full name (first and last)</li>
              <li>Date of birth</li>
              <li>Nationality</li>
              <li>Residential address (street, city, postal code, country)</li>
            </ul>

            <h3 className="font-bold text-gray-800 text-sm mt-4">b) KYC Verification Data</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Government-issued ID (passport, driver's license, or national ID card) — front image</li>
              <li>Selfie photograph with ID</li>
              <li>KYC verification status (unverified, pending, verified, rejected)</li>
              <li>Verification date and rejection reasons (if applicable)</li>
            </ul>

            <h3 className="font-bold text-gray-800 text-sm mt-4">c) Technical & Usage Data</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>IP address</li>
              <li>Browser type and version, operating system</li>
              <li>Device information (type, model)</li>
              <li>Access times and pages visited</li>
              <li>Login timestamps</li>
            </ul>

            <h3 className="font-bold text-gray-800 text-sm mt-4">d) Transaction & Trading Data</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Trading activity (orders, fills, cancellations)</li>
              <li>Deposit and withdrawal records</li>
              <li>Wallet balances and transaction history</li>
              <li>Staking positions and rewards</li>
            </ul>
          </Section>

          <Section id="usage" title="3. How We Use Your Data">
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Service Provision:</strong> To create and maintain your account, execute trades, process deposits and withdrawals, and provide staking services</li>
              <li><strong>Legal Compliance:</strong> To fulfill our obligations under Estonian AML/KYC laws, including identity verification, transaction monitoring, and reporting to the Estonian Financial Intelligence Unit (FIU)</li>
              <li><strong>Security & Fraud Prevention:</strong> To protect your account, detect and prevent fraudulent activity, and maintain platform security</li>
              <li><strong>Communication:</strong> To send service-related notifications, security alerts, and account updates. We do not send marketing emails without consent</li>
              <li><strong>Platform Improvement:</strong> To analyze usage patterns and improve our services</li>
            </ul>
          </Section>

          <Section id="legal-basis" title="4. Legal Basis for Processing">
            <p>Under GDPR, we process your personal data on the following legal bases:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contract Performance (Art. 6(1)(b)):</strong> Processing necessary to provide our exchange services under our Terms of Service</li>
              <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> Processing required by Estonian AML/KYC regulations and FIU reporting requirements</li>
              <li><strong>Legitimate Interest (Art. 6(1)(f)):</strong> Processing for fraud prevention, security monitoring, and platform improvement</li>
              <li><strong>Consent (Art. 6(1)(a)):</strong> Where you have given specific consent (e.g., optional communications)</li>
            </ul>
          </Section>

          <Section id="sharing" title="5. Data Sharing & Third Parties">
            <p>We share your data only as necessary and in compliance with applicable law:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Estonian Financial Intelligence Unit (FIU):</strong> Suspicious transaction reports as required by AML law</li>
              <li><strong>Identity Verification Providers:</strong> Third-party services that assist in verifying identity documents (data processed under strict data processing agreements)</li>
              <li><strong>Payment & Banking Partners:</strong> For fiat deposit and withdrawal processing</li>
              <li><strong>Cloud Infrastructure:</strong> Hosting providers (Render, Cloudflare) — data stored and processed within EU/EEA</li>
              <li><strong>Legal Authorities:</strong> When required by court order, subpoena, or other legal process</li>
            </ul>
            <p>
              We never sell your personal data to third parties for marketing purposes.
            </p>
          </Section>

          <Section id="retention" title="6. Data Retention">
            <p>
              We retain your personal data only as long as necessary:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Data + KYC:</strong> For the duration of your account plus 5 years after account closure, as required by Estonian AML law (Money Laundering and Terrorist Financing Prevention Act)</li>
              <li><strong>Transaction Records:</strong> 5 years from the date of the transaction</li>
              <li><strong>Technical Logs:</strong> 12 months for security and operational purposes</li>
              <li><strong>Audit Logs:</strong> 5 years for compliance audit trails</li>
            </ul>
            <p>
              After retention periods expire, data is securely deleted or anonymized.
            </p>
          </Section>

          <Section id="rights" title="7. Your Rights (GDPR)">
            <p>As a data subject under GDPR, you have the following rights:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Right of Access:</strong> Request a copy of your personal data we hold</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your data, subject to legal retention obligations</li>
              <li><strong>Right to Restriction:</strong> Limit how we process your data in certain circumstances</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time for processing based on consent</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <strong>privacy@novabit.exchange</strong>. We will respond within 30 days as required by GDPR. You also have the right to lodge a complaint with the Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon) or your local EU data protection authority.
            </p>
          </Section>

          <Section id="cookies" title="8. Cookies & Tracking">
            <p>
              NovaBit uses only essential cookies necessary for platform operation:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Authentication:</strong> Session tokens to keep you logged in</li>
              <li><strong>Security:</strong> CSRF protection tokens</li>
            </ul>
            <p>
              We do not use tracking cookies, analytics cookies, or advertising cookies. No third-party trackers are loaded on our platform.
            </p>
          </Section>

          <Section id="security" title="9. Data Security">
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
              <li>Cold storage for the majority of digital assets</li>
              <li>Two-factor authentication (2FA) support</li>
              <li>Role-based access controls with principle of least privilege</li>
              <li>Regular security audits and penetration testing</li>
              <li>Immutable audit logging for all compliance-relevant actions</li>
            </ul>
            <p>
              While we take extensive precautions, no system is 100% secure. You play an important role — use strong passwords, enable 2FA, and never share your credentials.
            </p>
          </Section>

          <Section id="transfers" title="10. International Data Transfers">
            <p>
              Your personal data is stored and processed on servers located within the European Union / European Economic Area (EU/EEA). We do not transfer personal data outside the EU/EEA unless adequate safeguards are in place (such as Standard Contractual Clauses or an adequacy decision by the European Commission).
            </p>
          </Section>

          <Section id="changes" title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Material changes will be communicated via email or platform notification at least 14 days before taking effect. The "Last updated" date at the top of this page reflects the most recent revision.
            </p>
          </Section>

          <Section id="contact-privacy" title="12. Contact & Complaints">
            <p>
              For privacy-related inquiries or to exercise your data rights:
            </p>
            <p>
              <strong>Email:</strong> privacy@novabit.exchange<br />
              <strong>Postal:</strong> NovaBit Exchange OÜ, Estonia
            </p>
            <p className="mt-4 text-gray-500 italic">
              You have the right to lodge a complaint with the Estonian Data Protection Inspectorate at{' '}
              <a href="https://www.aki.ee" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">www.aki.ee</a> if you believe your data rights have been violated.
            </p>
          </Section>
        </div>

        <p className="text-xs text-gray-400 text-center mt-10">
          © {new Date().getFullYear()} NovaBit Exchange OÜ. All rights reserved.
        </p>
      </div>
    </div>
  );
}
