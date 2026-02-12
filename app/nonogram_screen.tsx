import { View, Text, Image, StyleSheet, ImageSource, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { imageUriToBinaryGrid } from "@/components/ImageUriToBinaryGrid";
import Nonogram from "@/components/Nonogram";
import CircleButton from "@/components/CircleButton";
import ToggleButton from "@/components/ToggleButton";
import { useState } from "react";

export default function nonogram_screen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  const imageToGridAsync = async () => {
    let grid = await imageUriToBinaryGrid(uri);
    console.log(grid);
  }

  const clearGrid = () => {
    //placeholder
  }

  const [mode, setMode] = useState<'fill'|'mark'>('fill');

  return(
  <View style={styles.container}>
    {/* <Pressable onPress={imageToGridAsync}>
      <Image source={{ uri }} style={styles.image} />
    </Pressable> */}
      <Nonogram />
      <View style={styles.buttonContainer}>
        <CircleButton onPress={clearGrid}/>
        <ToggleButton mode={mode} setMode={setMode}/>
      </View>
  </View>

  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { 
    width: 300, 
    height: 300 
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
