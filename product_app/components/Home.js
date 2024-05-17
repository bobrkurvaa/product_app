import { StyleSheet, View} from 'react-native';
import Header from './Header';
import Footer from './Footer';
import FormAddProduct from './FormAddProduct';

export default function Home({ navigation }) {
    return (
      <View style={styles.container}>
        <View style={styles.content_container}>
          <FormAddProduct navigation={navigation}/>
        </View>
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