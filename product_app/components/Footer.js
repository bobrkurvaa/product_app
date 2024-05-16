import { StyleSheet, Text, Image, View } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
        <View style={styles.footer_btn}>
          <Image 
            style={styles.footer_btn_image}
            source={require('./../assets/home_btn-icon.png')}
          />
          <Text style={styles.footer_btn_text}>Главная</Text>
        </View>
        <View style={styles.footer_btn}>
          <Image 
            style={styles.footer_btn_image}
            source={require('./../assets/whishlist_btn-icon.png')}
          />
          <Text style={styles.footer_btn_text}>Избранное</Text>
        </View>
        <View style={styles.footer_btn}>
          <Image 
            style={styles.footer_btn_image}
            source={require('./../assets/profile_btn-icon.png')}
          />
          <Text style={styles.footer_btn_text}>Профиль</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '8.6%',
      paddingHorizontal: '8%',
      backgroundColor: '#6DE5B5',
    },
    footer_btn: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      verticalAlign: 'middle',
      height: 'inherit'
    },
    footer_btn_image: {
      width: 32,
      height: 32,
    },
    footer_btn_text: {
      paddingTop: 2,
      fontWeight: '500'
    }
});
