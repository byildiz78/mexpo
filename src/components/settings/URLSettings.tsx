import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useUrl } from '../../context/UrlContext';
import { Alert } from 'react-native';
import { settingsStyles } from '../../styles/settings';

export const URLSettings = () => {
  const { theme } = useTheme();
  const { baseUrl, setBaseUrl } = useUrl();
  const [urlInput, setUrlInput] = React.useState(baseUrl);

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

  return (
    <View style={settingsStyles.section}>
      <LinearGradient
        colors={[theme.headerGradient[0], theme.headerGradient[1]]}
        style={settingsStyles.sectionHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[settingsStyles.sectionTitle, { color: theme.text }]}>URL Ayarları</Text>
      </LinearGradient>
      <View style={[settingsStyles.sectionContent, { backgroundColor: theme.cardBackground }]}>
        <View style={settingsStyles.urlContainer}>
          <View style={[settingsStyles.inputWrapper, {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            shadowColor: theme.shadowColor,
          }]}>
            <TextInput
              style={[settingsStyles.urlInput, { 
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
            style={settingsStyles.saveButton}
            onPress={handleUrlSave}
          >
            <LinearGradient
              colors={[theme.headerGradient[0], theme.headerGradient[1]]}
              style={settingsStyles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[settingsStyles.buttonText, { color: theme.text }]}>
                Kaydet
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
