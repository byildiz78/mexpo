interface Translation {
  settings: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  urlSettings: string;
  baseUrl: string;
  tokenSettings: string;
  token: string;
  copy: string;
  language: string;
  turkish: string;
  english: string;
  russian: string;
  azerbaijani: string;
  arabic: string;
}

export const translations: { [key: string]: Translation } = {
  tr: {
    settings: 'Ayarlar',
    theme: 'Tema',
    darkMode: 'Koyu Mod',
    lightMode: 'Açık Mod',
    urlSettings: 'URL Ayarları',
    baseUrl: 'Ana URL',
    tokenSettings: 'Token Ayarları',
    token: 'Token',
    copy: 'Kopyala',
    language: 'Dil',
    turkish: 'Türkçe',
    english: 'İngilizce',
    russian: 'Rusça',
    azerbaijani: 'Azerbaycan Türkçesi',
    arabic: 'Arapça',
  },
  en: {
    settings: 'Settings',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    urlSettings: 'URL Settings',
    baseUrl: 'Base URL',
    tokenSettings: 'Token Settings',
    token: 'Token',
    copy: 'Copy',
    language: 'Language',
    turkish: 'Turkish',
    english: 'English',
    russian: 'Russian',
    azerbaijani: 'Azerbaijani',
    arabic: 'Arabic',
  },
  ru: {
    settings: 'Настройки',
    theme: 'Тема',
    darkMode: 'Темный режим',
    lightMode: 'Светлый режим',
    urlSettings: 'Настройки URL',
    baseUrl: 'Базовый URL',
    tokenSettings: 'Настройки токена',
    token: 'Токен',
    copy: 'Копировать',
    language: 'Язык',
    turkish: 'Турецкий',
    english: 'Английский',
    russian: 'Русский',
    azerbaijani: 'Азербайджанский',
    arabic: 'Арабский',
  },
  az: {
    settings: 'Parametrlər',
    theme: 'Tema',
    darkMode: 'Qaranlıq Rejim',
    lightMode: 'İşıqlı Rejim',
    urlSettings: 'URL Parametrləri',
    baseUrl: 'Əsas URL',
    tokenSettings: 'Token Parametrləri',
    token: 'Token',
    copy: 'Kopyala',
    language: 'Dil',
    turkish: 'Türkcə',
    english: 'İngiliscə',
    russian: 'Rusca',
    azerbaijani: 'Azərbaycanca',
    arabic: 'Ərəbcə',
  },
  ar: {
    settings: 'الإعدادات',
    theme: 'المظهر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    urlSettings: 'إعدادات URL',
    baseUrl: 'URL الأساسي',
    tokenSettings: 'إعدادات الرمز',
    token: 'الرمز',
    copy: 'نسخ',
    language: 'اللغة',
    turkish: 'التركية',
    english: 'الإنجليزية',
    russian: 'الروسية',
    azerbaijani: 'الأذربيجانية',
    arabic: 'العربية',
  },
};
