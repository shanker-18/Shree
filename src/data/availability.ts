// Centralized availability logic for products and weights
// Only products listed here are currently available for purchase.

export type Weight = '100g' | '500g' | '1kg';

// Robust patterns to match product names irrespective of minor spelling differences
// NOTE: For now, EVERYTHING is marked as "coming soon". Keep this array empty
// and later add regex patterns here to enable purchasing for specific items.
const availableNamePatterns: RegExp[] = [
  // Intentionally empty – all items are Coming Soon
];

const normalize = (s: string) => (s || '').toLowerCase().replace(/[^a-z]/g, '');

const allowSet = new Set<string>([
  // From the provided image
  'vathakkuzhambumix',
  'vathakulambumix',
  'puliyotharaimix',
  'puliodharaimix',
  'puliyodharai mix'.replace(/\s/g,''),
  'poonduidlipodi',
  'poonduidlypodi',
  'poonduidlipowder',
  'andraspecialpowder',
  'andhraspecialpowder',
  'andrasplpowder',
  'andrasplparuppupowder',
  'healthmix',
  'turmericpowder',
  'coffeepowder',
]);

export const isProductAvailable = (_name: string): boolean => {
  // Revert to old behavior: everything is available
  return true;
};

// Optional: per-product base price mapping (can be extended later)
// If a name isn't listed here but is available by pattern, fall back to 200.
export const productBasePrice = (name: string): number | null => {
  if (!isProductAvailable(name)) return null;
  return 200; // default; can be customized per product later
};

// Allowed weights per product, exactly as per your table
export const allowedWeightsForProduct = (_name: string): Weight[] => {
  // Old behavior: show all standard weights in the modal
  return ['100g','500g','1kg'];
};

export const weightToFolder = (w: Weight): '100'|'500'|'1kg' => {
  if (w === '100g') return '100';
  if (w === '500g') return '500';
  return '1kg';
};
