import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import styles from '../style-sheet';

// Placeholder ad slides for the kiosk "attract screen" that plays
// before a customer interacts with the tablet. Replace with real
// promo copy / images from marketing when available.
const DEFAULT_ADS = [
  { id: '1', color: '#0D47A1', title: 'PULSE FITNESS', subtitle: "Pune's Premier Fitness Studio" },
  { id: '2', color: '#E0303A', title: 'Limited Time Offer', subtitle: 'Annual plans starting at ₹999/month' },
];

export default function SplashScreenAds({
  visible = true,
  ads = DEFAULT_ADS,
  rotateInterval = 3000,
  autoHideAfter = 9000,
  onDismiss = () => {},
}) {
  const [adIndex, setAdIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible || !ads.length) return undefined;

    const rotateTimer = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        setAdIndex((prev) => (prev + 1) % ads.length);
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }, rotateInterval);

    const hideTimer = autoHideAfter ? setTimeout(onDismiss, autoHideAfter) : null;

    return () => {
      clearInterval(rotateTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, ads, rotateInterval, autoHideAfter]);

  if (!ads.length) return null;
  const currentAd = ads[adIndex];

  return (
    <Modal visible={visible} animationType="fade" transparent={false} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={[styles.splashOverlay, { backgroundColor: currentAd.color }]}>
          <Animated.View style={[styles.splashContent, { opacity: fade }]}>
            <Text style={styles.splashTitle}>{currentAd.title}</Text>
            <Text style={styles.splashSubtitle}>{currentAd.subtitle}</Text>
          </Animated.View>
          <Text style={styles.splashHint}>Tap anywhere to continue</Text>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}