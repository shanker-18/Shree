// Short, single-line descriptions shown under item titles.
// Uses exact names; matching is case-insensitive and tolerant of minor spacing.

import { allowedWeightsForProduct } from './availability';

const normalize = (s: string) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

const DESC_MAP: Record<string, Record<string, string>> = {
  'vathakulambu mix': {
    '250g': 'Traditional South Indian tamarind-based curry mix bursting with authentic spicy flavor.'
  },
  'vathakkuzhambu mix': {
    '250g': 'Traditional South Indian tamarind-based curry mix bursting with authentic spicy flavor.'
  },
  'puliyotharai mix': {
    '250g': 'Ready-to-cook tangy tamarind rice mix for a perfect South Indian meal.'
  },
  'poondhu idly podi': {
    '250g': 'Flavourful garlic-spiced idly powder made from roasted lentils and aromatic spices.'
  },
  'poondu idli powder': {
    '250g': 'Flavourful garlic-spiced idly powder made from roasted lentils and aromatic spices.'
  },
  'andra special powder': {
    '250g': 'Fiery Andhra-style spice blend that adds a bold, rich flavor to any dish.'
  },
  'andhra special powder': {
    '250g': 'Fiery Andhra-style spice blend that adds a bold, rich flavor to any dish.'
  },
  'health mix': {
    '250g': 'Wholesome blend of grains, nuts, and pulses for a nutritious energy drink.',
    '1kg': 'High-protein multi-grain mix packed with natural nutrients for a healthy lifestyle.'
  },
  'turmeric powder': {
    '250g': 'Pure and vibrant turmeric powder rich in color, aroma, and natural goodness.'
  },
  'coffee powder': {
    '500g': 'Freshly ground aromatic coffee for a perfect, rich, and energizing brew.',
    '1kg': 'Premium roasted coffee powder delivering a strong and refreshing taste.'
  }
};

export const getShortDescription = (name: string, weight?: '250g'|'500g'|'1kg'): string | null => {
  const key = normalize(name);
  const weights = DESC_MAP[key];
  if (!weights) return null;
  const preferred = weight || (allowedWeightsForProduct(name)[0] as '250g'|'500g'|'1kg' | undefined);
  if (preferred && weights[preferred]) return weights[preferred];
  // Fallback to any available description
  const first = Object.values(weights)[0];
  return first || null;
};
