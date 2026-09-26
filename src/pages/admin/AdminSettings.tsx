import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Settings, Save, Check, Globe, Send, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [siteName, setSiteName] = useState(settings.siteName || 'Yono Bonus Link');
  const [siteDescription, setSiteDescription] = useState(settings.siteDescription || '');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [telegramUrl, setTelegramUrl] = useState(settings.telegramUrl || '');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || '');
  const [heroHeading, setHeroHeading] = useState(settings.heroHeading || 'Latest Bonus & Earning Apps');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || 'Explore the latest apps, offers and official links in one place.');
  const [responsibleGamingNotice, setResponsibleGamingNotice] = useState(
    settings.responsibleGamingNotice || ''
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setSiteName(settings.siteName || 'Yono Bonus Link');
      setSiteDescription(settings.siteDescription || '');
      setLogoUrl(settings.logoUrl || '');
      setTelegramUrl(settings.telegramUrl || '');
      setContactEmail(settings.contactEmail || '');
      setHeroHeading(settings.heroHeading || 'Latest Bonus & Earning Apps');
      setHeroSubtitle(settings.heroSubtitle || 'Explore the latest apps, offers and official links in one place.');
      setResponsibleGamingNotice(settings.responsibleGamingNotice || '');
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSettings({
        siteName: siteName.trim(),
        siteDescription: siteDescription.trim(),
        logoUrl: logoUrl.trim(),
        telegramUrl: telegramUrl.trim(),
        contactEmail: contactEmail.trim(),
        heroHeading: heroHeading.trim(),
        heroSubtitle: heroSubtitle.trim(),
        responsibleGamingNotice: responsibleGamingNotice.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Website Configuration
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Customize branding, official social links, hero texts, and compliance notices.
          </p>
        </div>

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
          {/* General Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <Globe className="w-4 h-4 text-purple-700" />
              <h3>Site Identity</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Website Name *
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Custom Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Website Meta Description
              </label>
              <textarea
                rows={2}
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <Send className="w-4 h-4 text-purple-700" />
              <h3>Contact & Telegram</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Official Telegram Channel URL
                </label>
                <input
                  type="url"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  placeholder="https://t.me/Job_wala_Akash"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Controls the "Join Telegram" button across the header, footer, and dedicated page.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Contact Support Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="support@yonobonuslink.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>
            </div>
          </div>

          {/* Hero Section Texts */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <h3>Homepage Hero Content</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Hero Heading
                </label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>
            </div>
          </div>

          {/* Responsible Gaming Notice */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-purple-700" />
              <h3>Responsible Gaming & Global Legal Notice</h3>
            </div>

            <div>
              <textarea
                rows={3}
                value={responsibleGamingNotice}
                onChange={(e) => setResponsibleGamingNotice(e.target.value)}
                placeholder="Notice displayed on the bottom bar of every page..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-700/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
