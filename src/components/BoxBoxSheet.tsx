import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { TireType } from '../constants/colors';
import SvgButton from './SvgButton';

interface Props {
  visible: boolean;
  onSelectTire?: (tire: TireType) => void;
  onClose: () => void;
}

const TIRES: Array<{ key: TireType; label: string }> = [
  { key: 'soft', label: 'SOFT' },
  { key: 'medium', label: 'MEDIUM' },
  { key: 'hard', label: 'HARD' },
  { key: 'wet', label: 'WET' },
];

const SCREEN_W = Dimensions.get('window').width;
const TIRE_BTN_W = (SCREEN_W - 96 - 24) / 4;

export default function BoxBoxSheet({ visible, onSelectTire, onClose }: Props) {
  if (!visible) return null;

  return (
    <View style={s.root} pointerEvents="box-none">
      <Pressable style={s.overlay} onPress={onClose} />
      <View style={s.sheet}>
        <Text style={s.copy}>Copy that</Text>

        <View style={s.barWrap}>
          <View style={s.barBg}>
            <View style={s.barFill} />
          </View>
          <Text style={s.critical}>Critical</Text>
          <Text style={s.good}>Good</Text>
        </View>

        <Text style={s.title}>"BOX BOX"</Text>
        <Text style={s.desc}>Pace got slower{`
`}Need Recovery</Text>

        <View style={s.tireRow}>
          {TIRES.map((tire) => (
            <Pressable
              key={tire.key}
              style={s.tireBtnPress}
              onPress={() => {
                onSelectTire?.(tire.key);
                onClose();
              }}
            >
              <SvgButton
                width={TIRE_BTN_W}
                height={44}
                radius={100}
                fill="rgba(0,0,0,0)"
                stroke="#FCB827"
                strokeWidth={2}
                textColor="#FCB827"
                fontFamily="Formula1-Bold"
                fontSize={14}
                label={tire.label}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  sheet: {
    marginHorizontal: 20,
    marginBottom: 28,
    height: 461,
    borderRadius: 24,
    backgroundColor: '#202028',
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  copy: {
    alignSelf: 'center',
    width: 322,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#34343F',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Formula1-Regular',
    fontSize: 20,
    lineHeight: 24,
    includeFontPadding: false,
    overflow: 'hidden',
    paddingTop: 12,
  },
  barWrap: { marginTop: 103 },
  barBg: {
    height: 12,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  barFill: {
    width: '20%',
    height: '100%',
    backgroundColor: '#E03A3E',
  },
  critical: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'Formula1-Regular',
    fontSize: 13,
  },
  good: {
    position: 'absolute',
    right: 0,
    top: 18,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'Formula1-Regular',
    fontSize: 13,
  },
  title: {
    marginTop: 14,
    color: '#FFFFFF',
    fontFamily: 'Formula1-Regular',
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  desc: {
    marginTop: 12,
    color: '#FFFFFF',
    fontFamily: 'Formula1-Regular',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  tireRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 8,
  },
  tireBtnPress: {
    width: TIRE_BTN_W,
    height: 44,
  },
});
