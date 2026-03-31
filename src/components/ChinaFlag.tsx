import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function ChinaFlag() {
  return (
    <View style={styles.flagWrap}>
      <Image source={require('../../assets/flags/china.png')} style={styles.flagImage} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  flagWrap: {
    width: 22,
    height: 14,
    borderRadius: 2,
    overflow: 'hidden',
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
});
