// Per-product image override mapping.
// Use this to force a specific file path for a given product and weight.

import { allowedWeightsForProduct } from './availability';

export type Weight = '250g'|'500g'|'1kg'|undefined;

const normalize = (s: string) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

// Map: normalized name -> weight -> relative path starting at project root public base
const OVERRIDES: Record<string, Record<string, string>> = {
  // Vathakkuzhambu / Vathakulambu Mix
  'vathakkuzhambu mix': {
    '250g': '/Images/250/Vathakkuzhambu Mix.jpg',
    '1kg': '/Images/1kg/Vathakkuzhambu Mix.jpg'
  },
  'vathakulambu mix': {
    '250g': '/Images/250/Vathakkuzhambu Mix.jpg',
    '1kg': '/Images/1kg/Vathakkuzhambu Mix.jpg'
  },
  // Puliyotharai / Puliodharai / Puliyodharai Mix
  'puliyotharai mix': {
    '250g': '/Images/250/Puliyotharai Mix.jpg'
  },
  'puliodharai mix': {
    '250g': '/Images/250/Puliyotharai Mix.jpg'
  },
  'puliyodharai mix': {
    '250g': '/Images/250/Puliyotharai Mix.jpg'
  },
  // Poondu Idli Powder (aka Poondu Idly Podi)
'poondu idli powder': {
    '250g': '/Images/250/Poondu Idli Powder.png'
  },
  'poondu idly podi': {
    '250g': '/Images/250/Poondu Idli Powder.png'
  },
  // Andra/Andhra Spl Paruppu Powder
  'andra spl paruppu powder': {
    '250g': '/Images/250/Andra Spl Paruppu Powder.jpg'
  },
  'andhra special powder': {
    '250g': '/Images/250/Andra Spl Paruppu Powder.jpg'
  },
  'andhra spcl paruppu powder': {
    '250g': '/Images/250/Andra Spl Paruppu Powder.jpg'
  },
  // Turmeric (spelled Turmaric) Powder - use provided 250g image everywhere
  'turmaric powder': {
    '250g': '/Images/250/Turmaric Powder.jpg'
  },
  // Also map the common spelling and Tamil alias to the same image
  'turmeric powder': {
    '250g': '/Images/250/Turmaric Powder.jpg'
  },
  'manjal powder': {
    '250g': '/Images/250/Turmaric Powder.jpg'
  },
  // Maravalli Kizhangu appalam - dedicated 250g image (falls back for all weights)
  'maravalli kizhangu appalam': {
    '250g': '/Images/250/Maravalli Kizhangu appalam.jpeg'
  },
  // Backward compatibility for older name
  'kizhangu appalam': {
    '250g': '/Images/250/Maravalli Kizhangu appalam.jpeg'
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
