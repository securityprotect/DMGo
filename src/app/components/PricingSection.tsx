'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Check, Zap } from 'lucide-react';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const plans = [
  { id: 'plan-starter', name: 'Starter', monthlyPrice: 0, annualPrice: 0, description: 'Perfect for creators just getting started with DM automation.', badge: null, features: ['1 Instagram account','3 active automations','500 DMs / month'], cta: 'Get Started Free', ctaVariant: 'outline' as const },
  { id: 'plan-growth', name: 'Growth', monthlyPrice: 99, annualPrice: 79, description: 'For creators and marketers scaling their DM strategy.', badge: 'Most Popular', features: ['3 Instagram accounts','Unlimited automations','10,000 DMs / month'], cta: 'Pay with Razorpay', ctaVariant: 'primary' as const },
  { id: 'plan-agency', name: 'Agency', monthlyPrice: 299, annualPrice: 239, description: 'For agencies managing multiple creators and brands.', badge: null, features: ['20 Instagram accounts','Unlimited automations','100,000 DMs / month'], cta: 'Pay with Razorpay', ctaVariant: 'outline' as const },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  const loadRazorpayScript = async () => {
    if (window.Razorpay) return true;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return new Promise<boolean>((resolve) => {
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
    });
  };

  const startRazorpayCheckout = async (planId: string, amount: number) => {
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      window.alert('Unable to load Razorpay checkout. Please refresh and try again.');
      return;
    }

    const res = await fetch('/api/billing/razorpay/subscribe', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId, amount }),
    });
    const data = await res.json();
    if (!res.ok || !data.orderId || !window.Razorpay) {
      window.alert(data?.error || 'Unable to start payment. Please try again.');
      return;
    }

    const razorpay = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: data.name,
      description: data.description,
      order_id: data.orderId,
      notes: { planId },
      theme: { color: '#0F766E' },
    });
    razorpay.open();
  };

  return <section id="pricing" className="py-24 gradient-bg-pearl"><div className="max-w-screen-xl mx-auto px-6"><div className="text-center mb-12"><h2 className="text-hero-md font-extrabold text-foreground mb-4">Simple, transparent pricing</h2>
    <div className="inline-flex items-center gap-2 bg-white border border-border rounded-2xl p-1 shadow-card"><button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-xl text-sm font-semibold ${!annual ? 'bg-primary text-white' : 'text-muted-foreground'}`}>Monthly</button><button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${annual ? 'bg-primary text-white' : 'text-muted-foreground'}`}>Annual<Badge variant="success">Save 20%</Badge></button></div></div>
    <div className="grid md:grid-cols-3 gap-6 xl:gap-8">{plans.map((plan) => { const price = annual ? plan.annualPrice : plan.monthlyPrice; const isFeatured = plan.badge === 'Most Popular';
      return <div key={plan.id} className={`relative flex flex-col rounded-2xl border p-7 ${isFeatured ? 'border-primary bg-white shadow-card-xl scale-[1.02]' : 'border-border bg-white shadow-card'}`}>
        {plan.badge && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><Badge variant="primary" className="px-4 py-1 text-xs shadow-card"><Zap size={11} className="mr-1" />{plan.badge}</Badge></div>}
        <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3><p className="text-sm text-muted-foreground">{plan.description}</p>
        <div className="flex items-end gap-1.5 my-6"><span className="text-4xl font-extrabold text-foreground tabular-nums">₹{price}</span><span className="text-sm text-muted-foreground mb-1.5">/mo</span></div>
        <ul className="flex flex-col gap-2.5 mb-7 flex-1">{plan.features.map((feat) => <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground"><Check size={15} className="text-success shrink-0 mt-0.5" />{feat}</li>)}</ul>
        {price === 0 ? <Link href="/sign-up-login-screen"><Button variant={isFeatured ? 'primary' : plan.ctaVariant} fullWidth size="md">{plan.cta}</Button></Link> : <Button variant={isFeatured ? 'primary' : plan.ctaVariant} fullWidth size="md" onClick={() => void startRazorpayCheckout(plan.id, price)}>{plan.cta}</Button>}
      </div>; })}</div></div></section>;
}
