import { StyleSheet, Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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