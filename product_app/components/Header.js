import { StyleSheet, Text, Image, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}></View>
  );
}

const styles = StyleSheet.create({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '8.6%',
      paddingHorizontal: '8%',
      backgroundColor: '#6DE5B5',
    }
});
