// One shared source for the visible FAQ and FAQPage JSON-LD.
export const pricingFaqItems = [
  {
    question: 'Is a credit pack a one-time purchase?',
    answer: 'Each pack is a one-time purchase. You choose a pack and pay the price shown on its card.',
  },
  {
    question: 'How many credits come with each pack?',
    answer: 'The packs include 200, 650, or 1,200 credits. The price on each card covers the full pack.',
  },
  {
    question: 'Do purchased credits expire?',
    answer: 'Purchased credits never expire. You can save unused credits for a future project.',
  },
  {
    question: 'Which credit pack should I choose?',
    answer: 'The 200-credit pack has the lowest upfront price. To buy more credits at once, compare the 650- and 1,200-credit packs by total price and credits included.',
  },
  {
    question: 'Who can I contact about a credit purchase?',
    answer: 'Use Contact support below. Include the pack you selected and the date of purchase so we can look into it.',
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
