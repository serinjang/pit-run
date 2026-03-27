import { create } from 'zustand';
import type { TireType, SectorColor } from '../constants/colors';
import { BASE_PACE_S, CIRCUIT_KM, PACE_RECORD_INTERVAL_KM } from '../constants/tires';

export interface TyreSegment {
  tire: TireType;
  startDist: number;
  endDist: number;
}

interface RunState {
  // 러닝 상태
  isRunning: boolean;
  isPaused: boolean;

  // 측정값
  distKm: number;
  elapsedMs: number;
  paceS: number;
  prog: number; // 서킷 진행률 0~1

  // 섹터/타이어
  sector: SectorColor;
  tire: TireType;

  // 히스토리
  paceHistory: number[];
  lastRecordDist: number;
  tyreLog: TyreSegment[];

  // BOX BOX
  boxBoxActive: boolean;

  // 액션
  startRun: () => void;
  pauseRun: () => void;
  resumeRun: () => void;
  stopRun: () => void;
  resetRun: () => void;
  tick: (dtMs: number) => void;
  setSector: (sector: SectorColor) => void;
  setTire: (tire: TireType) => void;
  triggerBoxBox: () => void;
  closeBoxBox: () => void;
}

const INITIAL_STATE = {
  isRunning: false,
  isPaused: false,
  distKm: 0,
  elapsedMs: 0,
  paceS: BASE_PACE_S,
  prog: 0,
  sector: 'yellow' as SectorColor,
  tire: 'medium' as TireType,
  paceHistory: [],
  lastRecordDist: 0,
  tyreLog: [{ tire: 'medium' as TireType, startDist: 0, endDist: 0 }],
  boxBoxActive: false,
};

export const useRunStore = create<RunState>((set, get) => ({
  ...INITIAL_STATE,

  startRun: () =>
    set({ isRunning: true, isPaused: false }),

  pauseRun: () =>
    set({ isPaused: true }),

  resumeRun: () =>
    set({ isPaused: false }),

  stopRun: () =>
    set({ isRunning: false, isPaused: true }),

  resetRun: () =>
    set({
      ...INITIAL_STATE,
      tire: get().tire,
      sector: get().sector,
      tyreLog: [{ tire: get().tire, startDist: 0, endDist: 0 }],
    }),

  tick: (dtMs: number) => {
    const { isPaused, paceS, distKm, elapsedMs, paceHistory, lastRecordDist, tyreLog } = get();
    if (isPaused) return;

    // 페이스 랜덤 워크
    const drift = (Math.random() - 0.5) * 0.4;
    const newPace = Math.max(265, Math.min(340, paceS + drift));

    const dKm = dtMs / (newPace * 1000);
    const newDist = distKm + dKm;
    const newElapsed = elapsedMs + dtMs;
    const newProg = (newDist % CIRCUIT_KM) / CIRCUIT_KM;

    // 페이스 기록 (500m마다)
    let newHistory = paceHistory;
    let newLastRecord = lastRecordDist;
    if (newDist - lastRecordDist >= PACE_RECORD_INTERVAL_KM) {
      newHistory = [...paceHistory, newPace].slice(-20);
      newLastRecord = newDist;
    }

    // tyreLog 업데이트
    const newTyreLog = [...tyreLog];
    if (newTyreLog.length > 0) {
      newTyreLog[newTyreLog.length - 1] = {
        ...newTyreLog[newTyreLog.length - 1],
        endDist: newDist,
      };
    }

    set({
      paceS: newPace,
      distKm: newDist,
      elapsedMs: newElapsed,
      prog: newProg,
      paceHistory: newHistory,
      lastRecordDist: newLastRecord,
      tyreLog: newTyreLog,
    });
  },

  setSector: (sector) => set({ sector }),

  setTire: (tire) => {
    const { distKm, tyreLog } = get();
    const newLog = [
      ...tyreLog.map((seg, i) =>
        i === tyreLog.length - 1 ? { ...seg, endDist: distKm } : seg,
      ),
      { tire, startDist: distKm, endDist: distKm },
    ];
    set({ tire, tyreLog: newLog });
  },

  triggerBoxBox: () => set({ boxBoxActive: true }),
  closeBoxBox: () => set({ boxBoxActive: false }),
}));
