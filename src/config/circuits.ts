import type { ComponentType } from 'react';
import ChinaFlag from '../components/ChinaFlag';
import type { ImageSourcePropType } from 'react-native';
import type { CircuitDirection } from './circuitMappings';

/**
 * SVG overlay element rendered on top of the circuit track.
 * fill: 'accent' = sector color (#FFFFFF in pit theme), 'light' = always #FFFFFF
 */
export type CircuitOverlay = { d: string; fill: 'accent' | 'light' };

/**
 * How to add a new circuit:
 * 1. Design the SVG (viewBox "0 0 286 185") with track path + start marker rect + checker flag
 * 2. Set trackPath: start the path from the bottom edge of the start marker,
 *    cross through it as the first segment (M[bottom]L[top]L...), and end at the same bottom point
 * 3. Copy start marker and checker flag <path d="..."> elements into overlays[]
 *    - start marker: fill 'accent'
 *    - checker flag dark cells: fill 'accent', light cells: fill 'light'
 */
export type CircuitDefinition = {
  id: string;
  displayName: string;
  countryName: string;
  distanceKm: number;
  trackPath: string;
  flagComponent: ComponentType;
  flagAsset?: ImageSourcePropType;
  direction?: CircuitDirection;
  overlays?: CircuitOverlay[];
};

const SHANGHAI_TRACK_PATH =
  'M103.184 98.296L104.912 93.580L132.665 17.5331C133.833 14.3174 135.554 11.2902 137.891 8.80303C142.036 4.39403 149.259 -0.0149686 160.124 4.20561C160.124 4.20561 172.283 8.68998 168.641 20.6106C168.641 20.6106 165.664 28.9136 159.546 27.9715C158.077 27.7454 156.758 26.9415 155.715 25.8863C154.76 24.9066 153.517 23.4118 152.6 21.4397C151.758 19.6434 150.075 18.94 148.555 18.6887C146.382 18.337 144.108 18.8395 142.488 20.3217C141.106 21.5778 139.926 23.7258 140.767 27.2681C142.463 34.3401 148.517 38.2717 148.517 38.2717C148.517 38.2717 151.947 41.1357 156.707 40.784C161.468 40.4323 215.695 32.7699 215.695 32.7699C215.695 32.7699 219.438 31.9409 224.011 33.2221C228.583 34.5034 263.754 43.0827 263.754 43.0827C263.754 43.0827 270.864 45.2684 265.94 50.5818C261.016 55.8952 250.276 56.7117 250.276 56.7117C250.276 56.7117 226.962 57.4528 206.94 54.8526C186.917 52.2399 178.828 67.8912 178.828 67.8912C178.828 67.8912 171.442 78.5557 179.87 95.2998C180.988 97.5106 182.37 99.5832 183.865 101.568C187.294 106.14 195.296 118.902 186.993 129.265C183.099 134.127 176.868 136.438 170.663 135.973C167.711 135.747 163.855 135.22 158.868 134.152C157.335 133.825 155.728 133.75 154.208 134.114C150.992 134.88 146.998 137.594 150.464 146.751L153.542 155.267C153.542 155.267 154.484 159.061 159.936 159.174C165.387 159.287 253.203 161.661 253.203 161.661C253.203 161.661 258.202 161.711 256.532 155.531C254.861 149.351 251.608 143.698 260.539 141.563C263.641 140.822 266.907 140.897 269.972 141.739C276.554 143.548 286.754 149.15 281.026 166.359C281.026 166.359 275.06 181.118 258.918 181.269C242.777 181.42 4.41473 182.5 4.41473 182.5C4.41473 182.5 0.483053 182.01 3.88715 177.702C5.20608 176.018 7.44199 174.7 9.67789 173.695C13.1448 172.15 16.9006 171.371 20.6941 171.22L75.2602 169.047C75.2602 169.047 77.7724 168.494 78.3754 166.359L78.3628 166.309L103.184 98.296';

export const CIRCUITS: CircuitDefinition[] = [
  {
    id: 'shanghai',
    displayName: 'Shanghai',
    countryName: 'China',
    distanceKm: 5.14,
    trackPath: SHANGHAI_TRACK_PATH,
    flagComponent: ChinaFlag,
    flagAsset: require('../../assets/flags/china.png'),
    direction: 'clockwise',
    overlays: [
      // Start marker
      { d: 'M110.006 100.71L111.673 95.9961L103.189 92.9945L101.521 97.7082Z', fill: 'accent' },
      // Checker flag - light cells
      { d: 'M130.467 102.885L132.003 98.5469L127.607 96.9899L126.07 101.328Z', fill: 'light' },
      { d: 'M124.54 105.672L126.076 101.334L121.68 99.777L120.143 104.115Z', fill: 'light' },
      { d: 'M127.392 111.545L128.929 107.207L124.532 105.65L122.996 109.988Z', fill: 'light' },
      { d: 'M121.461 114.336L122.998 109.998L118.601 108.441L117.065 112.779Z', fill: 'light' },
      { d: 'M127.615 97.0099L129.151 92.6719L124.755 91.1149L123.218 95.4529Z', fill: 'light' },
      { d: 'M121.668 99.7775L123.204 95.4395L118.808 93.8824L117.271 98.2205Z', fill: 'light' },
      { d: 'M118.611 108.445L120.147 104.107L115.75 102.55L114.214 106.888Z', fill: 'light' },
      // Checker flag - dark cells
      { d: 'M131.986 98.5646L133.522 94.2266L129.125 92.6695L127.589 97.0076Z', fill: 'accent' },
      { d: 'M128.927 107.231L130.463 102.893L126.067 101.336L124.53 105.674Z', fill: 'accent' },
      { d: 'M123.016 110.006L124.553 105.668L120.156 104.111L118.62 108.449Z', fill: 'accent' },
      { d: 'M126.076 101.342L127.612 97.0039L123.216 95.4469L121.679 99.7849Z', fill: 'accent' },
      { d: 'M125.867 115.897L127.403 111.559L123.007 110.002L121.47 114.34Z', fill: 'accent' },
      { d: 'M123.228 95.4513L124.764 91.1133L120.368 89.5563L118.831 93.8943Z', fill: 'accent' },
      { d: 'M120.147 104.133L121.684 99.7949L117.287 98.2379L115.751 102.576Z', fill: 'accent' },
      { d: 'M117.085 112.781L118.621 108.443L114.224 106.886L112.688 111.224Z', fill: 'accent' },
    ],
  },
];

export const DEFAULT_CIRCUIT_ID = 'shanghai';
