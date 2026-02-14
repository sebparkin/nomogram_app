import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import NonogramScreen from "./NonogramScreen";
import StartScreen from "./StartScreen";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withDelay, Easing } from "react-native-reanimated";

import * as constants from '@/constants/constants'

const NonogramImage = require('@/assets/images/nonogram.png');
const DefaultImage = require('@/assets/images/mallard.jpg');

export default function Index() {

  const [showGame, setShowGame] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>(DefaultImage.uri);

  const startProgress = useSharedValue(0);
  const startButtonProgress = useSharedValue(0);
  const gameProgress = useSharedValue(0);
  const buttonProgress = useSharedValue(0);

  useEffect(() => {
    if (showGame) {
    // Forward animation

    startButtonProgress.value = withDelay(
      0,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic)})
    );

    startProgress.value = withDelay(
      1 * constants.delayTime,
      withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic)
    }));

    gameProgress.value = withDelay(
      2 * constants.delayTime,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic)})
    );

    buttonProgress.value = withDelay(
      3 * constants.delayTime,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic)})
    );
  } else {
    // Reverse animation
    buttonProgress.value = withDelay(
      0, 
      withTiming(0, { 
        duration: 500,
        easing: Easing.out(Easing.cubic)})
    );

    gameProgress.value = withDelay(
      1 * constants.delayTime,
      withTiming(0, { 
        duration: 500,
        easing: Easing.out(Easing.cubic)
      })
    );

    startProgress.value = withDelay(
      2 * constants.delayTime,
      withTiming(0, { 
        duration: 500,
        easing: Easing.out(Easing.cubic)
       })
    );

    startButtonProgress.value = withDelay(
      3 * constants.delayTime,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic)
      })
    );
  }
  }, [showGame]);

  const startStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: -startProgress.value * 600, 
        // adjust 600 to your screen height
      },
    ],
    opacity: 1 - startProgress.value,
  }));

  const gameStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: ((1 - gameProgress.value) * -600) - 600,
      },
    ],
    opacity: gameProgress.value,
  }));


  return(
    <View style={[{flex: 1, backgroundColor: '#eee'}]}>

      <Animated.View style={[startStyle]}>
        <StartScreen 
          showGame={showGame}
          setShowGame={setShowGame}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onStart={() => setShowGame(true)}
          onBack={() => setShowGame(false)}
          startButtonProgress={startButtonProgress}/>
      </Animated.View>

      <Animated.View style={[gameStyle]}>
        <NonogramScreen 
          showGame={showGame} 
          setShowGame={setShowGame} 
          selectedImage={selectedImage}
          buttonProgress={buttonProgress}
          onBack={() => setShowGame(false)
          }
        />
      </Animated.View>
    </View>
  )
}