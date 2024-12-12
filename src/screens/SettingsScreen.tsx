import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Clipboard, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, themes } from '../context/ThemeContext';
import { useUrl } from '../context/UrlContext';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { registerForPushNotificationsAsync, sendTokenToServer, setupNotificationListeners } from '../services/notifications';

interface MessageData {
  type: string;
  userId?: string;
  id?: string;
  name?: string;
  value?: string;
}

const getRootUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return url;
  }
};

const injectedJavaScript = `
  (function() {
    if (!window.inputHandlersInitialized) {
      window.inputHandlersInitialized = true;

      const activeInputs = new Set();
      let currentInput = null;

      function handleInputFocus(input) {
        currentInput = input;
        activeInputs.add(input);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'inputFocus',
          id: input.id,
          name: input.name,
          value: input.value,
          type: input.type,
          selectionStart: input.selectionStart,
          selectionEnd: input.selectionEnd
        }));
      }

      function handleInputBlur(input) {
        if (activeInputs.has(input)) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'inputBlur',
            id: input.id,
            name: input.name
          }));
        }
      }

      function handleInputChange(input) {
        if (activeInputs.has(input)) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'inputChange',
            id: input.id,
            name: input.name,
            value: input.value
          }));
        }
      }

      function setupInputElement(input) {
        if (input.dataset.handlerInitialized) return;
        input.dataset.handlerInitialized = 'true';

        input.addEventListener('focus', () => handleInputFocus(input), true);
        input.addEventListener('blur', () => handleInputBlur(input), true);
        input.addEventListener('input', () => handleInputChange(input), true);
        input.addEventListener('keyup', () => handleInputChange(input), true);
      }

      document.querySelectorAll('input, textarea').forEach(setupInputElement);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches('input, textarea')) {
                setupInputElement(node);
              }
              node.querySelectorAll('input, textarea').forEach(setupInputElement);
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
          if (message.type === 'setValue' && currentInput) {
            currentInput.value = message.value;
            currentInput.dispatchEvent(new Event('input', { bubbles: true }));
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } catch (e) {
          console.error('Error processing message:', e);
        }
      });

      const style = document.createElement('style');
      style.textContent = \`
        input, textarea {
          font-size: 16px !important;
          -webkit-user-select: text !important;
          user-select: text !important;
          -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
        }
      \`;
      document.head.appendChild(style);
    }
    true;
  })();
`;

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const { baseUrl, setBaseUrl } = useUrl();
  const [urlInput, setUrlInput] = useState(baseUrl);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        console.log('Starting to get push token...');
        const token = await registerForPushNotificationsAsync();
        console.log('Push token result:', token);
        if (token) {
          setPushToken(token);
        } else {
          console.log('No token received');
        }
      } catch (error) {
        console.error('Error in useEffect getting token:', error);
      }
    };

    getToken();

    const unsubscribe = setupNotificationListeners();
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUrlSave = async () => {
    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
      Alert.alert('Hata', 'URL http:// veya https:// ile başlamalıdır.');
      return;
    }
    try {
      await setBaseUrl(urlInput);
      Alert.alert('Başarılı', 'URL başarıyla kaydedildi.');
    } catch (error) {
      Alert.alert('Hata', 'URL kaydedilirken bir hata oluştu.');
    }
  };

  const handleLoginSuccess = async (newUserId: string) => {
    if (!pushToken) {
      Alert.alert('Hata', 'Push notification token bulunamadı.');
      return;
    }

    try {
      setUserId(newUserId);
      const rootUrl = getRootUrl(baseUrl);
      await sendTokenToServer(pushToken, newUserId, rootUrl);
      Alert.alert('Başarılı', 'Token başarıyla gönderildi.');
    } catch (error) {
      Alert.alert('Hata', 'Token gönderilirken bir hata oluştu.');
    }
  };

  const handleManualTokenSend = async () => {
    if (!pushToken) {
      Alert.alert('Hata', 'Push notification token bulunamadı.');
      return;
    }

    try {
      const testUserId = 'test-user-123';
      const rootUrl = getRootUrl(baseUrl);
      await sendTokenToServer(pushToken, testUserId, rootUrl);
      Alert.alert('Başarılı', 'Token başarıyla gönderildi.');
    } catch (error) {
      Alert.alert('Hata', 'Token gönderilirken bir hata oluştu.');
    }
  };

  const handleCopyToken = async () => {
    if (pushToken) {
      await Clipboard.setString(pushToken);
      Alert.alert('Başarılı', 'Token panoya kopyalandı.');
    }
  };

  const tokenEndpoint = `${getRootUrl(baseUrl)}/api/expo/savetoken`;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      console.log('Raw WebView message received:', event.nativeEvent.data);
      const data: MessageData = JSON.parse(event.nativeEvent.data);
      console.log('Parsed WebView message:', data);

      switch (data.type) {
        case 'loginSuccess':
          console.log('Login success message received:', data);
          if (data.userId) {
            console.log('Handling login success for userId:', data.userId);
            handleLoginSuccess(data.userId);
          } else {
            console.log('No userId in login success message');
          }
          break;
        case 'inputFocus':
          setCurrentInputValue(data.value || '');
          if (hiddenInputRef.current) {
            hiddenInputRef.current.focus();
          }
          break;
        case 'inputBlur':
          if (hiddenInputRef.current) {
            hiddenInputRef.current.blur();
          }
          break;
        case 'inputChange':
          setCurrentInputValue(data.value || '');
          break;
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
      console.error('Raw message was:', event.nativeEvent.data);
    }
  };

  const handleHiddenInputChange = (text: string) => {
    setCurrentInputValue(text);
    webViewRef.current?.injectJavaScript(`
      window.postMessage(JSON.stringify({
        type: 'setValue',
        value: ${JSON.stringify(text)}
      }), '*');
    `);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* URL Settings Section */}
          <View style={[styles.section, styles.urlSection]}>
            <LinearGradient
              colors={[theme.headerGradient[0], theme.headerGradient[1]]}
              style={styles.sectionHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>URL Ayarları</Text>
            </LinearGradient>
            <View style={[styles.sectionContent, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.urlContainer}>
                <View style={[styles.inputWrapper, {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  shadowColor: theme.shadowColor,
                }]}>
                  <TextInput
                    style={[styles.urlInput, { 
                      color: theme.textDark,
                    }]}
                    value={urlInput}
                    onChangeText={setUrlInput}
                    placeholder="https://robotpos.com"
                    placeholderTextColor={theme.placeholder}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.saveButton]}
                  onPress={handleUrlSave}
                >
                  <LinearGradient
                    colors={[theme.headerGradient[0], theme.headerGradient[1]]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={[styles.buttonText, { color: theme.text }]}>
                      Kaydet
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Theme Selection Section */}
          <View style={[styles.section, styles.themeSection]}>
            <LinearGradient
              colors={[theme.headerGradient[0], theme.headerGradient[1]]}
              style={styles.sectionHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Tema Seçenekleri</Text>
            </LinearGradient>
            <View style={[styles.sectionContent, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.themeContainer}>
                {Object.values(themes).map((themeOption) => (
                  <TouchableOpacity
                    key={themeOption.name}
                    onPress={() => setTheme(themeOption)}
                    style={[
                      styles.themeButton,
                      {
                        backgroundColor: themeOption.cardBackground,
                        borderColor: theme.name === themeOption.name ? themeOption.primary : theme.border,
                        shadowColor: theme.shadowColor,
                      },
                      theme.name === themeOption.name && styles.selectedTheme,
                    ]}
                  >
                    <LinearGradient
                      colors={[themeOption.headerGradient[0], themeOption.headerGradient[1]]}
                      style={styles.themePreview}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <Text style={[
                      styles.themeName,
                      { color: themeOption.primary }
                    ]}>
                      {themeOption.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Token Section */}
          <View style={[styles.section, styles.tokenSection]}>
            <LinearGradient
              colors={[theme.headerGradient[0], theme.headerGradient[1]]}
              style={styles.sectionHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Push Notification Token</Text>
            </LinearGradient>
            <View style={[styles.sectionContent, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.tokenContainer}>
                <View style={[styles.tokenBox, { 
                  borderColor: theme.border,
                  backgroundColor: theme.inputBackground,
                  shadowColor: theme.shadowColor,
                }]}>
                  <Text style={[styles.tokenLabel, { color: theme.textDark }]}>
                    Mevcut Token:
                  </Text>
                  <Text style={[styles.tokenText, { color: theme.textDark }]} numberOfLines={3} ellipsizeMode="middle">
                    {pushToken || 'Token henüz alınmadı'}
                  </Text>
                  <Text style={[styles.tokenLabel, { color: theme.textDark, marginTop: 15 }]}>
                    Token Gönderim Adresi:
                  </Text>
                  <Text style={[styles.tokenText, { color: theme.textDark }]} numberOfLines={2} ellipsizeMode="middle">
                    {tokenEndpoint}
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={handleCopyToken}
                    disabled={!pushToken}
                  >
                    <LinearGradient
                      colors={[theme.headerGradient[0], theme.headerGradient[1]]}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={[styles.buttonText, { color: theme.text }]}>
                        Token'ı Kopyala
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={handleManualTokenSend}
                    disabled={!pushToken}
                  >
                    <LinearGradient
                      colors={[theme.headerGradient[0], theme.headerGradient[1]]}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={[styles.buttonText, { color: theme.text }]}>
                        Token'ı Gönder
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <TextInput
            ref={hiddenInputRef}
            style={styles.hiddenInput}
            value={currentInputValue}
            onChangeText={handleHiddenInputChange}
            autoCorrect={false}
          />

          <WebView 
            ref={webViewRef}
            source={{ uri: baseUrl }}
            style={styles.webview}
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
            onMessage={handleMessage}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    gap: 16,
  },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sectionContent: {
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  urlSection: {
    marginBottom: 0,
  },
  themeSection: {
    marginBottom: 0,
  },
  tokenSection: {
    marginBottom: 0,
  },
  tokenContainer: {
    gap: 16,
  },
  tokenBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  tokenText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  themeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  themeButton: {
    width: 150,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTheme: {
    borderWidth: 2,
  },
  themePreview: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    marginBottom: 10,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  urlContainer: {
    gap: 12,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  urlInput: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    height: 0,
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0,
  },
});
