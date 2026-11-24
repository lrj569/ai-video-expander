import { ChevronDown } from 'lucide-react';
import { contactConfig } from '@/website-config';
import { pricingFaqItems } from '@/lib/pricing-faq';

export default function PricingFAQ() {
  const supportEmail = contactConfig.supportEmail?.trim();
  const hasSupportEmail = Boolean(supportEmail && !supportEmail.endsWith('@example.com'));

  return (
    <section className="pricing-faq bg-background px-4 py-20" aria-labelledby="pricing-faq-title">
      <div className="max-w-7xl mx-auto">
        <div className="pricing-faq-grid grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Title */}
          <div className="pricing-faq-intro lg:sticky lg:top-8">
            <p className="mc-eyebrow mb-5">Credits and billing</p>
            <h2 id="pricing-faq-title" className="mb-6 text-4xl font-medium text-foreground md:text-5xl">
              Pricing Questions
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Find out how to choose a pack, what you pay for, and when you can use your credits.
            </p>
            <div className="hidden lg:block">
              <div className="mb-4 h-px w-24 bg-ring"></div>
              <p className="text-muted-foreground">
                Still have a billing question?
              </p>
            </div>
          </div>

          {/* Right side - FAQ Items */}
          <div className="space-y-4">
            {pricingFaqItems.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="group rounded-[20px] border border-transparent bg-card"
              >
                <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-[20px] px-6 py-5 text-left transition-colors duration-200 hover:bg-accent active:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                  <h3 className="pr-4 text-lg font-semibold text-foreground">
                    {item.question}
                  </h3>
                  <ChevronDown aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:text-primary motion-reduce:transition-none" />
                </summary>
                <div className="px-6 pb-5">
                  <div className="mb-4 h-px bg-border"></div>
                  <p className="leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}

            {/* Contact support card */}
            <div className="mt-8 rounded-[20px] border border-transparent bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Billing Support
              </h3>
              <p className="mb-4 text-muted-foreground">
                Ask us about a credit pack or a purchase.
              </p>
              {hasSupportEmail && (
                <a
                  href={`mailto:${supportEmail}`}
                  title="Email support about credit packs and purchases"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200 font-medium min-h-11 underline decoration-current/40 underline-offset-4 hover:decoration-current active:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact support
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
