import { StyleSheet, Platform, StatusBar } from 'react-native';

// Self-contained palette so this shared component doesn't depend on any
// one feature. Keep these in sync with the colors used in
// src/features/dashboard/style-sheet.js if you want a single brand source,
// or move both into a top-level src/styles/global-style-sheet.js later.
export const COLORS = {
  primary: '#0E5B8F',
  primaryDark: '#0A5A7E',
  accent: '#E53E36',
  white: '#FFFFFF',
};

export default StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 10) : 10,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'Nunito_600SemiBold',
  },
  rightSlot: {
    marginLeft: 8,
  },
});