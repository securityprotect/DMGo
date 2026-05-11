'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 'faq-001',
    q: 'Is DmGo safe to use with my Instagram account?',
    a: 'Yes. DmGo is built on the official Instagram Graph API, meaning all actions go through Meta\'s approved channels. We implement smart rate limiting, per-user cooldowns, and safety buffers to keep your account within Instagram\'s guidelines.',
  },
  {
    id: 'faq-002',
    q: 'How fast does DmGo send a DM after a keyword comment?',
    a: 'Typically within 5–15 seconds of the comment being detected. Instagram webhook delivery can introduce slight delays during peak hours, but our queue system ensures no triggers are missed.',
  },
  {
    id: 'faq-003',
    q: 'Can I use the same keyword across multiple reels?',
    a: 'Absolutely. You can create one automation and assign it to multiple reels, or create separate automations per reel with different reply templates. Keywords are scoped per automation so you have full control.',
  },
  {
    id: 'faq-004',
    q: 'What happens if a DM fails to send?',
    a: 'Failed DMs are logged with a reason code (token expired, rate limit, user blocked DMs). You can retry individual DMs from the Live Activity feed, or enable auto-retry in your automation settings.',
  },
  {
    id: 'faq-005',
    q: 'Can I personalize the DM with the commenter\'s name?',
    a: 'Yes. Use template variables like {{first_name}} and {{username}} in your reply template. DmGo fills them in automatically from the commenter\'s profile data.',
  },
  {
    id: 'faq-006',
    q: 'Do I need to keep DmGo open for automations to run?',
    a: 'No. DmGo runs entirely in the cloud. Once your automation is active, it runs 24/7 on our servers. You only open the app to review results and make changes.',
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('faq-001');

  return (
    <section id="faq" className="py-24 gradient-bg-pearl">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-3">FAQ</p>
          <h2 className="text-hero-md font-extrabold text-foreground mb-4">
            Questions? We have answers.
          </h2>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs?.map((faq) => {
            const isOpen = openId === faq?.id;
            return (
              <div
                key={faq?.id}
                className={`card border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-primary/30 shadow-card-md' : 'hover:border-primary/20'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq?.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {faq?.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 animate-slide-down">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq?.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}