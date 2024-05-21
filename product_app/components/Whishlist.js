import { StyleSheet, View, Text} from 'react-native';
import { WebView } from 'react-native-webview';

export default function Whishlist() {
    /*fetch(
      'https://sbermarket.ru/api/v2/phone_confirmations',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: {
          phone: 'sz4t/sr5QO3gT6vDJm4yPbPMeD0ZkurgHS4/gSpYtxQ='
        }
      }
    ).then(response => {
      return response.text();
    }).then(response => {
      console.log(response)
    });*/

    return (
      <View>
      <Text>Заказ</Text>
        <WebView
          source={{uri: 'https://sbermarket.ru/'}}
          style={{marginTop: 20}}
        />
      </View>
    );
}