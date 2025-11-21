// Centralized availability logic for products and weights
// Only products listed here are currently available for purchase.

export type Weight = '100g' | '250g' | '500g';

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
  'puliyodharaimix',
  'puliyodharai mix'.replace(/\s/g,''),
  'poonduidlipodi',
  'poonduidlypodi',
  'poonduidlipowder',
  'andraspecialpowder',
  'andhraspecialpowder',
  'andrasplpowder',
  'andrasplparuppupowder',
  'andhraspclparuppupowder',
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

// Centralized per-product, per-weight pricing based on provided price list.
// If a product/weight combination isn't listed here, we fall back to productBasePrice(name).
export const getProductPrice = (name: string, weight?: Weight): number => {
  const n = normalize(name);

  // Helper to pick a sensible default weight if none is provided
  const pickDefaultWeight = (): Weight => {
    const allowed = allowedWeightsForProduct(name);
    if (allowed.includes('250g')) return '250g';
    if (allowed.includes('500g')) return '500g';
    return allowed[0] || '500g';
  };

  const w: Weight = weight || pickDefaultWeight();

  const isVathak = n.includes('vathakkuzhambu') || n.includes('vathakulambu');
  const isPuliyo = n.includes('puliyotharai') || n.includes('puliodharai') || n.includes('puliyodharai');
  const isPoonduIdli = n.includes('poondu') && (n.includes('idli') || n.includes('idly') || n.includes('idlipodi') || n.includes('idlipowder'));
  const isAndraSp = (n.includes('andra') || n.includes('andhra')) && (n.includes('spl') || n.includes('special') || n.includes('spcl')) && n.includes('paruppu') && n.includes('powder');
  const isTurmeric = (n.includes('turmaric') || n.includes('turmeric') || n.includes('manjal')) && n.includes('powder');
  const isHealthMix = n.includes('healthmix') || n.includes('healthymix') || (n.includes('health') && n.includes('mix'));
  const isCoffee = (n.includes('coffee') && n.includes('powder')) || n.includes('coffeepowder');
  const isUlundhuAppalam = n.includes('ulundhuappalam');
  const isRiceAppalam = n.includes('riceappalam');
  const isMaravalliAppalam = n.includes('maravallikizhanguappalam') || n.includes('kizhanguappalam');

  // Prices from the latest Excel price list:
  // 1. Poondu Idly Powder – 250g: 145
  if (isPoonduIdli && w === '250g') return 145;

  // 2. Turmeric (Manjal) Powder – 250g: 125
  if (isTurmeric && w === '250g') return 125;

  // 3. Andra/Andhra Spl Paruppu Powder – 250g: 150
  if (isAndraSp && w === '250g') return 150;

  // 4. Vathakulambu / Vathakkuzhambu Mix – 250g: 125
  if (isVathak && w === '250g') return 125;

  // 5. Puliyotharai / Puliodharai Mix – 250g: 125
  if (isPuliyo && w === '250g') return 125;

  // 6. Health Mix – 250g: 185, 500g: 370
  if (isHealthMix) {
    if (w === '250g') return 185;
    if (w === '500g') return 370;
  }

  // 7. Coffee Powder – 500g: 500
  if (isCoffee) {
    if (w === '500g') return 500;
  }

  // 8. Appalams (single 250g pack)
  if (isUlundhuAppalam) return 75;
  if (isRiceAppalam) return 85;
  if (isMaravalliAppalam) return 75;

  // Fallback to base price (currently ₹200)
  return productBasePrice(name) ?? 200;
};

// Allowed weights per product, exactly as per your table
export const allowedWeightsForProduct = (name: string): Weight[] => {
  const n = normalize(name);
  // Restrict specific products to only 250g
  const isVathak = n.includes('vathakkuzhambu') || n.includes('vathakulambu');
  const isPuliyo = n.includes('puliyotharai') || n.includes('puliodharai') || n.includes('puliyodharai');
  const isPoonduIdli = n.includes('poondu') && (n.includes('idli') || n.includes('idly') || n.includes('idlipodi') || n.includes('idlipowder'));
  const isAndraSp = (n.includes('andra') || n.includes('andhra')) && (n.includes('spl') || n.includes('special') || n.includes('spcl')) && n.includes('paruppu') && n.includes('powder');
  const isTurmeric = (n.includes('turmaric') || n.includes('turmeric') || n.includes('manjal')) && n.includes('powder');
  // Support both "Health Mix" and "Healthy Mix" spellings
  const isHealthMix = n.includes('healthmix') || n.includes('healthymix');
  // Coffee powder special case: only 500g
  const isCoffee = (n.includes('coffee') && n.includes('powder')) || n.includes('coffeepowder');
  // Appalam products: only 250g pack exists
  const isUlundhuAppalam = n.includes('ulundhuappalam');
  const isRiceAppalam = n.includes('riceappalam');
  const isMaravalliAppalam = n.includes('maravallikizhanguappalam') || n.includes('kizhanguappalam');

  if (isVathak || isPuliyo || isPoonduIdli || isAndraSp || isTurmeric || isUlundhuAppalam || isRiceAppalam || isMaravalliAppalam) {
    return ['250g'];
  }
  if (isHealthMix) {
    // Health Mix: allow 250g and 500g
    return ['250g','500g'];
  }
  if (isCoffee) {
    // Coffee Powder: allow 500g only
    return ['500g'];
  }
  // Default behavior for others
  return ['100g','500g'];
}

export const weightToFolder = (w: Weight): '100'|'250'|'500' => {
  if (w === '100g') return '100';
  if (w === '250g') return '250';
  return '500';
};
