import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { settingsStyles } from '../../styles/settings';
import { themes } from '../../context/ThemeContext';

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={settingsStyles.section}>
      <LinearGradient
        colors={[theme.headerGradient[0], theme.headerGradient[1]]}
        style={settingsStyles.sectionHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[settingsStyles.sectionTitle, { color: theme.text }]}>{t('theme')}</Text>
      </LinearGradient>
      <View style={[settingsStyles.sectionContent, { backgroundColor: theme.cardBackground }]}>
        <View style={settingsStyles.themeContainer}>
          {Object.entries(themes).map(([key, themeOption]) => (
            <TouchableOpacity
              key={key}
              style={[
                settingsStyles.themeButton,
                {
                  borderColor: theme.name === themeOption.name ? themeOption.primary : themeOption.border,
                  backgroundColor: themeOption.surface,
                },
                theme.name === themeOption.name && settingsStyles.selectedTheme,
              ]}
              onPress={() => setTheme(themeOption)}
            >
              <View
                style={[
                  settingsStyles.themePreview,
                  {
                    backgroundColor: themeOption.primary,
                  },
                ]}
              />
              <Text
                style={[
                  settingsStyles.themeName,
                  {
                    color: themeOption.textDark,
                  },
                ]}
              >
                {themeOption.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
