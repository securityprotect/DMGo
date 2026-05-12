import React from 'react';

import AppLogo from '@/components/ui/AppLogo';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Press Kit', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <AppLogo size={32} />
              <span className="font-bold text-lg text-foreground">DmGo</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The Instagram DM automation platform built for creators and
              marketers who want to grow without the grind.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {['Twitter', 'Instagram', 'LinkedIn']?.map((social) => (
                <a
                  key={`footer-social-${social}`}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary-light hover:text-primary transition-all duration-150 text-xs font-bold"
                  aria-label={social}
                >
                  {social?.[0]}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks)?.map(([category, links]) => (
            <div key={`footer-cat-${category}`}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links?.map((link) => (
                  <li key={`footer-link-${link?.label}`}>
                    <a
                      href={link?.href}
                      className="text-sm text-foreground hover:text-primary transition-colors duration-150"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            (c) 2026 DmGo Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Not affiliated with Meta or Instagram.
          </p>
        </div>
      </div>
    </footer>
  );
}

