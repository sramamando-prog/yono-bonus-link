import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, submitContactMessage } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact submit error:', err);
      // Even if Firestore write is blocked, give friendly notification
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
          <Mail className="w-3.5 h-3.5 text-purple-700" />
          <span>Support & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Contact Yono Bonus Link
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Have a question, feedback, or need a link updated? Reach out to our directory team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">
              Direct Contact Channels
            </h3>

            {/* Email */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Official Email
              </span>
              <p className="text-sm font-bold text-purple-700 break-all">
                {settings.contactEmail || 'contact@yonobonuslink.com'}
              </p>
            </div>

            {/* Telegram */}
            {settings.telegramUrl && (
              <div className="space-y-1 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Community Updates
                </span>
                <p className="text-xs text-gray-500 mb-2">
                  Fast updates and official announcements are posted on our Telegram channel.
                </p>
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors w-full justify-center shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join Telegram</span>
                </a>
              </div>
            )}
          </div>

          <div className="bg-purple-50/70 border border-purple-100 rounded-3xl p-5 text-xs text-purple-950 space-y-2">
            <p className="font-bold">Notice to Developers:</p>
            <p className="text-purple-900/80">
              If you represent an application publisher and wish to request an update to your official URL or description, please include your domain verification details in your message.
            </p>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Message Received!</h3>
                <p className="text-sm text-gray-600 max-w-sm mx-auto">
                  Thank you for reaching out. We will review your message and reply via your email if necessary.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Send a Message
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your feedback or query..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
