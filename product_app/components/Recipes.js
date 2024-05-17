import { FlatList, StyleSheet, View, Text} from 'react-native';

export default function Recipes({ route }) {
    return (
      <View style={styles.container}>
        <FlatList data={route.params.products} renderItem={({ item }) => (
          <Text>{item.title}</Text>
        )} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between'
    },
    content_container: {
      height: '86%',
      maxHeight: '86%',
      paddingTop: 18,
      paddingHorizontal: '6%'
    }
});