import { pricingConfig } from '@/website-config';

// One shared source for the visible FAQ and FAQPage JSON-LD.
export const pricingFaqItems = [
  {
    question: 'Will I be charged every month?',
    answer: pricingConfig.purchaseType === 'one-time'
      ? 'No. These credit packs are one-time purchases, so buying a pack does not start a monthly subscription.'
      : 'Check the billing terms shown with your selected plan before you pay.',
  },
  {
    question: 'Do my purchased credits expire?',
    answer: pricingConfig.creditsExpire === false
      ? 'No. Your purchased credits remain available until you use them.'
      : 'Check the credit validity terms for your selected pack before buying.',
  },
  {
    question: 'What currency are these prices in?',
    answer: `The listed prices are in ${pricingConfig.currency}. Check the final amount at checkout before completing your purchase.`,
  },
  {
    question: 'How many credits come with each pack?',
    answer: pricingConfig.oneTimePlans.length
      ? `You can choose from ${pricingConfig.oneTimePlans.map((plan: { credits: number; price: string }) => `${plan.credits.toLocaleString('en-US')} credits for ${plan.price}`).join(', ')}. Choose the pack that fits your budget.`
      : 'Credit packs have not been configured yet. Check this page again once pricing is available.',
  },
  {
    question: 'How many generations does a credit pack cover?',
    answer: 'You are buying credits, not a fixed number of images or other outputs. How many generations you can make depends on the credits each generation uses. Per-generation credit costs have not been confirmed yet, so we cannot give you a reliable output count for a pack.',
  },
];

export const pricingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pricingFaqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};
