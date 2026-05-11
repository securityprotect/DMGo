import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { MessageCircle, TrendingUp, Zap } from 'lucide-react';

const valueProps = [
  {
    id: 'vp-automate',
    icon: <Zap size={18} />,
    title: 'Automate your DMs',
    desc: 'Keyword triggers fire DMs in seconds',
  },
  {
    id: 'vp-scale',
    icon: <TrendingUp size={18} />,
    title: 'Scale without effort',
    desc: 'Unlimited automations on Growth plan',
  },
  {
    id: 'vp-track',
    icon: <MessageCircle size={18} />,
    title: 'Track every message',
    desc: 'Live activity feed and deep analytics',
  },
];

export default function AuthBrand() {
  return (
    <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] gradient-bg-hero flex-col justify-between p-12 border-r border-border shrink-0">
      <div className="flex items-center gap-2">
        <AppLogo size={36} />
        <span className="font-bold text-xl text-foreground">DmGo</span>
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-hero-md font-extrabold text-foreground mb-4">
            Your Instagram DM engine
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Set keywords, write a reply, connect your account. DmGo handles
            the rest — 24/7, automatically.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {valueProps?.map((vp) => (
            <div key={vp?.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white shrink-0">
                {vp?.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{vp?.title}</p>
                <p className="text-xs text-muted-foreground">{vp?.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-4 flex items-center gap-3 shadow-card">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
          A
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            &quot;Set it up in 5 minutes. Now I get 200+ leads a week.&quot;
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aisha K. — Fitness Creator, 280K followers
          </p>
        </div>
      </div>
    </div>
  );
}