import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useUrl } from '../context/UrlContext';
import { useTheme } from '../context/ThemeContext';
import { registerForPushNotificationsAsync, sendTokenToServer } from '../services/notifications';

interface MessageData {
  type: string;
  userId?: string;
  id?: string;
  name?: string;
  value?: string;
}

const injectedJavaScript = `
  (function() {
    let isHandlingInput = false;
    let activeInput = null;
    let inputHandlers = new Set();

    function setupInput(input) {
      if (inputHandlers.has(input)) return;
      inputHandlers.add(input);

      input.addEventListener('touchstart', function(e) {
        if (isHandlingInput) return;
        e.stopPropagation();
      }, true);

      input.addEventListener('focus', function(e) {
        if (isHandlingInput) return;
        isHandlingInput = true;
        activeInput = this;

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'inputFocus',
          id: this.id || this.name || '',
          value: this.value || ''
        }));
      }, true);

      input.addEventListener('blur', function(e) {
        if (this !== activeInput) return;
        isHandlingInput = false;
        activeInput = null;

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'inputBlur',
          id: this.id || this.name || ''
        }));
      }, true);

      input.addEventListener('input', function(e) {
        if (!isHandlingInput || this !== activeInput) return;

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'textInput',
          id: this.id || this.name || '',
          value: this.value || ''
        }));
      }, true);
    }

    function setupAllInputs() {
      document.querySelectorAll('input, textarea').forEach(setupInput);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.matches('input, textarea')) {
              setupInput(node);
            }
            node.querySelectorAll('input, textarea').forEach(setupInput);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener('message', function(event) {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'setValue' && activeInput) {
          activeInput.value = message.value;
          activeInput.dispatchEvent(new Event('input', { bubbles: true }));
          activeInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    });

    const style = document.createElement('style');
    style.textContent = \`
      input, select, button, textarea {
        -webkit-appearance: none;
        -webkit-tap-highlight-color: transparent;
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
        font-size: 16px !important;
      }
      
      select, button {
        touch-action: manipulation;
      }
      
      input[type="text"],
      input[type="number"],
      input[type="email"],
      input[type="password"],
      textarea {
        -webkit-user-select: text;
        user-select: text;
      }
      
      .select-wrapper {
        transform: translateZ(0);
        will-change: transform;
      }

      * {
        -webkit-tap-highlight-color: transparent !important;
      }
    \`;
    document.head.appendChild(style);

    setupAllInputs();

    // Scroll performansı için CSS optimizasyonları
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Touch event optimizasyonu
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
    
    // Varsa fixed position elementleri optimize et
    const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => 
      window.getComputedStyle(el).position === 'fixed'
    );
    fixedElements.forEach(el => {
      el.style.transform = 'translateZ(0)';
      el.style.willChange = 'transform';
    });
  })();
  true;
`;

export default function HomeScreen() {
  const { theme } = useTheme();
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const { baseUrl } = useUrl();
  const webViewRef = useRef<WebView>(null);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardVisible(true);
    });

    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false);
    });

    const loadingTimer = setTimeout(() => {
      setIsWebViewLoading(false);
    }, 3000);

    const getToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setPushToken(token);
        }
      } catch (error) {
        console.error('Error in useEffect getting token:', error);
      }
    };

    getToken();

    return () => {
      clearTimeout(loadingTimer);
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const getRootUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return url;
    }
  };

  const handleLoginSuccess = async (userId: string) => {
    if (!pushToken) {
      Alert.alert('Hata', 'Push notification token bulunamadı.');
      return;
    }

    try {
      const rootUrl = getRootUrl(baseUrl);
      await sendTokenToServer(pushToken, userId, rootUrl);
      Alert.alert('Başarılı', 'Token başarıyla gönderildi.');
    } catch (error) {
      Alert.alert('Hata', 'Token gönderilirken bir hata oluştu.');
    }
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data: MessageData = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case 'loginSuccess':
          if (data.userId) {
            handleLoginSuccess(data.userId);
          }
          break;

        case 'inputFocus':
          if (!isKeyboardVisible) {
            setCurrentInputValue(data.value || '');
            if (webViewRef.current) {
              webViewRef.current.injectJavaScript(`
                (function() {
                  window.postMessage(JSON.stringify({
                    type: 'setValue',
                    value: ${JSON.stringify(data.value)}
                  }), '*');
                })();
              `);
            }
          }
          break;

        case 'inputBlur':
          if (isKeyboardVisible) {
            setCurrentInputValue('');
          }
          break;

        case 'textInput':
          if (isKeyboardVisible) {
            setCurrentInputValue(data.value || '');
          }
          break;
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const handleHiddenInputChange = (text: string) => {
    if (!isKeyboardVisible || !currentInputValue) return;
    
    setCurrentInputValue(text);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        (function() {
          window.postMessage(JSON.stringify({
            type: 'setValue',
            value: ${JSON.stringify(text)}
          }), '*');
        })();
      `);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.webviewContainer, isKeyboardVisible && styles.webviewContainerWithKeyboard]}>
        <TextInput
          ref={hiddenInputRef}
          style={styles.hiddenInput}
          value={currentInputValue}
          onChangeText={handleHiddenInputChange}
          autoCorrect={false}
          keyboardType="default"
          autoCapitalize="none"
        />

        <WebView 
          ref={webViewRef}
          source={{ uri: baseUrl }}
          style={styles.webview}
          onMessage={handleMessage}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          scrollEnabled={true}
          automaticallyAdjustContentInsets={true}
          mediaPlaybackRequiresUserAction={false}
          decelerationRate="normal"
          overScrollMode="never"
          cacheEnabled={true}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          renderToHardwareTextureAndroid={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={() => true}
          onLoadStart={() => {
            webViewRef.current?.injectJavaScript(`
              document.body.style.userSelect = 'text';
              document.body.style.webkitUserSelect = 'text';
              true;
            `);
          }}
          onLoadEnd={() => {
            webViewRef.current?.injectJavaScript(injectedJavaScript);
            setIsWebViewLoading(false);
            webViewRef.current?.injectJavaScript(`
              document.querySelectorAll('input, textarea').forEach(input => {
                input.style.userSelect = 'text';
                input.style.webkitUserSelect = 'text';
                input.setAttribute('inputmode', 'text');
              });
              true;
            `);
          }}
          onNavigationStateChange={(navState) => {
            if (navState.loading) {
              setTimeout(() => {
                webViewRef.current?.injectJavaScript(injectedJavaScript);
                webViewRef.current?.injectJavaScript(`
                  document.querySelectorAll('input, textarea').forEach(input => {
                    input.style.userSelect = 'text';
                    input.style.webkitUserSelect = 'text';
                    input.setAttribute('inputmode', 'text');
                  });
                  true;
                `);
              }, 1000);
            }
          }}
        />
        {isWebViewLoading && (
          <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webviewContainerWithKeyboard: {
    paddingBottom: 0,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
