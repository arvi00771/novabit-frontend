import { Link } from 'react-router-dom';
import { Shield, Scale, FileText } from 'lucide-react';

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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={16} />
            </div>
            <span className="font-black text-lg tracking-tighter text-blue-600">NovaBit</span>
          </Link>
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Scale size={20} className="text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Last updated: {LAST_UPDATED} · Effective date: {LAST_UPDATED}
          </p>
        </div>

        <P>
          Welcome to NovaBit Exchange. These Terms of Service ("Terms") govern your access to and use of the NovaBit
          platform, including our website, mobile applications, APIs, and any related services (collectively, the
          "Services"), operated by <strong>NovaBit Exchange OÜ</strong>, a private limited company registered in the
          Republic of Estonia (registry code: pending, registered address: Tallinn, Estonia).
        </P>

        <P>
          By creating an account, accessing, or using our Services, you agree to be bound by these Terms. If you do
          not agree to these Terms, you must not access or use the Services. Please read these Terms carefully
          before using NovaBit.
        </P>

        <H2>1. Definitions</H2>
        <P>
          <strong>"NovaBit,"</strong> <strong>"we,"</strong> <strong>"us,"</strong> or <strong>"our"</strong> refers
          to NovaBit Exchange OÜ, a company incorporated under the laws of Estonia.
        </P>
        <P>
          <strong>"User,"</strong> <strong>"you,"</strong> or <strong>"your"</strong> refers to any individual or
          entity that accesses or uses the Services.
        </P>
        <P>
          <strong>"Digital Assets"</strong> means cryptocurrencies, tokens, stablecoins, and any other digital
          representation of value supported on the NovaBit platform.
        </P>
        <P>
          <strong>"Fiat Currency"</strong> means government-issued legal tender (such as EUR, USD) supported for
          deposit or withdrawal on the platform.
        </P>

        <H2>2. Eligibility</H2>
        <P>To use NovaBit, you must:</P>
        <UL>
          <li>Be at least 18 years of age;</li>
          <li>Have the legal capacity to enter into a binding agreement;</li>
          <li>Not be a resident of any jurisdiction where our Services are restricted or prohibited by applicable law, including but not limited to jurisdictions subject to sanctions by the European Union, United Nations, or OFAC;</li>
          <li>Not be listed on any trade or economic sanctions list;</li>
          <li>Provide accurate, current, and complete information during registration and KYC verification.</li>
        </UL>

        <H2>3. Account Registration & Security</H2>
        <P>
          You must create an account to access most features. You are responsible for maintaining the
          confidentiality of your login credentials and for all activities that occur under your account.
          NovaBit strongly recommends enabling two-factor authentication (2FA) to secure your account.
        </P>
        <P>
          You must notify us immediately of any unauthorized use of your account or any other breach of security.
          NovaBit will not be liable for any loss or damage arising from your failure to comply with this section.
        </P>

        <H2>4. Know Your Customer (KYC) & AML Compliance</H2>
        <P>
          NovaBit Exchange OÜ is registered with the Estonian Financial Intelligence Unit (FIU) as a virtual
          currency service provider. In compliance with Estonian and European Union anti-money laundering (AML)
          regulations, we are required to:
        </P>
        <UL>
          <li>Verify the identity of all users through our KYC process;</li>
          <li>Collect and verify identity documents (passport, national ID, or driver's license);</li>
          <li>Monitor transactions for suspicious activity;</li>
          <li>Report suspicious transactions to the Estonian FIU as required by law;</li>
          <li>Maintain records of user identity and transactions for a minimum of five years.</li>
        </UL>
        <P>
          Access to deposit, withdrawal, and trading features is conditional upon successful completion of KYC
          verification. NovaBit reserves the right to reject any KYC submission, suspend accounts pending
          verification, or restrict services at its sole discretion to comply with legal obligations.
        </P>

        <H2>5. Services Description</H2>
        <P>NovaBit provides the following services, subject to these Terms:</P>
        <UL>
          <li><strong>Spot Trading:</strong> Purchase and sale of Digital Assets for other Digital Assets or Fiat Currency;</li>
          <li><strong>Wallet Services:</strong> Custodial wallets for storing Digital Assets on the platform;</li>
          <li><strong>Deposits & Withdrawals:</strong> Fiat currency deposits via SEPA bank transfer and Digital Asset deposits/withdrawals;</li>
          <li><strong>Staking:</strong> Participation in proof-of-stake networks and yield-generating products;</li>
          <li><strong>API Access:</strong> Programmatic access to trading and market data features.</li>
        </UL>

        <H2>6. Fees</H2>
        <P>
          NovaBit charges trading fees on executed orders. Our current fee schedule is available on the platform
          and may be updated from time to time. By using the Services, you agree to pay all applicable fees.
          NovaBit reserves the right to change its fee structure with reasonable notice to users.
        </P>
        <P>
          Network fees (gas fees, blockchain transaction fees) for deposits and withdrawals are typically borne by
          the user and are not controlled by NovaBit.
        </P>

        <H2>7. Prohibited Activities</H2>
        <P>You agree not to use the Services for:</P>
        <UL>
          <li>Money laundering, terrorist financing, or any other illegal activity;</li>
          <li>Market manipulation, including wash trading, spoofing, or layering;</li>
          <li>Fraud, scams, or deceptive practices;</li>
          <li>Violating any applicable laws, regulations, or sanctions;</li>
          <li>Attempting to gain unauthorized access to our systems or other users' accounts;</li>
          <li>Using automated means to scrape, harvest, or otherwise extract data from the platform without permission;</li>
          <li>Transmitting malware, viruses, or other harmful code.</li>
        </UL>

        <H2>8. Risk Disclosure</H2>
        <P>
          Trading Digital Assets involves significant risk and can result in the complete loss of your capital.
          Digital Asset prices are highly volatile and can fluctuate dramatically in short periods.
          You should carefully consider whether trading or holding Digital Assets is suitable for you in light of
          your financial condition.
        </P>
        <P>
          NovaBit does not provide investment, tax, or legal advice. You are solely responsible for your trading
          decisions. Past performance is not indicative of future results.
        </P>

        <H2>9. Limitation of Liability</H2>
        <P>
          To the maximum extent permitted by applicable law, NovaBit Exchange OÜ, its directors, officers,
          employees, and affiliates shall not be liable for any indirect, incidental, special, consequential,
          or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising
          out of or in connection with your use of the Services.
        </P>
        <P>
          NovaBit's total aggregate liability to you for any claim arising out of these Terms or your use of
          the Services shall not exceed the total fees paid by you to NovaBit in the twelve (12) months
          immediately preceding the event giving rise to the claim.
        </P>
        <P>
          Nothing in these Terms excludes or limits our liability for death or personal injury caused by our
          negligence, fraud, or any other liability that cannot be excluded or limited by applicable law.
        </P>

        <H2>10. Intellectual Property</H2>
        <P>
          All content, trademarks, logos, software, and other intellectual property on the NovaBit platform
          are owned by or licensed to NovaBit Exchange OÜ. You may not copy, modify, distribute, or create
          derivative works without our prior written consent.
        </P>

        <H2>11. Termination & Suspension</H2>
        <P>
          NovaBit may suspend or terminate your account at any time, with or without cause, including but not
          limited to violation of these Terms, failure to complete KYC, suspicious activity, or as required by
          applicable law. Upon termination, you must cease all use of the Services. Any Digital Assets held in
          your account may be returned to you after the deduction of any outstanding fees and subject to
          applicable regulatory requirements.
        </P>

        <H2>12. Data Protection</H2>
        <P>
          Our collection and processing of personal data is governed by our Privacy Policy, which is
          incorporated into these Terms by reference. By using the Services, you consent to the collection
          and processing of your data as described in the Privacy Policy, in compliance with the EU General
          Data Protection Regulation (GDPR) and applicable Estonian data protection laws.
        </P>

        <H2>13. Governing Law & Dispute Resolution</H2>
        <P>
          These Terms shall be governed by and construed in accordance with the laws of the Republic of
          Estonia. Any dispute arising out of or in connection with these Terms shall be subject to the
          exclusive jurisdiction of the courts of Harju County, Estonia.
        </P>
        <P>
          In the event of a dispute, you agree to first attempt to resolve the matter informally by contacting us
          at <a href="mailto:legal@novabit.exchange" className="text-blue-600 hover:underline">legal@novabit.exchange</a>.
        </P>

        <H2>14. Amendments</H2>
        <P>
          NovaBit reserves the right to modify these Terms at any time. We will notify users of material changes
          via email or through the platform. Continued use of the Services after such modifications constitutes
          acceptance of the updated Terms. If you do not agree to the changes, you must stop using the Services.
        </P>

        <H2>15. Contact</H2>
        <P>
          For questions regarding these Terms of Service, please contact us at:
        </P>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
          <p className="text-gray-700 font-bold mb-1">NovaBit Exchange OÜ</p>
          <p className="text-gray-500 text-sm">Reg. code: pending</p>
          <p className="text-gray-500 text-sm">Registered in the Republic of Estonia</p>
          <p className="text-gray-500 text-sm mt-2">
            Email: <a href="mailto:legal@novabit.exchange" className="text-blue-600 hover:underline">legal@novabit.exchange</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs text-gray-400">
            © 2026 NovaBit Exchange OÜ. All rights reserved. Registered in Estonia.
          </p>
        </div>
      </footer>
    </div>
  );
}