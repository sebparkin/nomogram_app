import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import NonogramScreen from "./NonogramScreen";
import StartScreen from "./StartScreen";
  import Animated, { useSharedValue, withTiming, useAnimatedStyle, withDelay, Easing } from "react-native-reanimated";

const NonogramImage = require('@/assets/images/nonogram.png');
const DefaultImage = require('@/assets/images/mallard.jpg');

export default function Index() {

  const [showGame, setShowGame] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>(DefaultImage);

  const startProgress = useSharedValue(0);
  const startButtonProgress = useSharedValue(0);
  const gameProgress = useSharedValue(0);
  const buttonProgress = useSharedValue(0);

  useEffect(() => {
    if (showGame) {
    // Forward animation
    startProgress.value = withDelay(
      300,
      withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic)
    }));

    startButtonProgress.value = withDelay(
      0,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic)})
    );

    gameProgress.value = withDelay(
      600,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic)})
    );

    buttonProgress.value = withDelay(
      1000,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic)})
    );
  } else {
    // Reverse animation
    buttonProgress.value = withTiming(0, { duration: 300 });

    gameProgress.value = withDelay(
      300,
      withTiming(0, { 
        duration: 400,
        easing: Easing.out(Easing.cubic)
      })
    );

    startProgress.value = withDelay(
      600,
      withTiming(0, { 
        duration: 400,
        easing: Easing.out(Easing.cubic)
       })
    );

    startButtonProgress.value = withDelay(
      1000,
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
    <View style={[{flex: 1}]}>

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
          onBack={() => setShowGame(false)}
        />
      </Animated.View>
    </View>
  )
}