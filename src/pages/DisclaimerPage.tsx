import React from 'react';
import { ShieldAlert, AlertTriangle, Scale, Lock, BookOpen } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
          <span>Legal & Regulatory Disclaimers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Disclaimer & Terms of Use
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Please read this notice carefully before browsing or accessing external application links.
        </p>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-10 shadow-xs space-y-8 text-gray-700 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
            <BookOpen className="w-5 h-5 text-purple-700 flex-shrink-0" />
            <h2>1. Informational Directory Purpose Only</h2>
          </div>
          <p>
            Yono Bonus Link operates exclusively as an online informational indexing portal. The content, links, and descriptions hosted on this website are provided solely for educational, reference, and informational purposes. Yono Bonus Link is not an operator, publisher, game developer, or financial facilitator of any third-party app listed herein.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h2>2. No Guaranteed Earnings or Investment Advice</h2>
          </div>
          <p>
            Yono Bonus Link strictly makes <strong>NO claims, representations, or warranties</strong> that any user will earn money, receive guaranteed income, or achieve specific rewards by downloading or participating in any listed application.
          </p>
          <p>
            All bonuses, referral programs, rewards, coin values, and promotional rewards are determined solely by the respective third-party publishers and are subject to their independent terms and conditions, wagering requirements, and expiration dates.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
            <Scale className="w-5 h-5 text-purple-700 flex-shrink-0" />
            <h2>3. Age and Jurisdictional Restrictions (18+ Strictly)</h2>
          </div>
          <p>
            Certain applications (such as card games, rummy, fantasy sports, or skill-based contests) may involve real-money entry fees or financial risk. Access to such applications is strictly restricted to individuals aged <strong>18 years or older</strong>.
          </p>
          <p>
            Real-money gaming or skill contests may be prohibited or restricted under local laws in certain jurisdictions (including, but not limited to, the Indian states of Andhra Pradesh, Assam, Nagaland, Odisha, Sikkim, and Telangana, or other restricted global jurisdictions). Users are solely responsible for ensuring that their access to any listed application complies with all local, state, and federal laws in their place of residence.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <h2>4. Responsible Gaming & Financial Risk</h2>
          </div>
          <p>
            Participating in real-money games or wagering involves financial risk and may lead to addiction or financial loss. We strongly encourage all users to practice responsible gaming, set deposit and time limits, and never play with funds they cannot afford to lose. If you or someone you know is experiencing gaming-related difficulties, please seek guidance from professional support organizations.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
            <Lock className="w-5 h-5 text-purple-700 flex-shrink-0" />
            <h2>5. Absolute Security & Anti-Phishing Advisory</h2>
          </div>
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 text-purple-950 text-xs sm:text-sm font-medium">
            <strong>Important Safety Notice:</strong> Yono Bonus Link will NEVER request your personal banking passwords, One-Time Passwords (OTPs), UPI PINs, Aadhaar numbers, PAN cards, or payment credentials. Beware of fraudulent impostors on social media. Always ensure you are on our verified domain.
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
            <Scale className="w-5 h-5 text-purple-700 flex-shrink-0" />
            <h2>6. Third-Party Links & Intellectual Property</h2>
          </div>
          <p>
            When you click &ldquo;Visit Official Website&rdquo; or any link on this site, you leave Yono Bonus Link and navigate to an external website governed by that third party&rsquo;s privacy policy and terms. All product names, logos, registered trademarks, and brands are property of their respective owners and are used here only for identification purposes.
          </p>
        </section>
      </div>
    </div>
  );
};
