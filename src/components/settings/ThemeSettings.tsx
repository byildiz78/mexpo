import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, themes } from '../../context/ThemeContext';
import { settingsStyles } from '../../styles/settings';

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <View style={settingsStyles.section}>
      <LinearGradient
        colors={[theme.headerGradient[0], theme.headerGradient[1]]}
        style={settingsStyles.sectionHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[settingsStyles.sectionTitle, { color: theme.text }]}>Tema Seçenekleri</Text>
      </LinearGradient>
      <View style={[settingsStyles.sectionContent, { backgroundColor: theme.cardBackground }]}>
        <View style={settingsStyles.themeContainer}>
          {Object.values(themes).map((themeOption) => (
            <TouchableOpacity
              key={themeOption.name}
              onPress={() => setTheme(themeOption)}
              style={[
                settingsStyles.themeButton,
                {
                  backgroundColor: themeOption.cardBackground,
                  borderColor: theme.name === themeOption.name ? themeOption.primary : theme.border,
                  shadowColor: theme.shadowColor,
                },
                theme.name === themeOption.name && settingsStyles.selectedTheme,
              ]}
            >
              <LinearGradient
                colors={[themeOption.headerGradient[0], themeOption.headerGradient[1]]}
                style={settingsStyles.themePreview}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <Text style={[
                settingsStyles.themeName,
                { color: themeOption.primary }
              ]}>
                {themeOption.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
