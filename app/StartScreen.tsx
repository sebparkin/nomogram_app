import Button from "@/components/Button";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

const NonogramImage = require('@/assets/images/nonogram.png');
const DefaultImage = require('@/assets/images/mallard.png');

type Props = {
  setShowGame: (mode: boolean) => void;
  setSelectedImage: (mode: string) => void;
  startButtonProgress: SharedValue<number>;
}

export default function StartScreen({setShowGame,setSelectedImage, startButtonProgress}: Props) {
  //const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const router = useRouter();

  const pickImageAsync = async () => {  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
 
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowGame(true)
    } else {
      alert('You did not select an image.');
    }
  };
  
  const openNonogram = () => {
    setSelectedImage(DefaultImage.uri)
    setShowGame(true)
  }


  const headerStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: -((startButtonProgress.value) * 200),
        },
      ],
      opacity: 1 - startButtonProgress.value,
    }));
  
    const footerStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: - (1 - startButtonProgress.value) * 200 + 200,
        },
      ],
      opacity: 1 - startButtonProgress.value,
    }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={headerStyle}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Create a Custom Nonogram!</Text>
        </View>
      </Animated.View>
      <View style={styles.imageContainer}>
        <Image source={NonogramImage} style={styles.image} />
      </View>
      <Animated.View style={footerStyle}>
        <View style={styles.footerContainer}>
          <Button label='Import Photo' onPress={pickImageAsync} icon='image' />
          <Button label='Choose Example' onPress={openNonogram} icon='folder-o' />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    overflow: 'scroll',
  },
  titleContainer: {
    flex: 1 / 6,
    paddingTop: '5%',
    paddingBottom: '0%',
    marginHorizontal: '3%',
    justifyContent: 'center',
    minHeight: 160,
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold', 
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '0%',
  },
  image: {
    width: 300,
    height:300,
    borderRadius: 18,
    borderColor: '#000',
    borderWidth: 5,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
    paddingBottom: '5%',
    paddingTop: '3%',
  },
});