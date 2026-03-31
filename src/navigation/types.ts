import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  ProfileSetup: undefined;
  Home: undefined;
  Qualifying: undefined;
  Setup: undefined;
  AllCircuits: { currentCircuitId: string | null };
  Countdown: undefined;
  Running: undefined;
};

export type ProfileSetupScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type QualifyingScreenProps = NativeStackScreenProps<RootStackParamList, 'Qualifying'>;
export type SetupScreenProps = NativeStackScreenProps<RootStackParamList, 'Setup'>;
export type AllCircuitsScreenProps = NativeStackScreenProps<RootStackParamList, 'AllCircuits'>;
export type CountdownScreenProps = NativeStackScreenProps<RootStackParamList, 'Countdown'>;
export type RunningScreenProps = NativeStackScreenProps<RootStackParamList, 'Running'>;
