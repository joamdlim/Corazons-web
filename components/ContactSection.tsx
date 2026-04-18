'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Loader2, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+63 942 446 8493',
    href: 'tel:+639424468493',
    color: 'bg-[#6a8a5b]/15',
    iconColor: 'text-[#6a8a5b]',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'hello@corazoncakes.com',
    href: 'mailto:hello@corazoncakes.com',
    color: 'bg-[#a8c5a0]/15',
    iconColor: 'text-[#a8c5a0]',
  },
];

export default function ContactSection({ settings }: { settings?: any }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send message');
      toast.success('💌 Message sent! We\'ll reply within 24 hours.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#6a8a5b] text-sm font-semibold tracking-widest uppercase mb-3">
            Reach Out
          </p>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            {settings?.contactHeadline || 'Get in Touch'}
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base whitespace-pre-wrap">
            {settings?.contactSubtext || "Have questions about a custom order? We'd love to hear from you."}
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <span className="w-12 h-0.5 bg-[#6a8a5b] rounded-full" />
            <span className="w-3 h-0.5 bg-[#6a8a5b]/40 rounded-full" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact Info + Map */}
          <div className="flex flex-col gap-6">
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map(({ icon: Icon, label, value, href, color, iconColor }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex flex-col gap-3 p-6 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#6a8a5b]/30 rounded-2xl transition-all duration-300 min-h-[44px]"
                >
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-medium tracking-wide mb-1">{label}</p>
                    <p className="text-white font-semibold text-sm group-hover:text-[#6a8a5b] transition-colors">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map / Location Card */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6a8a5b]/15 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#6a8a5b]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Our Location</p>
                    <p className="text-white/50 text-xs">171 Nazareth, Lanang, Davao City</p>
                  </div>
                </div>
              </div>
              {/* Live Google Maps embed */}
              <div className="relative h-56">
                <iframe
                  src="https://maps.google.com/maps?q=7.1095941,125.6317483&hl=en&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Corazón Cakes Location"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex gap-4 text-xs text-white/40">
                  <span>Mon–Sat: 8am–7pm</span>
                  <span>·</span>
                  <span>Sun: 9am–5pm</span>
                </div>
                <a
                  href="https://maps.app.goo.gl/oZz4dhxd6fzy2Vmp8"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="get-directions-btn"
                  className="text-[#6a8a5b] text-xs hover:underline shrink-0"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3
              className="text-white font-semibold text-xl mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="contact-name" className="block text-white/60 text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                  className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 focus:ring-2 focus:ring-[#6a8a5b]/15 transition-all text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-white/60 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@email.com"
                  required
                  className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 focus:ring-2 focus:ring-[#6a8a5b]/15 transition-all text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-white/60 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your special occasion..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#6a8a5b]/60 focus:ring-2 focus:ring-[#6a8a5b]/15 transition-all text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                id="contact-submit-btn"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#6a8a5b] text-[#ffffff] rounded-full font-bold hover:bg-[#58764a] transition-all duration-300 hover:shadow-xl hover:shadow-pink-400/20 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
