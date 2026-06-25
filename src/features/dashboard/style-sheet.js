import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../styles/global-style-sheet';

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Central color palette for the dashboard. Tweak these to match
// the brand kit exactly once you have hex values from design.


const SCREEN_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - SCREEN_PADDING * 2 - CARD_GAP) / 2;

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  scrollContent: {
    paddingBottom: 112,
  },

  heroShell: {
    marginHorizontal: 0,
    marginTop: 0,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.primaryDark,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  // ---------- Banner ads ----------
  bannerWrapper: {
    width: SCREEN_WIDTH,
    height: 220,
  },
  bannerSlide: {
    width: SCREEN_WIDTH,
    height: 220,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    maxWidth: 230,
  },
  bannerSubtitle: {
    color: COLORS.white,
    fontSize: 13,
    marginTop: 6,
    opacity: 0.9,
    fontFamily: 'Nunito_600SemiBold',
    maxWidth: 220,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: COLORS.white,
    width: 18,
  },

  // ---------- "Top Memberships" quick strip ----------
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_PADDING,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginRight: 8,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
    letterSpacing: 0.3,
    fontFamily: 'Nunito_800ExtraBold',
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    fontFamily: 'Nunito_700Bold',
  },
  stripContent: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 4,
  },
  stripCard: {
    width: 200,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  stripBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  stripBadgeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  stripCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'Nunito_700Bold',
  },
  stripCardPlan: {
    fontSize: 14,
    color: COLORS.mutedText,
    marginTop: 2,
    fontFamily: 'Nunito_600SemiBold',
  },
  stripCardPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
    fontFamily: 'Nunito_800ExtraBold',
  },

  // ---------- Category sections (Gym Workout, PT, Group Exercise, Liberty) ----------
  categorySection: {
    marginTop: 16,
    paddingHorizontal: SCREEN_PADDING,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryHeaderText: {
    marginLeft: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'Nunito_800ExtraBold',
  },
  categorySubtitle: {
    fontSize: 15,
    color: COLORS.mutedText,
    marginTop: 1,
    fontFamily: 'Nunito_400Regular',
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 20,
    marginBottom: CARD_GAP,
    minHeight: 160,
    justifyContent: 'flex-start',
    shadowColor: '#0B2340',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: '#0D2B52',
  },
  cardHeaderRow: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  popularBadgeText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  // popularBadgePlaceholder: {
  //   minWidth: 54,
  // },
  checkBoxBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#B7C6D3',
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxBoxSelected: {
    backgroundColor: '#0D2B52',
    borderColor: '#0D2B52',
  },
  durationLabel: {
    fontSize: 17,
    color: COLORS.mutedText,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 6,
  },
  durationRow: {            
    flexDirection: 'row',
    alignItems: 'center',
    gap:8,
    marginBottom: 6,         
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceMain: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: '800',
  },
  priceUnit: {
    fontSize: 16,
    color: COLORS.mutedText,
    marginLeft: 6,
  },
  subPrice: {
    fontSize: 15,
    color: COLORS.mutedText,
    marginTop: 6,
  },
  buyButtonFull: {
    backgroundColor: '#E6EDF4',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buyButtonFullText: {
    color: '#2F3A44',
    fontSize: 18,
    fontWeight: '700',
  },
  bannerTextBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  planBadge: {
    position: 'absolute',
    top: 8,
    left: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  planBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },
  planCheckBox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B7C6D3',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  planLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mutedText,
    marginTop: 20,
    fontFamily: 'Nunito_700Bold',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    fontFamily: 'Nunito_800ExtraBold',
  },
  planPriceLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  planPriceSuffix: {
    fontSize: 10,
    color: COLORS.mutedText,
    marginLeft: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  planSecondary: {
    fontSize: 10,
    color: COLORS.mutedText,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  buyButton: {
    backgroundColor: '#DDE6EF',
    borderRadius: 999,
    paddingVertical: 7,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buyButtonText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },

  // ---------- Floating action button ----------
  fab: {
    position: 'absolute',
    right: 20,
    bottom:100,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  selectionSummaryBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    backgroundColor: '#0D2B52',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  selectionSummaryCount: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },
  selectionSummaryTotal: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 2,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
  },
  selectionSummaryNextButton: {
    backgroundColor: COLORS.white,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectionSummaryNextText: {
    color: '#0D2B52',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
  },

  // ---------- Splash screen ads (attract / idle screen) ----------
  splashOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  splashContent: {
    alignItems: 'center',
  },
  splashTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  splashSubtitle: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  splashHint: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
});



export const C = {
  primary: "#055075",
  accent: "#055075",
  border: "#D8DDE6",
  borderFocus: "#055075",
  bg: "#FFFFFF",
  text: "#1A1A2E",
  muted: "#8A96A8",
  error: "#D93025",
  divider: "#E8ECF2",
  dark: "#2C2C2E",
};

export const S = StyleSheet.create({

  // ── Backdrop ──────────────────────────────────────────────────────────
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  // ── Drawer ────────────────────────────────────────────────────────────
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: C.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    // overflow: "hidden" -- REMOVED: yeh dropdown ko clip karta tha
  },

  // ── Drag Handle ───────────────────────────────────────────────────────
  handleArea: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CCCCCC",
  },

  // ── Step Bar ──────────────────────────────────────────────────────────
  stepBar: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: C.divider,
    backgroundColor: C.bg,
  },
  stepItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 2.5,
    borderBottomColor: "transparent",
  },
  stepItemActive: {
    borderBottomColor: C.primary,
  },
  stepBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  stepBubbleText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: C.muted,
  },
  stepLabelActive: {
    fontWeight: "700",
    color: C.primary,
  },

  // ── Page content ──────────────────────────────────────────────────────
  pageContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },

  // ── Typography ────────────────────────────────────────────────────────
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
    marginBottom: 6,
  },
  labelRequired: {
    color: C.error,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.text,
    marginBottom: 14,
  },
  sectionTitleBlue: {
    color: C.accent,
  },

  // ── Field wrapper ─────────────────────────────────────────────────────
  field: {
    marginBottom: 14,
  },

  // ── TextInput ─────────────────────────────────────────────────────────
  input: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: C.text,
    backgroundColor: C.bg,
  },
  inputFocused: {
    borderColor: C.borderFocus,
  },
  textarea: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: C.text,
    backgroundColor: C.bg,
    textAlignVertical: "top",
    minHeight: 100,
  },
  textareaFocused: {
    borderColor: C.borderFocus,
  },

  // ── Picker ────────────────────────────────────────────────────────────
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    // overflow: "hidden" -- REMOVED: clips dropdown on web
    backgroundColor: C.bg,
  },
  picker: {
    fontSize: 15,
    color: C.text,
    height: 48,
  },

  // ── Toggle Group ──────────────────────────────────────────────────────
  toggleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bg,
    marginRight: 8,
    marginBottom: 8,
  },
  toggleBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.primary,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: C.text,
  },
  toggleBtnTextActive: {
    fontWeight: "700",
    color: "#fff",
  },

  // ── Grid helpers ──────────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    marginBottom: 0,
  },
  col1: {
    flex: 1,
    marginRight: 10,
  },
  col2: {
    flex: 2,
    marginRight: 10,
  },

  // ── Divider ───────────────────────────────────────────────────────────
  divider: {
    borderTopWidth: 1,
    borderTopColor: C.divider,
    borderStyle: "dashed",
    marginVertical: 18,
  },

  // ── Footer ────────────────────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: C.divider,
    backgroundColor: C.bg,
  },
  btnPrev: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  btnPrevText: {
    color: C.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  btnNext: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  // ── Success Screen ────────────────────────────────────────────────────
  successWrap: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E8F0FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 34,
    color: C.primary,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 12,
  },
  successSub: {
    fontSize: 15,
    color: C.muted,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
    marginBottom: 30,
  },
  spinner: {
    width: 50,
    height: 50,
    borderWidth: 5,
    borderRadius: 25,
    borderColor: "#DCEAF8",
    borderTopColor: C.primary,
    marginBottom: 28,
  },
  redirectText: {
    fontSize: 16,
    color: "#6B7A90",
    textAlign: "center",
  },
  redirectCount: {
    color: C.primary,
    fontWeight: "700",
    fontSize: 18,
  },

  // ── Calendar Modal ────────────────────────────────────────────────────
  calBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  calBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  calArrow: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: C.divider,
  },
  calArrowText: {
    fontSize: 24,
    color: C.primary,
    fontWeight: "700",
    lineHeight: 28,
  },
  calTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.text,
  },
  calDayRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  calDayName: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: C.muted,
    paddingVertical: 4,
  },
  calGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calCell: {
    width: "14.2857%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
  },
  calCellSelected: {
    backgroundColor: C.primary,
  },
  calCellToday: {
    backgroundColor: C.divider,
  },
  calCellText: {
    fontSize: 15,
    color: C.text,
  },
  calCellTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  calCellTextToday: {
    color: C.primary,
    fontWeight: "700",
  },
  calCancelBtn: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.divider,
  },
  calCancelText: {
    fontSize: 16,
    color: C.muted,
    fontWeight: "600",
  },

  // ── Date Picker Button ────────────────────────────────────────────────
  dateBtn: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: C.bg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateBtnText: {
    fontSize: 15,
    color: C.text,
  },
  dateBtnPlaceholder: {
    fontSize: 15,
    color: C.muted,
  },
  dateIcon: {
    fontSize: 17,
  },

  // ── Checkbox / Switch row ─────────────────────────────────────────────
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  checkLabel: {
    fontSize: 15,
    color: C.text,
    marginLeft: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  switchRowTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.text,
    marginBottom: 0,
    marginRight: 10,
  },
});
export { COLORS };
