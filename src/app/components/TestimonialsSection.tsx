import React from 'react';
import AppImage from '@/components/ui/AppImage';

const testimonials = [
  {
    id: 'testi-001',
    name: 'Aisha Kamara',
    handle: '@aishacreates',
    role: 'Fitness Creator · 280K followers',
    avatar: 'https://i.pravatar.cc/80?img=47',
    avatarAlt: 'Young Black woman smiling in workout gear, fitness creator profile photo',
    quote:
      'I set up my first automation in under 10 minutes. Now every time I post a reel about my program, the DMs handle themselves. I went from manually replying 3 hours a day to zero.',
    stats: '+1,240 DMs/week',
  },
  {
    id: 'testi-002',
    name: 'Carlos Vega',
    handle: '@carlosvegamx',
    role: 'Digital Marketer · Agency Owner',
    avatar: 'https://i.pravatar.cc/80?img=12',
    avatarAlt: 'Hispanic man in business casual shirt, professional headshot',
    quote:
      'Managing 8 client accounts from one dashboard is a game changer. The analytics help me show ROI to clients. DmGo is now in every proposal I write.',
    stats: '8 accounts managed',
  },
  {
    id: 'testi-003',
    name: 'Priya Nair',
    handle: '@priyawellness',
    role: 'Wellness Coach · 95K followers',
    avatar: 'https://i.pravatar.cc/80?img=31',
    avatarAlt: 'Indian woman in light clothing outdoors, wellness coach profile photo',
    quote:
      'The cooldown feature is what sold me. My account never got flagged even at high volume. The safety-first approach is exactly what I needed.',
    stats: '98.9% delivery rate',
  },
  {
    id: 'testi-004',
    name: 'Jonas Müller',
    handle: '@jonasbuilds',
    role: 'SaaS Founder · 41K followers',
    avatar: 'https://i.pravatar.cc/80?img=60',
    avatarAlt: 'German man with glasses at a desk, startup founder profile photo',
    quote:
      'We use DmGo for our launch campaigns. The live activity feed lets us monitor every DM in real time. Spotted a failure mid-campaign and retried instantly.',
    stats: '3,400 leads in one campaign',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Testimonials</p>
          <h2 className="text-hero-md font-extrabold text-foreground mb-4">
            Loved by creators and marketers
          </h2>
          <p className="text-lg text-muted-foreground">
            Join 47,000+ creators who automate their DMs with DmGo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {testimonials?.map((t) => (
            <div
              key={t?.id}
              className="card-hover p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <AppImage
                  src={t?.avatar}
                  alt={t?.avatarAlt}
                  width={44}
                  height={44}
                  className="rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {t?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t?.handle}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 })?.map((_, si) => (
                  <span key={`star-${t?.id}-${si}`} className="text-warning text-sm">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                &quot;{t?.quote}&quot;
              </p>
              <div className="mt-auto pt-3 border-t border-border">
                <p className="text-xs font-bold text-primary">{t?.stats}</p>
                <p className="text-xs text-muted-foreground">{t?.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}