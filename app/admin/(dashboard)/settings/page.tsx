'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, Loader2, Settings } from 'lucide-react';

interface SettingsForm {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  aboutText: string;
}

const defaultForm: SettingsForm = {
  businessName: '',
  address: '',
  phone: '',
  email: '',
  instagram: '',
  facebook: '',
  aboutText: '',
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setForm({
          businessName: data.businessName || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          aboutText: data.aboutText || '',
        });
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-14 lg:pt-0 flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#6a8a5b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-14 lg:pt-0 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#6a8a5b]/15 flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#6a8a5b]" />
        </div>
        <div>
          <h1
            className="text-white text-2xl font-bold"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Settings
          </h1>
          <p className="text-white/40 text-sm">Manage your business information</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Info */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5 text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
            Business Information
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="settings-business-name" className="block text-white/60 text-sm mb-1.5">Business Name</label>
              <input
                id="settings-business-name"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor="settings-address" className="block text-white/60 text-sm mb-1.5">Address</label>
              <input
                id="settings-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Sweet Lane, Bakery District, CA 90210"
                className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="settings-phone" className="block text-white/60 text-sm mb-1.5">Phone</label>
                <input
                  id="settings-phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="settings-email" className="block text-white/60 text-sm mb-1.5">Email</label>
                <input
                  id="settings-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="hello@bakery.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5 text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
            Social Media
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="settings-instagram" className="block text-white/60 text-sm mb-1.5">Instagram URL</label>
              <input
                id="settings-instagram"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/yourbakery"
                className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor="settings-facebook" className="block text-white/60 text-sm mb-1.5">Facebook URL</label>
              <input
                id="settings-facebook"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourbakery"
                className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* About Text */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5 text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
            About Text
          </h2>
          <textarea
            id="settings-about"
            name="aboutText"
            value={form.aboutText}
            onChange={handleChange}
            rows={5}
            placeholder="Tell your brand story..."
            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#6a8a5b]/60 resize-none"
          />
          <p className="text-white/30 text-xs mt-2">Displayed in the footer and about section.</p>
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          id="save-settings-btn"
          className="flex items-center gap-2 px-6 py-3.5 bg-[#6a8a5b] text-[#ffffff] rounded-xl font-bold text-sm hover:bg-[#58764a] transition-colors disabled:opacity-60 min-h-[44px]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
