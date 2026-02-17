import { View, Image, StyleSheet } from "react-native"

type Props = {
  selectedImage: string;
  maxRowClues: number;
  maxColClues: number;
}

export default function WinScreen({ selectedImage, maxRowClues, maxColClues }: Props) {

  return (
    <Image source={{uri: selectedImage}} style={[styles.image, {top: maxColClues * 22, left: (maxRowClues * 22)/1.5}]} />
  )
}

const styles = StyleSheet.create({
  image: {
    width: 330,
    height: 330,
    position: 'absolute',
  }
})