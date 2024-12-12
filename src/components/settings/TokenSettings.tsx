import React from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useUrl } from '../../context/UrlContext';
import { getRootUrl } from '../../utils/url';
import { sendTokenToServer } from '../../services/notifications';
import * as Clipboard from 'expo-clipboard';
import { settingsStyles } from '../../styles/settings';

interface TokenSettingsProps {
  pushToken: string | null;
}

export const TokenSettings: React.FC<TokenSettingsProps> = ({ pushToken }) => {
  const { theme } = useTheme();
  const { baseUrl } = useUrl();
  const tokenEndpoint = `${getRootUrl(baseUrl)}/api/expo/savetoken`;

  const handleCopyToken = async () => {
    if (pushToken) {
      await Clipboard.setString(pushToken);
      Alert.alert('Başarılı', 'Token panoya kopyalandı.');
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

  return (
    <View style={settingsStyles.section}>
      <LinearGradient
        colors={[theme.headerGradient[0], theme.headerGradient[1]]}
        style={settingsStyles.sectionHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[settingsStyles.sectionTitle, { color: theme.text }]}>Push Notification Token</Text>
      </LinearGradient>
      <View style={[settingsStyles.sectionContent, { backgroundColor: theme.cardBackground }]}>
        <View style={settingsStyles.tokenContainer}>
          <View style={[settingsStyles.tokenBox, { 
            borderColor: theme.border,
            backgroundColor: theme.inputBackground,
            shadowColor: theme.shadowColor,
          }]}>
            <Text style={[settingsStyles.tokenLabel, { color: theme.textDark }]}>
              Mevcut Token:
            </Text>
            <Text style={[settingsStyles.tokenText, { color: theme.textDark }]} numberOfLines={3} ellipsizeMode="middle">
              {pushToken || 'Token henüz alınmadı'}
            </Text>
            <Text style={[settingsStyles.tokenLabel, { color: theme.textDark, marginTop: 15 }]}>
              Token Gönderim Adresi:
            </Text>
            <Text style={[settingsStyles.tokenText, { color: theme.textDark }]} numberOfLines={2} ellipsizeMode="middle">
              {tokenEndpoint}
            </Text>
          </View>
          <View style={settingsStyles.buttonContainer}>
            <TouchableOpacity
              style={settingsStyles.button}
              onPress={handleCopyToken}
              disabled={!pushToken}
            >
              <LinearGradient
                colors={[theme.headerGradient[0], theme.headerGradient[1]]}
                style={settingsStyles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[settingsStyles.buttonText, { color: theme.text }]}>
                  Token'ı Kopyala
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={settingsStyles.button}
              onPress={handleManualTokenSend}
              disabled={!pushToken}
            >
              <LinearGradient
                colors={[theme.headerGradient[0], theme.headerGradient[1]]}
                style={settingsStyles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[settingsStyles.buttonText, { color: theme.text }]}>
                  Token'ı Gönder
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
