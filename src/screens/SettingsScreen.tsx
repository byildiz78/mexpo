import React, { useState, useEffect } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useUrl } from '../context/UrlContext';
import { WebViewMessageEvent } from 'react-native-webview';
import { registerForPushNotificationsAsync, setupNotificationListeners } from '../services/notifications';
import { URLSettings } from '../components/settings/URLSettings';
import { ThemeSettings } from '../components/settings/ThemeSettings';
import { TokenSettings } from '../components/settings/TokenSettings';
import { WebViewSection } from '../components/settings/WebViewSection';
import { settingsStyles } from '../styles/settings';

interface MessageData {
  type: string;
  userId?: string;
  id?: string;
  name?: string;
  value?: string;
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { baseUrl } = useUrl();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [currentInputValue, setCurrentInputValue] = useState('');

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

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      console.log('Raw WebView message received:', event.nativeEvent.data);
      const data: MessageData = JSON.parse(event.nativeEvent.data);
      console.log('Parsed WebView message:', data);

      switch (data.type) {
        case 'loginSuccess':
          console.log('Login success message received:', data);
          break;
        case 'inputFocus':
          setCurrentInputValue(data.value || '');
          break;
        case 'inputBlur':
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
  };

  return (
    <SafeAreaView style={[settingsStyles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={settingsStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <ScrollView 
          style={settingsStyles.scrollView}
          contentContainerStyle={settingsStyles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <URLSettings />
          <ThemeSettings />
          <TokenSettings pushToken={pushToken} />
          <WebViewSection
            baseUrl={baseUrl}
            currentInputValue={currentInputValue}
            onMessage={handleMessage}
            onHiddenInputChange={handleHiddenInputChange}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
