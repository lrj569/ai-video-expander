'use client';

import { useRef, useState } from 'react';
import { useUser, useClerk } from '@/src/compat/clerk';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { pricingConfig, siteConfig, apiConfig } from '@/website-config';
import { isCheckoutConfigured } from '@/lib/checkout-readiness';

interface PricingPlan {
  key: string;
  priceId: string;
  popular: boolean;
  title: string;
  price: string;
  priceAmount: number;
  credits: number;
  features: string[];
  buttonText: string;
}

interface PricingSectionProps {
  hideSection?: boolean;
  heading?: string;
  description?: string;
}

export default function PricingSection({
  hideSection = false,
  heading = 'Choose Your Credit Pack',
  description = 'Pay once for the credits you need. Your purchased credits never expire.',
}: PricingSectionProps = {}) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const checkoutPending = useRef(false);
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const pricingPlans: PricingPlan[] = pricingConfig.oneTimePlans;
  const checkoutConfigured = isCheckoutConfigured(siteConfig, apiConfig);

  const handleUpgradeClick = async (priceId: string, planKey: string) => {
    if (checkoutPending.current) return;
    if (!checkoutConfigured) {
      setCheckoutMessage("We couldn't open checkout. Please try again later.");
      return;
    }
    setCheckoutMessage('');
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const userId = user?.id;
    if (!userId) {
      console.error('User is signed in but user ID is missing.');
      alert('Could not get user information. Please try refreshing the page.');
      return;
    }

    const selectedPlan = pricingPlans.find((plan) => plan.key === planKey);
    if (selectedPlan) {
      localStorage.setItem(
        'paymentInfo',
        JSON.stringify({
          planKey,
          price: selectedPlan.price,
          credits: selectedPlan.credits,
          planTitle: selectedPlan.title,
          timestamp: new Date().toISOString(),
        })
      );
    }

    checkoutPending.current = true;
    setLoadingPlan(planKey);

    try {
      const data = await api.payment.createPaypalSession(priceId);
      const checkoutUrl = data?.data?.url || data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      console.error('Payment session response missing URL:', data);
      alert('Checkout URL is missing. Please try again later.');
    } catch (error) {
      console.error('Error during checkout creation request:', error);
      alert(error instanceof Error ? error.message : 'Network error. Please check your connection and try again.');
    } finally {
      checkoutPending.current = false;
      setLoadingPlan(null);
    }
  };

  const columns = pricingPlans.length === 1 ? 'grid-cols-1 max-w-xl'
    : pricingPlans.length === 2 ? 'grid-cols-1 md:grid-cols-2'
      : pricingPlans.length === 3 ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  const content = (
    <div className={cn('mx-auto grid gap-5', columns)}>
      {pricingPlans.length === 0 && <p className="text-muted-foreground">Credit packs are not available yet.</p>}
      {pricingPlans.map((plan) => {
        const isFree = plan.key === 'free';

        return (
          <div
            key={plan.key}
            className={cn(
              'relative rounded-[20px] border border-transparent p-6 transition-colors duration-150',
              plan.popular ? 'bg-accent text-card-foreground' : 'bg-card text-card-foreground hover:bg-accent'
            )}
          >
            {plan.popular && (
              <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[13px] font-medium text-primary-foreground">
                Most Popular
              </div>
            )}

            <div className={cn('mb-5 text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-foreground', plan.popular && 'pr-24')}>
              {plan.title}
            </div>

            <div className="mb-6">
              <span className="text-[62px] font-medium leading-none tracking-[-3.1px] text-foreground">{plan.price}</span>
            </div>

            <Button
              className={cn(
                'mb-6 w-full font-semibold',
                plan.popular
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : isFree
                    ? 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    : 'border border-border bg-secondary text-secondary-foreground hover:border-primary/50 hover:bg-secondary/80'
              )}
              onClick={() => !isFree && handleUpgradeClick(plan.priceId, plan.key)}
              aria-busy={loadingPlan === plan.key}
            >
              {loadingPlan === plan.key ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                plan.buttonText
              )}
            </Button>

            <ul className="space-y-3">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2.5">
                  <Check
                    className={cn(
                      'mt-0.5 h-4 w-4 flex-shrink-0',
                      plan.popular ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span className="text-sm leading-[1.4] tracking-[-0.14px] text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );

  if (hideSection) {
    return <div>{content}{checkoutMessage && <p className="mt-6 text-sm text-muted-foreground" role="alert">{checkoutMessage}</p>}</div>;
  }

  return (
    <section id="pricing" className="bg-background px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <h2 className="mb-5 text-4xl font-medium tracking-tight text-foreground md:text-5xl">{heading}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {content}
        {checkoutMessage && <p className="mt-6 text-sm text-muted-foreground" role="alert">{checkoutMessage}</p>}
      </div>
    </section>
  );
}
