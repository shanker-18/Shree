// Per-product image override mapping.
// Use this to force a specific file path for a given product and weight.

import { allowedWeightsForProduct } from './availability';

export type Weight = '250g'|'500g'|'1kg'|undefined;

const normalize = (s: string) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

// Map: normalized name -> weight -> relative path starting at project root public base
const OVERRIDES: Record<string, Record<string, string>> = {
  // Vathakkuzhambu Mix explicit 250g image in /Images/250/
'vathakkuzhambu mix': {
    '1kg': '/Images/1kg/Vathakkuzhambu Mix.jpg'
  },
  'vathakulambu mix': {
    '1kg': '/Images/1kg/Vathakkuzhambu Mix.jpg'
  }
};

export const getImageOverride = (name: string, weight?: Weight): string | null => {
  const key = normalize(name);
  const entry = OVERRIDES[key];
  if (!entry) return null;
  const w = weight || (allowedWeightsForProduct(name)[0] as Weight);
  if (w && entry[w]) return entry[w];
  // If a weight not specified but a single mapping exists, return it
  const first = Object.values(entry)[0];
  return first || null;
};
