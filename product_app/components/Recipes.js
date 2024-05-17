import { StyleSheet, View} from 'react-native';
import Header from './Header';
import Footer from './Footer';

export default function Recipes() {
    return (
      <View style={styles.container}>
        <Header />
        <Footer />
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