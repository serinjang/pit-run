import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, TireType } from '../constants/colors';

interface Props {
  visible: boolean;
  onSelectTire: (t: TireType) => void;
  onClose: () => void;
}

const TIRES: Array<{ key: TireType; label: string }> = [
  { key: 'soft', label: 'SOFT' },
  { key: 'medium', label: 'MEDIUM' },
  { key: 'hard', label: 'HARD' },
  { key: 'wet', label: 'WET' },
];

export default function BoxBoxSheet({ visible, onSelectTire, onClose }: Props) {
  if (!visible) return null;

  return (
    <View style={s.root} pointerEvents="box-none">
      <Pressable style={s.overlay} onPress={onClose} />
      <View style={s.sheet}>
        <Text style={s.title}>BOX BOX</Text>
        <Text style={s.desc}>회복 인터벌 타이밍입니다. 타이어를 선택하세요.</Text>

        <View style={s.tireRow}>
          {TIRES.map((t) => (
            <Pressable
              key={t.key}
              style={[s.tireBtn, { borderColor: COLORS.tire[t.key] }]}
              onPress={() => onSelectTire(t.key)}
            >
              <Text style={[s.tireTxt, { color: COLORS.tire[t.key] }]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={s.closeBtn} onPress={onClose}>
          <Text style={s.closeTxt}>닫기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.boxbox.overlay },
  sheet: {
    backgroundColor: COLORS.boxbox.sheet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 26,
    gap: 14,
  },
  title: { color: '#FFFFFF', fontFamily: 'Formula1-Bold', fontSize: 26, textAlign: 'center' },
  desc: { color: 'rgba(255,255,255,0.72)', fontFamily: 'Formula1-Regular', fontSize: 13, textAlign: 'center' },
  tireRow: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  tireBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tireTxt: { fontFamily: 'Formula1-Bold', fontSize: 12 },
  closeBtn: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.boxbox.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: { color: '#FFFFFF', fontFamily: 'Formula1-Bold', fontSize: 14 },
});
