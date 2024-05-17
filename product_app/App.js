import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View, ScrollView} from 'react-native';
import Header from './components/Header';
import Footer from './components/Footer';
import FormAddProduct from './components/FormAddProduct';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content_container}>
        <FormAddProduct />
      </View>
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
