import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles, { COLORS } from './style-sheet';

/**
 * Shared top header bar.
 *
 * Usage on the dashboard:
 *   <Header title="PULSE FITNESS" subtitle="Pune's Premier Fitness Studio" />
 *
 * Usage on a sub-screen (e.g. "See all memberships"):
 *   <Header title="All Memberships" showBack onBackPress={() => navigation.goBack()} />
 */
export default function Header({
  title = 'PULSE FITNESS',
  subtitle,
  logoText = 'PF',
  showBack = false,
  onBackPress,
  rightContent,
}) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.container}>
        {showBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>{logoText}</Text>
          </View>
        )}

        <View style={styles.textWrapper}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightContent ? <View style={styles.rightSlot}>{rightContent}</View> : null}
      </View>
    </>
  );
}