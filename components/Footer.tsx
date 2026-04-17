import Image from 'next/image';
import { Cake, Globe, Link2, Phone, Mail, MapPin } from 'lucide-react';

interface SettingsData {
  businessName?: string;
  address?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
}

async function getSettings(): Promise<SettingsData> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/settings`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function Footer() {
  const settings = await getSettings();

  const businessName = settings.businessName || 'Corazón Cakes';
  const address = settings.address || '123 Sweet Lane, Bakery District, CA';
  const phone = settings.phone || '+1 (555) 123-4567';
  const email = settings.email || 'hello@corazoncakes.com';
  const instagram = settings.instagram || '#';
  const facebook = settings.facebook || '#';

  return (
    <footer className="bg-[#1a1a1a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#6a8a5b]/20">
                <Image src="/logo.png" alt="Corazón Cakes Logo" fill className="object-cover" />
              </div>
              <span
                className="text-white text-xl font-semibold"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {businessName}
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
              Artisan cakes made with love, premium ingredients, and a passion for creating unforgettable moments. Every bite tells a story.
            </p>
            <div className="flex gap-3">
              <a
                href={instagram}
                id="footer-instagram-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:text-[#6a8a5b] hover:bg-[#6a8a5b]/15 transition-colors min-h-[44px] min-w-[44px]"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={facebook}
                id="footer-facebook-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:text-[#6a8a5b] hover:bg-[#6a8a5b]/15 transition-colors min-h-[44px] min-w-[44px]"
              >
                <Link2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Cake Menu', href: '/menu' },
                { label: 'Place an Order', href: '/#order' },
                { label: 'About Us', href: '/#about' },
                { label: 'Contact', href: '/#contact' },
                { label: 'Admin', href: '/admin/login' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/40 text-sm hover:text-[#6a8a5b] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">Contact</h4>
            <div className="space-y-4">
              {address && (
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-[#6a8a5b] flex-shrink-0 mt-0.5" />
                  <span className="text-white/40 text-sm">{address}</span>
                </div>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="flex gap-3 group">
                  <Phone className="w-4 h-4 text-[#6a8a5b] flex-shrink-0 mt-0.5" />
                  <span className="text-white/40 text-sm group-hover:text-[#6a8a5b] transition-colors">
                    {phone}
                  </span>
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex gap-3 group">
                  <Mail className="w-4 h-4 text-[#6a8a5b] flex-shrink-0 mt-0.5" />
                  <span className="text-white/40 text-sm group-hover:text-[#6a8a5b] transition-colors">
                    {email}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Made with ❤️ for every sweet occasion
          </p>
        </div>
      </div>
    </footer>
  );
}
