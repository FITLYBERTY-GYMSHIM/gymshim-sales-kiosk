import { StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS } from '../../styles/global-style-sheet';



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
    // fontFamily: 'Nunito_800ExtraBold',
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    // fontFamily: 'Nunito_800ExtraBold',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    marginTop: 2,
    // fontFamily: 'Nunito_600SemiBold',
  },
  rightSlot: {
    marginLeft: 8,
  },
});
export { COLORS };