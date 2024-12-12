import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Yükleniyor...' }: LoadingScreenProps) {
  const { theme } = useTheme();
  const spinValue = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);
  const pulseAnim = new Animated.Value(1);
  const circleAnim = new Animated.Value(0);

  useEffect(() => {
    // Dönen animasyon
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Nabız animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Daire animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(circleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(circleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade ve scale animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const circleScale = circleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 0.8],
  });

  const circleOpacity = circleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.2, 0.4],
  });

  return (
    <LinearGradient
      colors={[...theme.headerGradient, 'transparent']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Arka plan daireleri */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [{ scale: circleScale }],
            opacity: circleOpacity,
            backgroundColor: theme.primary,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [{ scale: circleScale }],
            opacity: circleOpacity * 0.5,
            backgroundColor: theme.secondary,
            position: 'absolute',
            right: 0,
            bottom: 0,
          },
        ]}
      />

      {/* Ana içerik */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Animated.View
            style={{
              transform: [{ rotate: spin }, { scale: pulseAnim }],
            }}
          >
            <MaterialIcons name="settings" size={60} color={theme.text} />
          </Animated.View>
        </View>

        <Animated.Text
          style={[
            styles.title,
            {
              color: theme.text,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          robotPOS Data Manager
        </Animated.Text>

        <Text style={[styles.message, { color: theme.text }]}>{message}</Text>

        <View style={styles.dotsContainer}>
          <LoadingDots color={theme.text} />
        </View>
      </Animated.View>

      {/* Alt bilgi */}
      <Animated.Text
        style={[
          styles.version,
          {
            color: theme.text,
            opacity: fadeAnim,
          },
        ]}
      >
        Versiyon 1.0.0
      </Animated.Text>
    </LinearGradient>
  );
}

function LoadingDots({ color }: { color: string }) {
  const [dots, setDots] = React.useState('');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.Text style={[styles.dots, { color, opacity: fadeAnim }]}>
      {dots}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backgroundCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    opacity: 0.2,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  message: {
    fontSize: 18,
    opacity: 0.9,
    marginBottom: 20,
    textAlign: 'center',
  },
  dotsContainer: {
    height: 30,
    justifyContent: 'center',
  },
  dots: {
    fontSize: 40,
    letterSpacing: 3,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    opacity: 0.7,
  },
});
