import type { ImageSourcePropType } from 'react-native';

export type CircuitDirection = 'clockwise' | 'counterclockwise';

export type CircuitMapping = {
  id: string;
  displayName: string;
  countryName: string;
  flagAsset: ImageSourcePropType;
  direction: CircuitDirection;
  sourceSvgFile: string;
};

// Stored for upcoming multi-circuit track integration.
// Source order follows the user-provided SVG list (Group 64 -> Group 74).
export const CIRCUIT_MAPPINGS: CircuitMapping[] = [
  {
    id: 'shanghai',
    displayName: 'Shanghai',
    countryName: 'China',
    flagAsset: require('../../assets/flags/china.png'),
    direction: 'clockwise',
    sourceSvgFile: 'Group 64.svg',
  },
  {
    id: 'las-vegas',
    displayName: 'Las Vegas',
    countryName: 'United States',
    flagAsset: require('../../assets/flags/usa.png'),
    direction: 'counterclockwise',
    sourceSvgFile: 'Group 65.svg',
  },
  {
    id: 'suzuka',
    displayName: 'Suzuka',
    countryName: 'Japan',
    flagAsset: require('../../assets/flags/japan.png'),
    direction: 'clockwise',
    sourceSvgFile: 'Group 66.svg',
  },
  {
    id: 'monaco',
    displayName: 'Monaco',
    countryName: 'Monaco',
    flagAsset: require('../../assets/flags/indonesia.png'),
    direction: 'clockwise',
    sourceSvgFile: 'Group 67.svg',
  },
  {
    id: 'hungaroring',
    displayName: 'Hungaroring',
    countryName: 'Hungary',
    flagAsset: require('../../assets/flags/hungary.png'),
    direction: 'clockwise',
    sourceSvgFile: 'Group 68.svg',
  },
  {
    id: 'marina-bay',
    displayName: 'Marina Bay',
    countryName: 'Singapore',
    flagAsset: require('../../assets/flags/singapore.png'),
    direction: 'counterclockwise',
    sourceSvgFile: 'Group 69.svg',
  },
  {
    id: 'monza',
    displayName: 'Monza',
    countryName: 'Italy',
    flagAsset: require('../../assets/flags/italy.png'),
    direction: 'clockwise',
    sourceSvgFile: 'Group 70.svg',
  },
  {
    id: 'baku',
    displayName: 'Baku',
    countryName: 'Azerbaijan',
    flagAsset: require('../../assets/flags/azerbaijan.png'),
    direction: 'counterclockwise',
    sourceSvgFile: 'Group 71.svg',
  },
  {
    id: 'albert-park',
    displayName: 'Albert Park',
    countryName: 'Australia',
    flagAsset: require('../../assets/flags/australia.png'),
    direction: 'clockwise',
    sourceSvgFile: 'Group 72.svg',
  },
  {
    id: 'silverstone',
    displayName: 'Silverstone',
    countryName: 'United Kingdom',
    flagAsset: require('../../assets/flags/uk.png'),
    direction: 'clockwise',
    sourceSvgFile: 'Group 73.svg',
  },
  {
    id: 'spa',
    displayName: 'Spa',
    countryName: 'Belgium',
    flagAsset: require('../../assets/flags/belgium.png'),
    direction: 'clockwise',
    sourceSvgFile: 'Group 74.svg',
  },
];

export const CIRCUIT_DIRECTION_BY_ID: Record<string, CircuitDirection> = Object.fromEntries(
  CIRCUIT_MAPPINGS.map((item) => [item.id, item.direction]),
);
