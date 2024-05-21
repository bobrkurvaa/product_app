import { useState } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { WebView } from 'react-native-webview';

export default function Whishlist() {
  const [page, setPage] = useState('');
/*
  fetch(
    'https://sbermarket.ru/metro/podsolnechnoe-maslo-sloboda-rafinirovannoe-1-l-00d9b41'
  ).then(response => {
    return response.text();
  }).then(response => {
    setPage(response);
    console.log(response);
  })

  */
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
      <View style={{
        flex: 1
      }}>
        <WebView 
          source={{
            uri: 'https://sbermarket.ru/metro/podsolnechnoe-maslo-sloboda-rafinirovannoe-1-l-00d9b41'
          }}
                scalesPageToFit={false}
                javaScriptEnabled={true}
                bounces={false}
                startInLoadingState={true}
                originWhitelist={['*']}
          style= {{
            height: 800
          }}
        />
      </View>
    );
}