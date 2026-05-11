import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowRight, Play, Zap, TrendingUp, MessageCircle } from 'lucide-react';
import HeroMockup from './HeroMockup';

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden gradient-bg-hero">
      <div className="blob-primary absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] -z-0 pointer-events-none" />
      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          <div className="flex flex-col gap-6 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" dot>
                New — Smart cooldown engine
              </Badge>
            </div>

            <h1 className="text-hero-xl font-extrabold text-foreground">
              Turn every{' '}
              <span className="text-primary relative">
                comment
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 5 Q100 0 200 5"
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.4"
                  />
                </svg>
              </span>{' '}
              into a DM conversation
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              DmGo automatically sends personalized DMs when someone comments
              a keyword on your Instagram reels. Build your list, close more
              deals — while you sleep.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sign-up-login-screen">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                  className="shadow-card-xl"
                >
                  Start for Free
                </Button>
              </Link>
              <button className="btn-outline inline-flex items-center gap-2 px-6 py-3.5 text-base rounded-2xl font-semibold text-foreground bg-white border border-border hover:bg-muted active:scale-95 transition-all duration-150">
                <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Play size={12} className="text-white ml-0.5" />
                </span>
                Watch 90s demo
              </button>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { icon: <Zap size={14} />, text: 'Setup in 5 minutes' },
                { icon: <TrendingUp size={14} />, text: 'No coding needed' },
                { icon: <MessageCircle size={14} />, text: 'Instagram-native' },
              ]?.map((item) => (
                <div
                  key={`hero-feat-${item?.text}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <span className="text-primary">{item?.icon}</span>
                  {item?.text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}