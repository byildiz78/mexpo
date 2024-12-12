import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useUrl } from '../context/UrlContext';

export default function HelpScreen() {
  const { baseUrl } = useUrl();
  
  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ uri: `${baseUrl}/yardim` }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
