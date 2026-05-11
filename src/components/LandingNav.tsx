'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Button from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-border shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <AppLogo size={34} />
          <span className="font-bold text-xl tracking-tight text-foreground">
            DmGo
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks?.map((link) => (
            <a
              key={`nav-${link?.label}`}
              href={link?.href}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
            >
              {link?.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-up-login-screen">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up-login-screen">
            <Button size="sm">Get Started Free</Button>
          </Link>
        </div>

        <button
          className="md:hidden btn-ghost p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-2 animate-slide-down">
          {navLinks?.map((link) => (
            <a
              key={`mobile-nav-${link?.label}`}
              href={link?.href}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link?.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-border">
            <Link href="/sign-up-login-screen">
              <Button variant="outline" fullWidth>
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up-login-screen">
              <Button fullWidth>Get Started Free</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}