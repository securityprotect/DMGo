import React from 'react';
import Badge from '@/components/ui/Badge';
import { CheckCircle2, MessageCircle, Zap } from 'lucide-react';

const activityItems = [
  { user: 'sarah_creates', keyword: 'link', status: 'Sent', time: '2s ago' },
  { user: 'marcelo.fit', keyword: 'info', status: 'Sent', time: '14s ago' },
  { user: 'priya_wellness', keyword: 'link', status: 'Sent', time: '31s ago' },
  { user: 'tomk_builds', keyword: 'price', status: 'Queued', time: '45s ago' },
];

export default function HeroMockup() {
  return (
    <div className="relative w-full max-w-sm xl:max-w-md">
      <div className="blob-accent absolute inset-0 scale-150 pointer-events-none" />
      <div className="relative card shadow-card-xl border border-border/60 overflow-hidden tilt-3d float-soft">
        <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            DmGo — Live Activity
          </span>
          <Badge variant="success" dot>
            Active
          </Badge>
        </div>

        <div className="px-4 py-3 border-b border-border bg-primary-light/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                DMs sent today
              </p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                2,847
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">
                Success rate
              </p>
              <p className="text-2xl font-bold text-success tabular-nums">
                98.3%
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {activityItems?.map((item, i) => (
            <div
              key={`mockup-activity-${item?.user}`}
              className="flex items-center gap-3 px-4 py-2.5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {item?.user?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  @{item?.user}
                </p>
                <p className="text-xs text-muted-foreground">
                  keyword:{' '}
                  <span className="text-primary font-semibold">
                    &quot;{item?.keyword}&quot;
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <Badge
                  variant={item?.status === 'Sent' ? 'success' : 'warning'}
                  dot
                >
                  {item?.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item?.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 bg-muted/30 flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          <span className="text-xs text-muted-foreground">
            Automation{' '}
            <span className="text-primary font-semibold">
              &quot;Reel — Free Guide&quot;
            </span>{' '}
            is running
          </span>
          <CheckCircle2 size={14} className="text-success ml-auto" />
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 card shadow-card-lg px-4 py-3 flex items-center gap-2.5 border border-border/60 animate-pulse-slow">
        <MessageCircle size={18} className="text-primary" />
        <div>
          <p className="text-xs font-bold text-foreground">+143 DMs</p>
          <p className="text-xs text-muted-foreground">last hour</p>
        </div>
      </div>
    </div>
  );
}
