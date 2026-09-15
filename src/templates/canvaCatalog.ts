export type CanvaVariant = 'basic' | 'premium';

export interface CanvaTemplateReference {
  id: string;
  family: 'modern-minimalist' | 'kitab-walimah';
  variant: CanvaVariant;
  name: string;
  canvaDesignId: string;
  canvaEditUrl: string;
  musicEnabled: boolean;
  animationEnabled: boolean;
  packageEligibility: Array<'HEMAT' | 'REGULER' | 'VIP'>;
  notes: string;
}

/**
 * Source-of-truth references for the Canva designs approved during the
 * AKSARA UNDANGAN design phase. The web templates remain native React/CSS
 * components; these references are retained so visual QA can be performed
 * against the original Canva artwork without coupling runtime rendering to Canva.
 */
export const CANVA_TEMPLATE_REFERENCES: CanvaTemplateReference[] = [
  {
    id: 'canva-modern-basic',
    family: 'modern-minimalist',
    variant: 'basic',
    name: 'Modern Minimalist Basic',
    canvaDesignId: 'DAHU_GvAVIs',
    canvaEditUrl: 'https://www.canva.com/d/fRfbjAVrSQksUIv',
    musicEnabled: false,
    animationEnabled: false,
    packageEligibility: ['HEMAT', 'REGULER', 'VIP'],
    notes: 'Ivory/cream, serif + sans, photo-centric, clean static layout.',
  },
  {
    id: 'canva-modern-premium',
    family: 'modern-minimalist',
    variant: 'premium',
    name: 'Modern Minimalist Premium',
    canvaDesignId: 'DAHU_nhJw2I',
    canvaEditUrl: 'https://www.canva.com/d/8z8gDS6MTcUmWhn',
    musicEnabled: true,
    animationEnabled: true,
    packageEligibility: ['REGULER', 'VIP'],
    notes: 'Premium motion/music variant of Modern Minimalist.',
  },
  {
    id: 'canva-kitab-basic',
    family: 'kitab-walimah',
    variant: 'basic',
    name: 'Kitab Walimah Basic',
    canvaDesignId: 'DAHU_Bgi-TA',
    canvaEditUrl: 'https://www.canva.com/d/N4cGar0WxuZLua7',
    musicEnabled: false,
    animationEnabled: false,
    packageEligibility: ['HEMAT', 'REGULER', 'VIP'],
    notes: 'Kitab kuning/pesantren visual language, aged cream paper, Arabic manuscript layout.',
  },
  {
    id: 'canva-kitab-premium',
    family: 'kitab-walimah',
    variant: 'premium',
    name: 'Kitab Walimah Premium',
    canvaDesignId: 'DAHU_DJY-Tc',
    canvaEditUrl: 'https://www.canva.com/d/_Z6jAVvv67ycy_k',
    musicEnabled: true,
    animationEnabled: true,
    packageEligibility: ['REGULER', 'VIP'],
    notes: 'Premium motion/music variant; preserve traditional kitab aesthetic.',
  },
];

export function getCanvaVariant(family: CanvaTemplateReference['family'], variant: CanvaVariant) {
  return CANVA_TEMPLATE_REFERENCES.find((item) => item.family === family && item.variant === variant);
}
