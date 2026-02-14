import { View, Pressable, StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as colours from '@/constants/colour';

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type Props = {
    onPress: () => void;
    name: IconName;
};

export default function CircleButton({ onPress , name }: Props) {
    return(
        <View style={styles.circleButtonContainer}>
            <Pressable style={styles.circleButton} onPress={onPress}>
                <Ionicons name={name} size={38} color="#000" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    circleButtonContainer: {
        width: 84,
        height: 84,
        marginHorizontal: 60,
        borderWidth: 4,
        borderColor: colours.buttonColour,
        borderRadius: 42,
        padding: 3,
    },
    circleButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 42,
        backgroundColor: '#fff'
    },
}); 