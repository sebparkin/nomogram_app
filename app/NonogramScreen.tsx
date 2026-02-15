import { View, Text, Image, StyleSheet, ImageSource, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { imageUriToBinaryGrid } from "@/scripts/ImageUriToBinaryGrid";
import Nonogram from "@/components/Nonogram";
import CircleButton from "@/components/CircleButton";
import ToggleButton from "@/components/ToggleButton";
import { useState, useEffect } from "react";
import Animated, { SharedValue, useAnimatedStyle, Easing } from "react-native-reanimated";
import WinScreen from "./WinScreen";

type Props = {
  showGame: boolean;
  setShowGame: (mode: boolean) => void;
  selectedImage: string;
  buttonProgress: SharedValue<number>;
  onBack: () => void; 
  setGameComplete: (mode: boolean) => void;
  gameComplete: boolean;
  winProgress: SharedValue<number>;
}

export default function NonogramScreen({showGame, setShowGame, selectedImage, buttonProgress, onBack, setGameComplete, gameComplete, winProgress}: Props) {
  //const { uri } = useLocalSearchParams<{ uri: string }>();
  const [mode, setMode] = useState<'fill'|'mark'>('fill');
  const [reset, setReset] = useState(0);
  const [maxRowClues, setMaxRowClues] = useState<number>(0);
  const [maxColClues, setMaxColClues] = useState<number>(0);

  const clearGrid = () => {
    setReset(prev => prev + 1)
  }

  useEffect(() => {
    if (showGame) {clearGrid()};
  }, [showGame]);

  const headerButtonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: ((buttonProgress.value) * 200) - 200,
      },
    ],
    opacity: buttonProgress.value,
  }));

  const footerButtonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (1 - buttonProgress.value) * 200,
      },
    ],
    opacity: buttonProgress.value,
  }));

  const winStyle = useAnimatedStyle(() => ({
    opacity: winProgress.value
  }))

  console.log(gameComplete);
  

  return(
  <View style={styles.container}>
    {/* <Pressable onPress={imageToGridAsync}>
      <Image source={{ uri }} style={styles.image} />
    </Pressable> */}
    <Animated.View style={headerButtonStyle}>
      <View style={styles.headerButtonContainer}>
        <CircleButton onPress={() => setShowGame(false)} name="arrow-back" />
      </View>
    </Animated.View>
    <View style={styles.boardContainer}>
      <Nonogram mode={mode} reset={reset} uri={selectedImage} 
        showGame={showGame} setGameComplete={setGameComplete}
        maxRowClues={maxRowClues} maxColClues={maxColClues}
        setMaxRowClues={setMaxRowClues} setMaxColClues={setMaxColClues}
      />
      <Animated.View style={[winStyle, {position: 'absolute'}]} pointerEvents={gameComplete ? 'auto' : 'none'}>
        <WinScreen selectedImage={selectedImage} maxRowClues={maxRowClues} maxColClues={maxColClues}/>
      </Animated.View>
    </View>
    <Animated.View style={footerButtonStyle}>
      <View style={styles.buttonContainer}>
        <CircleButton onPress={clearGrid} name="reload"/>
        <ToggleButton mode={mode} setMode={setMode}/>
      </View>
    </Animated.View>
  </View>

  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    position: 'relative',
  },
  image: { 
    width: 300, 
    height: 300 
  },
  headerButtonContainer: {
    marginBottom: 20,
    paddingRight: 210,
  },
  nonogramContainer: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 55,
  }
});
