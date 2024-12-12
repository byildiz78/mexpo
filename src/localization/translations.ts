interface Translation {
  // Settings
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
  
  // URL Settings
  save: string;
  error: string;
  success: string;
  urlMustStartWithHttpOrHttps: string;
  urlSavedSuccessfully: string;
  errorSavingUrl: string;
  
  // Token Settings
  noToken: string;
  currentToken: string;
  tokenEndpoint: string;
  copyToken: string;
  sendToken: string;
  tokenCopied: string;
  noTokenFound: string;
  tokenSent: string;
  tokenSendError: string;
  
  // Menu Items
  home: string;
  contact: string;
  about: string;
  logout: string;
  loading: string;
}

export const translations: { [key: string]: Translation } = {
  tr: {
    // Settings
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
    
    // URL Settings
    save: 'Kaydet',
    error: 'Hata',
    success: 'Başarılı',
    urlMustStartWithHttpOrHttps: 'URL http:// veya https:// ile başlamalıdır',
    urlSavedSuccessfully: 'URL başarıyla kaydedildi',
    errorSavingUrl: 'URL kaydedilirken bir hata oluştu',
    
    // Token Settings
    noToken: 'Token henüz alınmadı',
    currentToken: 'Mevcut Token',
    tokenEndpoint: 'Token Gönderim Adresi',
    copyToken: 'Token\'ı Kopyala',
    sendToken: 'Token\'ı Gönder',
    tokenCopied: 'Token panoya kopyalandı',
    noTokenFound: 'Push notification token bulunamadı',
    tokenSent: 'Token başarıyla gönderildi',
    tokenSendError: 'Token gönderilirken bir hata oluştu',
    
    // Menu Items
    home: 'Ana Sayfa',
    contact: 'İletişim',
    about: 'Hakkında',
    logout: 'Çıkış',
    loading: 'RobotPOS Data Manager Yükleniyor',
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
    
    // URL Settings
    save: 'Save',
    error: 'Error',
    success: 'Success',
    urlMustStartWithHttpOrHttps: 'URL must start with http:// or https://',
    urlSavedSuccessfully: 'URL saved successfully',
    errorSavingUrl: 'Error saving URL',
    
    // Token Settings
    noToken: 'No token received yet',
    currentToken: 'Current Token',
    tokenEndpoint: 'Token Endpoint',
    copyToken: 'Copy Token',
    sendToken: 'Send Token',
    tokenCopied: 'Token copied to clipboard',
    noTokenFound: 'Push notification token not found',
    tokenSent: 'Token sent successfully',
    tokenSendError: 'Error sending token',
    
    // Menu Items
    home: 'Home',
    contact: 'Contact',
    about: 'About',
    logout: 'Logout',
    loading: 'Loading RobotPOS Data Manager',
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
    
    // URL Settings
    save: 'Сохранить',
    error: 'Ошибка',
    success: 'Успех',
    urlMustStartWithHttpOrHttps: 'URL должен начинаться с http:// или https://',
    urlSavedSuccessfully: 'URL успешно сохранен',
    errorSavingUrl: 'Ошибка при сохранении URL',
    
    // Token Settings
    noToken: 'Токен еще не получен',
    currentToken: 'Текущий токен',
    tokenEndpoint: 'Адрес отправки токена',
    copyToken: 'Копировать токен',
    sendToken: 'Отправить токен',
    tokenCopied: 'Токен скопирован в буфер обмена',
    noTokenFound: 'Токен push-уведомлений не найден',
    tokenSent: 'Токен успешно отправлен',
    tokenSendError: 'Ошибка при отправке токена',
    
    // Menu Items
    home: 'Главная',
    contact: 'Контакты',
    about: 'О нас',
    logout: 'Выход',
    loading: 'Загрузка RobotPOS Data Manager',
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
    
    // URL Settings
    save: 'Yadda saxla',
    error: 'Xəta',
    success: 'Uğurlu',
    urlMustStartWithHttpOrHttps: 'URL http:// və ya https:// ilə başlamalıdır',
    urlSavedSuccessfully: 'URL uğurla yadda saxlanıldı',
    errorSavingUrl: 'URL yadda saxlanılarkən xəta baş verdi',
    
    // Token Settings
    noToken: 'Token hələ alınmayıb',
    currentToken: 'Cari Token',
    tokenEndpoint: 'Token Göndərmə Ünvanı',
    copyToken: 'Tokeni Kopyala',
    sendToken: 'Tokeni Göndər',
    tokenCopied: 'Token buferə kopyalandı',
    noTokenFound: 'Push bildiriş tokeni tapılmadı',
    tokenSent: 'Token uğurla göndərildi',
    tokenSendError: 'Token göndərilərkən xəta baş verdi',
    
    // Menu Items
    home: 'Ana Səhifə',
    contact: 'Əlaqə',
    about: 'Haqqında',
    logout: 'Çıxış',
    loading: 'RobotPOS Data Manager Yüklənir',
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
    
    // URL Settings
    save: 'حفظ',
    error: 'خطأ',
    success: 'نجاح',
    urlMustStartWithHttpOrHttps: 'يجب أن يبدأ URL بـ http:// أو https://',
    urlSavedSuccessfully: 'تم حفظ URL بنجاح',
    errorSavingUrl: 'خطأ في حفظ URL',
    
    // Token Settings
    noToken: 'لم يتم استلام الرمز بعد',
    currentToken: 'الرمز الحالي',
    tokenEndpoint: 'عنوان إرسال الرمز',
    copyToken: 'نسخ الرمز',
    sendToken: 'إرسال الرمز',
    tokenCopied: 'تم نسخ الرمز إلى الحافظة',
    noTokenFound: 'لم يتم العثور على رمز الإشعارات',
    tokenSent: 'تم إرسال الرمز بنجاح',
    tokenSendError: 'خطأ في إرسال الرمز',
    
    // Menu Items
    home: 'الرئيسية',
    contact: 'اتصل بنا',
    about: 'حول',
    logout: 'خروج',
    loading: 'جاري تحميل RobotPOS Data Manager',
  },
};
