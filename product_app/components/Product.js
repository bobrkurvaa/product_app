import { StyleSheet, View, Text} from 'react-native';
import { WebView } from 'react-native-webview';

export default function Product({ route }) {
    return (
        <View style={{
            flex: 1
        }}>
        <WebView 
            source={{
                uri: 'https://sbermarket.ru/' + route.params.uri
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