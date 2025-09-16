export type Character = {
  id: number;
  name: string;
  traits: string;
  quote: string;
  image: string;
  'data-ai-hint': string;
};

export const characters: Character[] = [
  {
    id: 1,
    name: "Arjuna",
    traits: "Focused, Skilled, Devoted",
    quote: "The mind is restless and difficult to restrain, but it is subdued by practice.",
    image: "/characters/arjuna.png",
    'data-ai-hint': 'cartoon archer warrior',
  },
  {
    id: 2,
    name: "Krishna",
    traits: "Wise, Divine, Strategist",
    quote: "Set your heart upon your work, but never on its reward.",
    image: "/characters/krishna.png",
    'data-ai-hint': 'cartoon divine god',
  },
  {
    id: 3,
    name: "Draupadi",
    traits: "Fiery, Resilient, Intelligent",
    quote: "A person's own self is his friend, and a person's own self is his enemy.",
    image: "/characters/draupadi.png",
    'data-ai-hint': 'cartoon queen princess',
  },
  {
    id: 4,
    name: "Bhima",
    traits: "Strong, Courageous, Voracious",
    quote: "Strength is life, weakness is death.",
    image: "/characters/bhima.png",
    'data-ai-hint': 'strong cartoon warrior',
  },
  {
    id: 5,
    name: "Karna",
    traits: "Generous, Loyal, Tragic Hero",
    quote: "I can give up my life, but I can't give up my promise.",
    image: "/characters/karna.png",
    'data-ai-hint': 'cartoon sun warrior',
  },
  {
    id: 6,
    name: "Yudhishthira",
    traits: "Righteous, Patient, Truthful",
    quote: "Truth alone triumphs.",
    image: "/characters/yudhishthira.png",
    'data-ai-hint': 'cartoon king righteous',
  },
];
