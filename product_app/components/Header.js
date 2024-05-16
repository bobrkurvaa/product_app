import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
        <Text style={styles.text}>приложение</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        backgroundColor: '#ffff00',
        fontStyle: 'bold'
    }
});
