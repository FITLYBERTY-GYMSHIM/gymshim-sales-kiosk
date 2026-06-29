import { StyleSheet, Dimensions } from 'react-native';
import { COLORS as _COLORS, FONTS } from '../../styles/global-style-sheet';

// ─── Dimensions ───────────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.88;

const SCREEN_PADDING = 16;
const CARD_GAP       = 12;
const CARD_WIDTH     = (SCREEN_WIDTH - SCREEN_PADDING * 2 - CARD_GAP) / 2;

// ─── Safe COLORS fallback ─────────────────────────────────────────────────────
const COLORS = {
  white:          '#FFFFFF',
  screenBg:       '#F4F6FA',
  primaryDark:    '#0D2B52',
  primary:        '#1A56DB',
  accent:         '#1A56DB',
  textDark:       '#111827',
  mutedText:      '#6B7280',
  cardBackground: '#FFFFFF',
  border:         '#E5E7EB',
  ..._COLORS,
};

// ─── Color Palettes ───────────────────────────────────────────────────────────
export const C_THEME = {
  primary:     '#055075',
  accent:      '#055075',
  border:      '#D8DDE6',
  borderFocus: '#055075',
  bg:          '#FFFFFF',
  text:        '#1A1A2E',
  muted:       '#8A96A8',
  error:       '#D93025',
  divider:     '#E8ECF2',
  dark:        '#2C2C2E',
};

export const C = {
  primary:     '#0885C4',
  primaryDark: '#8AC4FF',
  bg:          '#FFFFFF',
  surface:     '#F8FAFF',
  border:      '#E2E8F0',
  borderFocus: '#1A56DB',
  text:        '#0F172A',
  muted:       '#94A3B8',
  error:       '#EF4444',
  success:     '#10B981',
  label:       '#374151',
};

// ─── Dashboard StyleSheet ─────────────────────────────────────────────────────
export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  scrollContent: {
    paddingBottom: 112,
  },

  // ── Hero / Banner ─────────────────────────────────────────────────────────
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
    
    maxWidth: 230,
  },
  bannerSubtitle: {
    color: COLORS.white,
    fontSize: 13,
    marginTop: 6,
    opacity: 0.9,
    
    maxWidth: 220,
  },
  bannerTextBlock: {
    flex: 1,
    justifyContent: 'center',
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

  // ── Section Header ────────────────────────────────────────────────────────
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
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    
  },

  // ── Strip (horizontal scroll cards) ──────────────────────────────────────
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
    
  },
  stripCardPlan: {
    fontSize: 14,
    color: COLORS.mutedText,
    marginTop: 2,
    
  },
  stripCardPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
    
  },

  // ── Category sections (Gym Workout, PT, Group Exercise, Liberty) ──────────
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
    
  },
  categorySubtitle: {
    fontSize: 15,
    color: COLORS.mutedText,
    marginTop: 1,
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // ── Plan Card ─────────────────────────────────────────────────────────────
  planCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 14,
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
    gap: 8,
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
    
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    
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
    
  },
  planSecondary: {
    fontSize: 10,
    color: COLORS.mutedText,
    marginTop: 2,
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

  // ── FAB ───────────────────────────────────────────────────────────────────
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 180,
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
    overflow: 'hidden',
  },
  fabButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    
    textAlign: 'center',
    lineHeight: 11,
    marginTop: 2,
  },

  // ── Selection Summary Bar ─────────────────────────────────────────────────
  selectionSummaryBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 18,
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
    fontSize: 15,
    fontWeight: '700',
    // 
  },
  selectionSummaryTotal: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 2,
    fontWeight: '800',
    // 
  },
  selectionSummaryNextButton: {
    backgroundColor: COLORS.white,
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 12,
  },
  selectionSummaryNextText: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: '800',
    // 
  },

  // ── Splash Overlay ────────────────────────────────────────────────────────
  splashOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  splashContent:  { alignItems: 'center' },
  splashTitle:    { color: COLORS.white, fontSize: 26, fontWeight: '800', textAlign: 'center' },
  splashSubtitle: { color: COLORS.white, fontSize: 14, marginTop: 8, textAlign: 'center', opacity: 0.9 },
  splashHint:     { position: 'absolute', bottom: 40, color: 'rgba(255,255,255,0.7)', fontSize: 12 },
});

// ─── Drawer / Payment StyleSheet ──────────────────────────────────────────────
export const styles = StyleSheet.create({
  bgPage: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    opacity: 0.4,
  },

  // ── Drawer ────────────────────────────────────────────────────────────────
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  drawerContainer: {
    position: 'absolute',
    bottom: -140,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 20,
  },
  dragHandleArea: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  dragHandle: {
    width: 100,
    height: 6,
    backgroundColor: '#d00000',
    borderRadius: 20,
  },

  // ── Form Layout ───────────────────────────────────────────────────────────
  section:       { backgroundColor: '#ececec', padding: 16 },
  titleRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle:  { fontSize: 22, fontWeight: '600', marginLeft: 10, color: '#111' },
  bioContainer:  { flexDirection: 'row' },
  formContainer: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fieldWrapper:  { width: '31.5%' },

  inputBox: {
    width: '100%',
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1976d2',
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  inputBoxFocused: { borderColor: '#1976d2', borderWidth: 2 },
  floatingLabel: {
    position: 'absolute',
    left: 10,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  inputField:  { fontSize: 15, color: '#111', padding: 0, margin: 0, height: 24 },
  dropdownRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputError:  { borderColor: '#d00000', borderWidth: 1.5 },
  errorText:   { color: '#d00000', fontSize: 14, marginTop: 2, marginLeft: 2 },

  // ── Avatar ────────────────────────────────────────────────────────────────
  avatarSection: { width: 100, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#bdbdbd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#666',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Modals / Dropdowns ────────────────────────────────────────────────────
  modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  dropdown:         { backgroundColor: '#fff', borderRadius: 10, width: 200, maxHeight: 200, elevation: 5 },
  dropdownItem:     { padding: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownItemText: { fontSize: 15, color: '#111' },

  pickerModal:      { backgroundColor: '#fff', borderRadius: 16, width: 280, paddingVertical: 8, elevation: 10 },
  pickerTitle:      { fontSize: 16, fontWeight: '700', textAlign: 'center', paddingVertical: 14, color: '#111', borderBottomWidth: 1, borderBottomColor: '#eee' },
  pickerOption:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24, gap: 14 },
  pickerOptionText: { fontSize: 16, color: '#111' },
  pickerDivider:    { height: 1, backgroundColor: '#eee', marginHorizontal: 16 },
  pickerCancel:     { marginTop: 4, borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 14, alignItems: 'center' },
  pickerCancelText: { fontSize: 15, color: '#d00000', fontWeight: '600' },

  // ── Two-column layout ─────────────────────────────────────────────────────
  middleContainer: { flexDirection: 'row', backgroundColor: '#fff' },
  leftColumn:      { flex: 1, padding: 16, borderRightWidth: 1, borderColor: '#ddd' },
  rightColumn:     { flex: 1, padding: 16 },

  // ── Membership / Billing ──────────────────────────────────────────────────
  membershipCard: {
    flexDirection: 'row',
    backgroundColor: '#ecffe9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  planTitle:    { color: '#888', fontWeight: '600', fontSize: 11 },
  planName:     { fontSize: 18, fontWeight: '600', marginTop: 2 },
  price:        { color: '#ff3333', fontWeight: 'bold', marginTop: 8, fontSize: 13 },
  verticalLine: { width: 1, height: 60, backgroundColor: '#ff3333', marginHorizontal: 12 },
  smallHeading: { color: '#d32f2f', fontWeight: '600', fontSize: 12 },
  smallValue:   { marginTop: 8, fontWeight: '500', fontSize: 13 },

  upiCard:     { height: 90, backgroundColor: '#d9efff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  upiLogo:     { width: 120, height: 50 },
  couponInput: { height: 46, borderWidth: 1, borderColor: '#2ecc71', borderRadius: 10, paddingHorizontal: 12, fontSize: 14 },

  billRow: { flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 18 },
  billText: { fontSize: 17 },
  billAmount: { fontSize: 19, 
    fontWeight: "bold" },
  discount: { fontSize: 19, 
    color: "#00c853", 
    fontWeight: "bold" },
  payBtn: { backgroundColor: "#E53E36", 
    height: 52, 
    borderRadius: 26, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 16 },
  payText: { color: "#fff", 
    fontSize: 20, 
    fontWeight: "bold" },
});

// ─── Enquiry Popup StyleSheet ─────────────────────────────────────────────────
export const enquiryStyles = StyleSheet.create({

  // ── Centered modal overlay ────────────────────────────────────────────────
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  popupCard: {
    width: '75%',
    maxHeight: SCREEN_HEIGHT * 0.88,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },

  // ── Header bar ────────────────────────────────────────────────────────────
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '800',
    
    color: '#111827',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scroll body ───────────────────────────────────────────────────────────
  popupBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },

  // ── Avatar ────────────────────────────────────────────────────────────────
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  enqAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1A56DB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  enqRow: {
    flexDirection: 'row',
    zIndex: 1,
  },
  enqRowOpen: {
    zIndex: 999,
  },
  rowGap: {
    width: 10,
  },
  fieldWrap: {
    marginBottom: 12,
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  fieldWrapOpen: {
    zIndex: 999,
  },

  // ── Input box ─────────────────────────────────────────────────────────────
  enqInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  enqInputBoxFocused: {
    borderColor: '#1A56DB',
    backgroundColor: '#F0F5FF',
  },
  enqInputBoxError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 6,
    justifyContent: 'center',
  },
  inputInner: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  floatLabel: {
    position: 'absolute',
    left: 0,
    top: 0,
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
  inlineDropItemActive: {
    backgroundColor: '#EEF4FF',
  },
  inlineDropText: {
    fontSize: 14,
    
    color: '#374151',
  },
  inlineDropTextActive: {
    color: '#1A56DB',
    
  },

  // ── Calendar modal ────────────────────────────────────────────────────────
  calModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  calCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    paddingBottom: 12,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },

  // ── Selection Summary (inside enquiry context) ────────────────────────────
  selectionSummaryCount: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  selectionSummaryTotal: {
    color: COLORS.white,
    fontSize: 20,
    marginTop: 2,
    fontWeight: '800',
  },
  selectionSummaryNextButton: {
    backgroundColor: COLORS.white,
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 12,
  },
  selectionSummaryNextText: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },

  // ── Success screen ────────────────────────────────────────────────────────
  successCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  successIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D2B52',
    
    marginBottom: 10,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  spinnerWrap: {
    width: 60,
    height: 60,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  spinnerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A56DB',
  },
  successCountdown: {
    fontSize: 14,
    color: '#6B7280',
    
    textAlign: 'center',
  },
  successCountdownBold: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D2B52',
    
  },

  // ── Submit button ─────────────────────────────────────────────────────────
  submitBtn: {
    backgroundColor: '#106FB2',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: '#1A56DB',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    
    letterSpacing: 0.3,
  },

  // ── buyButton / buyButtonText (enquiry context) ───────────────────────────
  buyButtonText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── FloatingInput text & label states ────────────────────────────────────
  // Base label: sits in the vertical centre of the input box
  floatLabel: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -9 }],   // half of fontSize 14 ≈ 9
    fontSize: 14,
    color: '#9CA3AF',
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
  // When focused OR has value: slide up and shrink
  floatLabelUp: {
    top: 4,
    transform: [{ translateY: 0 }],
    fontSize: 11,
    color: '#1A56DB',
  },
  // The actual text input inside FloatingInput / DropdownField
  enqInputText: {
    fontSize: 15,
    color: '#111827',
    paddingTop: 16,          // room for the floated label above
    paddingBottom: 2,
    margin: 0,
    height: 54,
  },
  // Inline validation error text below a field
  enqErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 3,
    marginLeft: 2,
  },

  // ── DateField ─────────────────────────────────────────────────────────────
  dateBox: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 6,
    minHeight: 54,
    justifyContent: 'center',
  },
  dateBoxFocused: {
    borderColor: '#1A56DB',
    backgroundColor: '#F0F5FF',
  },
  // Small label above the date row (always visible — not floating)
  dateLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  // Row that holds calendar icon + text input + picker button
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 2,
    margin: 0,
  },
  calendarBtn: {
    padding: 4,
    marginLeft: 4,
  },

  // ── MaritalStatus ─────────────────────────────────────────────────────────
  maritalRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  maritalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  maritalBtnActive: {
    borderColor: '#1A56DB',
    backgroundColor: '#EEF4FF',
  },
  maritalText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    flex: 1,
  },
  maritalTextActive: {
    color: '#1A56DB',
  },
  maritalRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maritalRadioActive: {
    borderColor: '#1A56DB',
  },
  maritalRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A56DB',
  },

  // ── Dropdown inline list ──────────────────────────────────────────────────
  inlineDropList: {
    position: 'absolute',
    top: 58,                 // just below the 54px input + border
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 999,
    overflow: 'hidden',
  },
  inlineDropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  // ── Calendar header / grid ────────────────────────────────────────────────
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  calNavBtn: {
    padding: 6,
  },
  calTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  calDayRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  calDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  calCellSelected: {
    backgroundColor: '#1A56DB',
  },
  calCellToday: {
    borderWidth: 1.5,
    borderColor: '#1A56DB',
  },
  calCellText: {
    fontSize: 13,
    color: '#111827',
  },
  calCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calCellTextToday: {
    color: '#1A56DB',
    fontWeight: '700',
  },
  calTodayBtn: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
  },
  calTodayBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A56DB',
  },

  // ── Popup backdrop (dim layer behind the card) ────────────────────────────
  popupBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export { COLORS };