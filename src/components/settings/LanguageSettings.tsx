import React from 'react';
import { View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { settingsStyles } from '../../styles/settings';

export const LanguageSettings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();

  const languages = [
    { 
      code: 'tr', 
      name: 'Turkish',
    },
    { 
      code: 'en', 
      name: 'English',
    },
    { 
      code: 'ru', 
      name: 'Russian',
    },
    { 
      code: 'az', 
      name: 'Azerbaijani',
    },
    { 
      code: 'ar', 
      name: 'Arabic',
    },
  ];

  return (
    <View style={settingsStyles.section}>
      <LinearGradient
        colors={[theme.headerGradient[0], theme.headerGradient[1]]}
        style={settingsStyles.sectionHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[settingsStyles.sectionTitle, { color: theme.text }]}>{t('language')}</Text>
      </LinearGradient>
      <View style={[settingsStyles.sectionContent, { backgroundColor: theme.cardBackground }]}>
        <View style={[settingsStyles.pickerContainer, { 
          borderColor: theme.border,
          backgroundColor: theme.inputBackground,
        }]}>
          <Picker
            selectedValue={language}
            onValueChange={(itemValue) => setLanguage(itemValue)}
            style={settingsStyles.picker}
            itemStyle={Platform.OS === 'ios' ? settingsStyles.pickerItemIOS : undefined}
          >
            {languages.map((lang) => (
              <Picker.Item
                key={lang.code}
                label={lang.name}
                value={lang.code}
                color={theme.textDark}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};
