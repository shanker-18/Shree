import { Package, Crown, Gift, Coffee } from 'lucide-react';

export interface Category {
  title: string;
  description: string;
  icon: any;
  gradient: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  items: string[];
}

export const categories: Category[] = [
  {
    title: 'Mix & Pickle',
    description: 'Ready-to-cook mixes and homemade pickles with traditional taste',
    icon: Package,
    gradient: 'from-amber-600 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    items: [
      'Puliyotharai Mix: A chemical-free mix used to prepare tamarind rice. 100 grams are sufficient for a quarter-measure of rice.',
      'Vathakkuzhambu Mix: Contains sundakkai vathal, manathakkali vathal, and garlic. Mixing 2 tablespoons with Gingelly oil and rice makes a tasty dish.',
      'Poondu Pickle: Has medicinal value for an ailing heart and removes gastritis.',
      'Pirandai Pickle: Good for digestion and helps with joint pain.',
      'Jathikkai Pickle: Aids the digestive function and has aromatic properties.',
      'Mudakkathan Pickle: Good for joint pain and has anti-inflammatory properties.',
      'Kara Narthangai Pickle: Very tasty and improves digestive system function.'
    ]
  },
  {
    title: 'Powder',
    description: 'Traditional cooking powders made fresh without additives',
    icon: Crown,
    gradient: 'from-red-600 to-rose-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    items: [
      'Turmeric Powder: Prepared from cleaned and dried virali turmeric tubes, ground finely without additives. Used for cooking and as a cosmetic facial application.',
      'Sambar Powder: Essential spice blend for preparing authentic South Indian sambar with perfect aroma and taste.',
      'Rasam Powder: Prepared with tomato in dhal stew. Used in rasam to make it aromatic and tasty.',
      'Idli Powder: Traditional South Indian idli podi made with authentic spices and ingredients.',
      'Poondu Idli Powder: Special garlic-infused idli powder with medicinal properties and rich taste.',
      'Pulikuzhambu Powder: Traditional tamarind-based curry powder for authentic South Indian flavors.',
      'Ellu Idli Powder: Prepared with Gingelly oil and garlic. Eaten as a side dish with Idly or Dosa.',
      'Andra Spl Paruppu Powder: Special Andhra-style lentil powder blend for traditional recipes.',
      'Health Mix: Wholesome blend of grains, nuts, and pulses for a nutritious malt drink.',
      'Moringa Leaf Powder: Nutrient-rich powder made from dried moringa leaves, packed with vitamins and minerals.',
      'Curry Leaves Powder: Aromatic powder made from fresh curry leaves, adds authentic South Indian flavor.',
      'Red Chilli Powder: Made from a fine variety of chili. Used for making pickles and savory preparations.'
    ]
  },
  {
    title: 'Appalam',
    description: 'Crispy appalams made from quality ingredients',
    icon: Gift,
    gradient: 'from-emerald-600 to-green-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    items: [
      'Ulundhu appalam: Prepared from quality blackgram powder. It\'s very tasty and healthy. Fried and eaten as a side dish for Puttu, Sambar Rice, Rasam Rice.',
      'Rice appalam: Fried in cooking oil. Eaten as a side dish for Sambar Rice, Rasam Rice, Puli Kuzhambu rice, Vathal rice, and puliyotharai rice.',
      'Maravalli Kizhangu appalam: Made from Tapioca powder mixed with masala and dried on a flatbed. Can be eaten as is or with rice.'
    ]
  },
  {
    title: 'Coffee',
    description: 'Premium coffee powder for perfect brew',
    icon: Coffee,
    gradient: 'from-yellow-600 to-amber-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    items: [
      'Coffee powder: Premium quality coffee powder made from carefully selected coffee beans, roasted and ground to perfection for that authentic South Indian filter coffee experience.'
    ]
  }
];
