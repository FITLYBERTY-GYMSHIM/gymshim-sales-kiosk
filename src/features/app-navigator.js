import { StyleSheet } from "react-native";

export const C = {
  primary: "#0D2F5E",
  accent: "#1B4F8A",
  border: "#D8DDE6",
  borderFocus: "#1B4F8A",
  bg: "#FFFFFF",
  text: "#1A1A2E",
  muted: "#8A96A8",
  error: "#D93025",
  divider: "#E8ECF2",
  dark: "#2C2C2E",
};

export const S = StyleSheet.create({
  // ── Screen / Card ─────────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: C.dark,
  },
  card: {
    backgroundColor: C.bg,
    borderRadius: 16,
    margin: 16,
    marginBottom: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
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
    paddingHorizontal: 6,
    gap: 6,
  },
  stepItemActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: C.primary,
  },
  stepBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBubbleText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  stepLabel: {
    fontSize: 11,
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
    paddingTop: 22,
  },

  // ── Typography ────────────────────────────────────────────────────────
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text,
    marginBottom: 5,
  },
  labelRequired: {
    color: C.error,
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: 14,
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
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
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
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: C.text,
    backgroundColor: C.bg,
    textAlignVertical: "top",
    minHeight: 100,
  },
  textareaFocused: {
    borderColor: C.borderFocus,
  },

  // ── Picker wrapper ────────────────────────────────────────────────────
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: C.bg,
  },
  pickerWrapperFocused: {
    borderColor: C.borderFocus,
  },
  picker: {
    fontSize: 13,
    color: C.text,
    height: 42,
  },

  // ── Toggle Group ──────────────────────────────────────────────────────
  toggleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bg,
  },
  toggleBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.primary,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: C.text,
  },
  toggleBtnTextActive: {
    fontWeight: "700",
    color: "#fff",
  },

  // ── Toggle Switch ─────────────────────────────────────────────────────
  switchTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.border,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  switchTrackOn: {
    backgroundColor: C.accent,
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // ── Grid helpers ──────────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    gap: 12,
  },
  col1: { flex: 1 },
  col2: { flex: 2 },

  // ── Divider ───────────────────────────────────────────────────────────
  divider: {
    borderTopWidth: 1,
    borderTopColor: C.divider,
    borderStyle: "dashed",
    marginVertical: 20,
  },

  // ── Footer buttons ────────────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: C.divider,
    marginTop: 16,
  },
  btnPrev: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrevText: {
    color: C.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  btnNext: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  // ── Success Screen ────────────────────────────────────────────────────
  successWrap: {
    paddingVertical: 60,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F0FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 30,
    color: C.primary,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 8,
  },
  successSub: {
    fontSize: 13,
    color: C.muted,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 28,
  },
  btnReset: {
    backgroundColor: C.primary,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  btnResetText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Checkbox row ──────────────────────────────────────────────────────
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    marginBottom: 6,
  },
  checkLabel: {
    fontSize: 13,
    color: C.text,
  },

  // ── Switch + label row ────────────────────────────────────────────────
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
});