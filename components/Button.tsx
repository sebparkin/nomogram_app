import { StyleSheet, Pressable, View, Text, useWindowDimensions } from "react-native";
import Iconify from '@expo/vector-icons/FontAwesome';

import * as colours from '@/constants/colour';

type IconName = React.ComponentProps<typeof Iconify>["name"];
type Props = {
  label: string;
  onPress: () => void;
  icon: IconName; 
};

export default function Button({ label, icon, onPress }: Props ) {
  const { width } = useWindowDimensions();
  return (
    <View>
      <View style={[styles.buttonContainer, {width: (width * 0.5) + 100}]}>
      <Pressable style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}>
        <Iconify name={icon} size={28} style={styles.buttonIcon} />
        <Text style={styles.text}>{label}</Text>
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 60,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colours.buttonColour,
    shadowColor: colours.textColour,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
    borderRadius: 10,
  },
  buttonPressed: {
    backgroundColor: colours.buttonPressedColour
  },
  text: {
    color: colours.textColour,
    fontSize: 28,
  },
  buttonIcon: {
    paddingRight: 8,
  },
});