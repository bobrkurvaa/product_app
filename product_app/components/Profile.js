import { StyleSheet, View, Text} from 'react-native';
export default function Profile() {
    return (
      <View style={styles.profile_container}>
        <Text>Данное приложение разработал студент группы 341/2 Вячеслав Шевченко</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  profile_container: {
      height: '100%',
      paddingTop: 24,
      paddingHorizontal: 18,
      backgroundColor: '#FFFFFF',
  }
});