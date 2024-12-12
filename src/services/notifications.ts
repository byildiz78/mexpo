import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Bildirim davranışını yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    console.log('Requesting push notification permissions...');
    
    if (Platform.OS === 'android') {
      console.log('Setting up Android notification channel...');
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Existing permission status:', existingStatus);
    
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      console.log('Requesting permission...');
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
      console.log('New permission status:', finalStatus);
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permission not granted!');
      return null;
    }

    console.log('Getting Expo push token...');
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    console.log('Project ID:', projectId);
    
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId
    });
    console.log('Token received:', tokenData.data);
    
    return tokenData.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

export async function sendTokenToServer(token: string, userId: string, baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/api/expo/savetoken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Token registration response:', data);
    return data;
  } catch (error) {
    console.error('Error sending token to server:', error);
    throw error;
  }
}

// Notification listener setup
export function setupNotificationListeners() {
  // Uygulama açıkken gelen bildirimleri yakala
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
    // Bildirim zaten gösterildiği için tekrar göstermeye gerek yok
  });

  // Bildirime tıklanınca tetiklen
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response received:', response);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}

// Test bildirim gönderme fonksiyonu
export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Bildirimi",
      body: "Bu bir test bildirimidir",
      data: { data: 'test data' },
    },
    trigger: null, // Hemen gönder
  });
}
