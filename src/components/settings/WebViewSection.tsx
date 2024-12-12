import React, { useRef } from 'react';
import { TextInput } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { injectedJavaScript } from '../../utils/webViewScript';
import { settingsStyles } from '../../styles/settings';

interface WebViewSectionProps {
  baseUrl: string;
  currentInputValue: string;
  onMessage: (event: WebViewMessageEvent) => void;
  onHiddenInputChange: (text: string) => void;
}

export const WebViewSection: React.FC<WebViewSectionProps> = ({
  baseUrl,
  currentInputValue,
  onMessage,
  onHiddenInputChange,
}) => {
  const webViewRef = useRef<WebView>(null);
  const hiddenInputRef = useRef<TextInput>(null);

  const handleInputChange = (text: string) => {
    onHiddenInputChange(text);
    webViewRef.current?.injectJavaScript(`
      window.postMessage(JSON.stringify({
        type: 'setValue',
        value: ${JSON.stringify(text)}
      }), '*');
    `);
  };

  return (
    <>
      <TextInput
        ref={hiddenInputRef}
        style={settingsStyles.hiddenInput}
        value={currentInputValue}
        onChangeText={handleInputChange}
        autoCorrect={false}
      />

      <WebView 
        ref={webViewRef}
        source={{ uri: baseUrl }}
        style={settingsStyles.webview}
        keyboardDisplayRequiresUserAction={false}
        scrollEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        mixedContentMode="compatibility"
        textZoom={100}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
        onLoadEnd={() => {
          webViewRef.current?.injectJavaScript(injectedJavaScript);
        }}
        onNavigationStateChange={(navState) => {
          if (navState.loading) {
            setTimeout(() => {
              webViewRef.current?.injectJavaScript(injectedJavaScript);
            }, 1000);
          }
        }}
      />
    </>
  );
};
