import React, { useRef, useEffect, useState } from "react";
import { View, Pressable, Text, StyleSheet, Animated } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

import * as colours from "@/constants/colour";

type Props = {
  mode: 'fill' | 'mark';
  setMode: (mode: 'fill' | 'mark') => void;
};

export default function ToggleButton({ mode, setMode }: Props) {
  const anim = useRef(new Animated.Value(mode === 'fill' ? 0 : 1)).current;

  const toggleMode = () => {
    if (mode == 'fill') {
      setMode('mark')
    } else {
      setMode('fill')
    }
  }

  useEffect(() => {
    Animated.timing(anim, {
      toValue: mode === 'fill' ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [mode]);

  const left = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 78],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, { left }]} />

      <Pressable style={styles.option} onPress={() => toggleMode()}>
        <FontAwesome name="square" size={24} color="black" />
      </Pressable>

      <Pressable style={styles.option} onPress={() => toggleMode()}>
        <Feather name="x" size={28} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 84,
    borderRadius: 40,
    backgroundColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    padding: 2,
    borderColor: colours.buttonColour,
    borderWidth: 4
  },
  slider: {
    position: 'absolute',
    width: 72,
    height: 76,
    borderRadius: 36,
    backgroundColor: '#fff',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});