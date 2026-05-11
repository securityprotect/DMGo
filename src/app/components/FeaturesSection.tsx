import React from 'react';
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Clock,
  Activity,
} from 'lucide-react';

const features = [
  {
    id: 'feat-keyword',
    icon: <Zap size={24} />,
    title: 'Keyword Triggers',
    description:
      'Set any keyword — when a follower comments it on your reel, DmGo fires a personalized DM within seconds. Multiple keywords per automation.',
    highlight: true,
  },
  {
    id: 'feat-cooldown',
    icon: <Clock size={24} />,
    title: 'Smart Cooldown Engine',
    description:
      'Prevent spam flags with intelligent per-user cooldowns. Set minimum intervals between DMs to the same person across all your automations.',
    highlight: false,
  },
  {
    id: 'feat-multiacccount',
    icon: <Users size={24} />,
    title: 'Multi-Account Support',
    description:
      'Connect multiple Instagram accounts under one workspace. Switch between creator and brand accounts without logging out.',
    highlight: false,
  },
  {
    id: 'feat-analytics',
    icon: <BarChart3 size={24} />,
    title: 'Deep Analytics',
    description:
      'Track DM volume, delivery rates, reply rates, and keyword performance over time. Know exactly which automations drive real conversations.',
    highlight: false,
  },
  {
    id: 'feat-activity',
    icon: <Activity size={24} />,
    title: 'Live Activity Feed',
    description:
      'Watch DMs go out in real time. Filter by account, automation, or status. Spot failures instantly and retry with one click.',
    highlight: false,
  },
  {
    id: 'feat-instagram',
    icon: <Shield size={24} />,
    title: 'Instagram-Native & Safe',
    description:
      'Built on the official Instagram Graph API. Token encryption, rate limiting, and safety buffers keep your account protected.',
    highlight: false,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Why DmGo</p>
          <h2 className="text-hero-md font-extrabold text-foreground mb-4">
            Everything you need to automate DMs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From keyword detection to delivery analytics — DmGo handles the
            full lifecycle so you can focus on creating content.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features?.map((feat) => (
            <div
              key={feat?.id}
              className={`card-hover p-6 flex flex-col gap-4 ${
                feat?.highlight
                  ? 'border-primary/30 bg-primary-light/40' :''
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  feat?.highlight
                    ? 'gradient-primary text-white' :'bg-muted text-primary'
                }`}
              >
                {feat?.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1.5">
                  {feat?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}