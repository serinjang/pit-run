export const COLORS = {
  bg: '#191F28',

  sector: {
    yellow: { start: '#FCB827', end: '#FC8A27', glow: 'rgba(252,184,39,0.62)' },
    purple: { start: '#8528C5', end: '#B328C5', glow: 'rgba(190,78,255,0.62)' },
    green:  { start: '#59B345', end: '#28C584', glow: 'rgba(89,179,69,0.62)'  },
  },

  tire: {
    soft:   '#E03A3E',
    medium: '#FCB827',
    hard:   '#FFFFFF',
    wet:    '#4FC3F7',
  },

  text: {
    primary:   '#FFFFFF',
    secondary: 'rgba(255,255,255,0.5)',
    dim:       'rgba(255,255,255,0.3)',
  },

  boxbox: {
    sheet:   '#333D48',
    button:  '#474C53',
    overlay: 'rgba(0,19,43,0.58)',
  },
} as const;

export type SectorColor = keyof typeof COLORS.sector;
export type TireType = keyof typeof COLORS.tire;
