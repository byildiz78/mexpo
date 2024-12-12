import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerNavigationProp } from '@react-navigation/drawer';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, StyleSheet, TouchableOpacity, View, SafeAreaView, Platform, StatusBar, Animated, ViewStyle, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpScreen from './src/screens/HelpScreen';
import SupportScreen from './src/screens/SupportScreen';
import ContactScreen from './src/screens/ContactScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { UrlProvider } from './src/context/UrlContext';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import LoadingScreen from './src/components/LoadingScreen';
import { setupNotificationListeners } from './src/services/notifications';

// Bildirim davranışını yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Drawer = createDrawerNavigator();

type RootDrawerParamList = {
  Home: undefined;
  Settings: undefined;
  About: undefined;
  Contact: undefined;
};

type DrawerScreenProps = DrawerContentComponentProps & {
  navigation: DrawerNavigationProp<RootDrawerParamList>;
};

interface CustomHeaderProps {
  navigation: DrawerNavigationProp<RootDrawerParamList>;
}

function CustomHeader({ navigation }: CustomHeaderProps) {
  const { theme } = useTheme();
  const [springAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(springAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'transparent' }}>
      <LinearGradient
        colors={[theme.headerGradient[0], theme.headerGradient[1], 'transparent']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={[styles.menuButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
          >
            <MaterialIcons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.titleContainer,
              {
                transform: [
                  { scale: springAnim },
                  {
                    translateY: springAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.titleContent}>
              <Text style={[styles.title, { color: theme.text }]}>robotPOS</Text>
              <Text style={[styles.subtitle, { color: theme.text }]}>Data Manager</Text>
            </View>
          </Animated.View>

          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
          >
            <MaterialIcons name="notifications" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

interface CustomDrawerProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomDrawerContent(props: DrawerScreenProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const menuItems = [
    { name: t('home'), icon: 'home', route: 'Home' },
    { name: t('contact'), icon: 'phone', route: 'Contact' },
    { name: t('about'), icon: 'info', route: 'About' },
    { name: t('settings'), icon: 'settings', route: 'Settings' },
  ];

  return (
    <LinearGradient
      colors={[theme.background, theme.primary + '20']}
      style={styles.drawerContainer}
    >
      <View style={[styles.drawerHeader]}>
        <LinearGradient
          colors={[theme.primary, theme.primary + '80']}
          style={styles.headerContainer}
        >
          <Text style={styles.headerTitle}>RobotPOS</Text>
          <Text style={styles.headerSubtitle}>Data Manager</Text>
        </LinearGradient>
      </View>
      <View style={styles.drawerContent}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => props.navigation.navigate(item.route)}
            style={[
              styles.drawerItem,
              props.state.index === index && { backgroundColor: theme.primary + '30' }
            ]}
          >
            <MaterialIcons
              name={item.icon}
              size={24}
              color={props.state.index === index ? theme.primary : theme.secondary}
            />
            <Text style={[
              styles.drawerLabel,
              { color: props.state.index === index ? theme.primary : theme.secondary }
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => {
            // Çıkış işlemleri burada yapılacak
            props.navigation.closeDrawer();
          }}
          style={styles.drawerItem}
        >
          <MaterialIcons
            name="logout"
            size={24}
            color={theme.secondary}
          />
          <Text style={[styles.drawerLabel, { color: theme.secondary }]}>
            {t('logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function getIconName(routeName: string) {
  switch (routeName) {
    case 'Ana Sayfa':
      return 'home';
    case 'Ayarlar':
      return 'settings';
    case 'Yardım':
      return 'help';
    case 'Destek':
      return 'support';
    case 'İletişim':
      return 'contact-support';
    default:
      return 'circle';
  }
}

function AppNavigator() {
  const { theme } = useTheme();
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        drawerStyle: {
          width: 280,
          backgroundColor: theme.background,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.7)',
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          drawerLabel: 'Home',
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
        }}
      />
      <Drawer.Screen 
        name="About" 
        component={HelpScreen}
        options={{
          drawerLabel: 'About',
        }}
      />
      <Drawer.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{
          drawerLabel: 'Contact',
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bildirim listenerlarını kur
    const unsubscribe = setupNotificationListeners();

    // Başlangıç animasyonu için 3 saniye bekle
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <UrlProvider>
            <LoadingScreen message="RobotPOS Data Manager Yükleniyor" />
          </UrlProvider>
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <UrlProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </UrlProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
  } as ViewStyle,
  notificationButton: {
    padding: 8,
    borderRadius: 12,
  } as ViewStyle,
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  titleContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    height: 150,
    marginBottom: 10,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  drawerLabel: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
  },
});
