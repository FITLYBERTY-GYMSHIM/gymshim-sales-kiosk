import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
  PanResponder,
  ActivityIndicator,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  Easing,
} from "react-native";
import { C, S } from "../style-sheet";
import ReactDOM from "react-dom";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.85;

// ─────────────────────────────────────────────────────────────────────────────
// Saved Enquiry Data
// ─────────────────────────────────────────────────────────────────────────────

export let savedEnquiryData = null;

export function getSavedEnquiry() {
  return savedEnquiryData;
}

function saveEnquiry(formData) {
  savedEnquiryData = {
    firstName:        formData.firstName        || null,
    middleName:       formData.middleName        || null,
    lastName:         formData.lastName          || null,
    dob:              formData.dob               || null,
    gender:           formData.gender            || null,
    marital:          formData.marital           || null,
    anniversaryDate:  formData.anniversaryDate   || null,
    mobile:           formData.mobile            || null,
    landline:         formData.landline          || null,
    emergency:        formData.emergency         || null,
    email:            formData.email             || null,
    address:          formData.address           || null,
    apartment:        formData.apartment         || null,
    pincode:          formData.pincode           || null,
    healthChallenges: formData.healthChallenges  || null,
    fitnessGoals:     formData.fitnessGoals      || null,
    exercising:       formData.exercising        || null,
    gymService:       formData.gymService        || null,
    commitmentDate:   formData.commitmentDate    || null,
    trialEnabled:     formData.trialEnabled      || false,
    trialDate:        formData.trialDate         || null,
    trialTime:        formData.trialTime         || null,
    trialAssign:      formData.trialAssign       || null,
    leadType:         formData.leadType          || null,
    employeeReferral: formData.employeeReferral  || null,
    otherReferral:    formData.otherReferral     || null,
    hearAboutUs:      formData.hearAboutUs       || null,
    personalityType:  formData.personalityType   || null,
    budget:           formData.budget            || null,
    remarks:          formData.remarks           || null,
    followUp:         formData.followUp          || false,
    submittedAt:      new Date().toISOString(),
  };
  console.log("── Enquiry Saved ──", savedEnquiryData);
  return savedEnquiryData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = {
  0: [
    { key: "firstName", label: "First Name" },
    { key: "mobile",    label: "Mobile Number" },
  ],
  1: [
    { key: "gymService", label: "Gym Services" },
    { key: "leadType",   label: "Lead Type" },
  ],
  2: [],
};

function validate(step, formData) {
  const errors = {};
  REQUIRED_FIELDS[step].forEach(({ key, label }) => {
    if (!formData[key] || formData[key].toString().trim() === "") {
      errors[key] = `${label} is required`;
    }
  });
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Extra styles (mobile only)
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  inputError: {
    borderColor: C.error,
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 11,
    color: C.error,
    marginTop: 3,
    marginLeft: 2,
  },
  selBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    height: 44,
  },
  selValueText: {
    fontSize: 15,
    color: C.text,
    flex: 1,
  },
  selPlaceholderText: {
    fontSize: 15,
    color: C.muted,
    flex: 1,
  },
  selArrow: {
    fontSize: 10,
    color: C.muted,
    marginLeft: 6,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  dropCard: {
    position: "absolute",
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.78,
    maxHeight: 320,
    backgroundColor: C.bg,
    borderRadius: 14,
    top: "28%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 16,
  },
  dropTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: C.muted,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  optionSelected: {
    backgroundColor: "#E8F0FB",
  },
  optionText: {
    fontSize: 15,
    color: C.text,
  },
  optionTextSelected: {
    color: C.primary,
    fontWeight: "700",
  },
  checkMark: {
    fontSize: 14,
    color: C.primary,
    fontWeight: "700",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <Text style={S.label}>
      {children}
      {required && <Text style={S.labelRequired}> *</Text>}
    </Text>
  );
}

function Field({ label, required, children, error }) {
  return (
    <View style={S.field}>
      <Label required={required}>{label}</Label>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ── Web Field wrapper ─────────────────────────────────────────────────────────
function WField({ label, required, children, error }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 15,
        fontWeight: 600,
        color: "#1A1A2E",
        marginBottom: 6,
        display: "block",
      }}>
        {label}
        {required && <span style={{ color: "#D93025" }}> *</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "#D93025", marginTop: 3, display: "block" }}>{error}</span>}
    </div>
  );
}

function StyledTextInput({ placeholder, value, onChange, multiline = false, rows = 1, hasError }) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={C.muted}
      value={value || ""}
      onChangeText={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      multiline={multiline}
      numberOfLines={multiline ? rows : 1}
      style={[
        multiline ? S.textarea : S.input,
        focused && (multiline ? S.textareaFocused : S.inputFocused),
        hasError && styles.inputError,
      ]}
    />
  );
}

// ── Web text input ────────────────────────────────────────────────────────────
function WTextInput({ placeholder, value, onChange, multiline = false, rows = 4, hasError }) {
  const baseStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: `1.5px solid ${hasError ? "#D93025" : "#D8DDE6"}`,
    borderRadius: 8,
    paddingLeft: 14,
    paddingRight: 14,
    fontSize: 15,
    color: "#1A1A2E",
    backgroundColor: "#FFFFFF",
    fontFamily: "inherit",
    outline: "none",
  };
  if (multiline) {
    return (
      <textarea
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{ ...baseStyle, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
        onFocus={(e) => { e.target.style.borderColor = "#055075"; }}
        onBlur={(e)  => { e.target.style.borderColor = hasError ? "#D93025" : "#D8DDE6"; }}
      />
    );
  }
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...baseStyle, height: 44 }}
      onFocus={(e) => { e.target.style.borderColor = "#055075"; }}
      onBlur={(e)  => { e.target.style.borderColor = hasError ? "#D93025" : "#D8DDE6"; }}
    />
  );
}

// ── Web Select ────────────────────────────────────────────────────────────────
function WSelect({ placeholder, value, onChange, options, hasError }) {
  const [open, setOpen]   = useState(false);
  const [rect, setRect]   = useState(null);
  const triggerRef        = useRef(null);

  const handleOpen = () => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setOpen((o) => !o);
  };

  const dropdown = open && rect && ReactDOM.createPortal(
    <>
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99998 }} />
      <div style={{
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
        backgroundColor: "#FFFFFF",
        border: "1.5px solid #D8DDE6",
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        maxHeight: 220,
        overflowY: "auto",
        fontFamily: "inherit",
      }}>
        {options.map((o) => {
          const sel = o === value;
          return (
            <div
              key={o}
              onClick={(e) => { e.stopPropagation(); onChange(o); setOpen(false); }}
              style={{
                padding: "10px 14px",
                fontSize: 14,
                color: sel ? "#055075" : "#1A1A2E",
                fontWeight: sel ? 700 : 400,
                backgroundColor: sel ? "#E8F0FB" : "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #E8ECF2",
              }}
              onMouseEnter={(e) => { if (!sel) e.currentTarget.style.backgroundColor = "#F5F7FA"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sel ? "#E8F0FB" : "#FFFFFF"; }}
            >
              <span>{o}</span>
              {sel && <span style={{ fontSize: 12, color: "#055075" }}>✓</span>}
            </div>
          );
        })}
      </div>
    </>,
    document.body
  );

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 44,
          paddingLeft: 12,
          paddingRight: 12,
          border: `1.5px solid ${hasError ? "#D93025" : "#D8DDE6"}`,
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
          cursor: "pointer",
          fontSize: 14,
          color: value ? "#1A1A2E" : "#8A96A8",
          fontFamily: "inherit",
          userSelect: "none",
          boxSizing: "border-box",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <span style={{ fontSize: 10, color: "#8A96A8", marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
      </div>
      {dropdown}
    </div>
  );
}

// ── Web Toggle Group ──────────────────────────────────────────────────────────
function WToggleGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: `1.5px solid ${active ? "#055075" : "#D8DDE6"}`,
              backgroundColor: active ? "#055075" : "#FFFFFF",
              color: active ? "#fff" : "#1A1A2E",
              fontSize: 14,
              fontWeight: active ? 700 : 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Web Date Input ────────────────────────────────────────────────────────────
function WDateInput({ value, onChange }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        max="2099-12-31"
        min="1900-01-01"
        style={{
          width: "100%",
          height: 44,
          boxSizing: "border-box",
          border: "1.5px solid #D8DDE6",
          borderRadius: 8,
          paddingLeft: 14,
          paddingRight: 14,
          fontSize: 15,
          color: value ? "#1A1A2E" : "#8A96A8",
          backgroundColor: "#FFFFFF",
          fontFamily: "inherit",
          outline: "none",
          cursor: "pointer",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#055075"; }}
        onBlur={(e)  => { e.target.style.borderColor = "#D8DDE6"; }}
      />
    </div>
  );
}

// ── Web Switch ────────────────────────────────────────────────────────────────
function WSwitch({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: value ? "#055075" : "#D8DDE6",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: 2,
        left: value ? 22 : 2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  );
}

// ── Mobile primitives ─────────────────────────────────────────────────────────

function DatePickerInput({ value, onChange }) {
  if (Platform.OS === "web") {
    return <WDateInput value={value} onChange={onChange} />;
  }
  const [show, setShow] = useState(false);
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const today   = new Date();
  const initial = value ? new Date(value) : today;
  const [viewYear,  setViewYear]  = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const selectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setShow(false);
  };
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const selDay   = value ? parseInt(value.split("-")[2]) : null;
  const selMonth = value ? parseInt(value.split("-")[1]) - 1 : null;
  const selYear  = value ? parseInt(value.split("-")[0]) : null;
  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)} style={S.dateBtn} activeOpacity={0.8}>
        <Text style={value ? S.dateBtnText : S.dateBtnPlaceholder}>{value || "YYYY-MM-DD"}</Text>
        <Text style={S.dateIcon}>📅</Text>
      </TouchableOpacity>
      <Modal visible={show} transparent animationType="fade" onRequestClose={() => setShow(false)}>
        <TouchableWithoutFeedback onPress={() => setShow(false)}>
          <View style={S.calBackdrop} />
        </TouchableWithoutFeedback>
        <View style={S.calBox}>
          <View style={S.calHeader}>
            <TouchableOpacity onPress={prevMonth} style={S.calArrow}>
              <Text style={S.calArrowText}>‹</Text>
            </TouchableOpacity>
            <Text style={S.calTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={nextMonth} style={S.calArrow}>
              <Text style={S.calArrowText}>›</Text>
            </TouchableOpacity>
          </View>
          <View style={S.calDayRow}>
            {DAY_NAMES.map(d => <Text key={d} style={S.calDayName}>{d}</Text>)}
          </View>
          <View style={S.calGrid}>
            {cells.map((day, idx) => {
              const isSel   = day && day === selDay && viewMonth === selMonth && viewYear === selYear;
              const isToday = day && day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              return (
                <TouchableOpacity
                  key={idx}
                  style={[S.calCell, isSel && S.calCellSelected, isToday && !isSel && S.calCellToday]}
                  onPress={() => day && selectDay(day)}
                  activeOpacity={day ? 0.7 : 1}
                >
                  <Text style={[S.calCellText, isSel && S.calCellTextSelected, isToday && !isSel && S.calCellTextToday]}>
                    {day || ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity onPress={() => setShow(false)} style={S.calCancelBtn}>
            <Text style={S.calCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

function SelectInput({ placeholder, value, onChange, options, hasError }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const triggerRef = useRef(null);

  if (Platform.OS !== "web") {
    return (
      <View>
        <TouchableOpacity
          style={[S.pickerWrapper, styles.selBtn, hasError && styles.inputError]}
          onPress={() => setOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={value ? styles.selValueText : styles.selPlaceholderText} numberOfLines={1}>
            {value || placeholder}
          </Text>
          <Text style={styles.selArrow}>▼</Text>
        </TouchableOpacity>
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)} />
          <View style={styles.dropCard}>
            <Text style={styles.dropTitle}>{placeholder}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <TouchableOpacity
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => { onChange(item); setOpen(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item}</Text>
                    {selected && <Text style={styles.checkMark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
      </View>
    );
  }

  const handleOpen = () => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setOpen((o) => !o);
  };
  const dropdown = open && rect && ReactDOM.createPortal(
    <>
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99998, backgroundColor: "transparent" }} />
      <div style={{
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
        backgroundColor: "#FFFFFF",
        border: "1.5px solid #D8DDE6",
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
        maxHeight: 220,
        overflowY: "auto",
        fontFamily: "inherit",
      }}>
        {options.map((o) => {
          const selected = o === value;
          return (
            <div
              key={o}
              onClick={(e) => { e.stopPropagation(); onChange(o); setOpen(false); }}
              style={{
                padding: "10px 14px",
                fontSize: 14,
                color: selected ? C.primary : "#1A1A2E",
                fontWeight: selected ? "700" : "400",
                backgroundColor: selected ? "#E8F0FB" : "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #E8ECF2",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "#F5F7FA"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = selected ? "#E8F0FB" : "#FFFFFF"; }}
            >
              <span>{o}</span>
              {selected && <span style={{ fontSize: 12, color: C.primary }}>✓</span>}
            </div>
          );
        })}
      </div>
    </>,
    document.body
  );
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 44,
          paddingLeft: 12,
          paddingRight: 12,
          border: `1.5px solid ${hasError ? C.error : C.border}`,
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
          cursor: "pointer",
          fontSize: 14,
          color: value ? C.text : C.muted,
          fontFamily: "inherit",
          userSelect: "none",
          boxSizing: "border-box",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <span style={{ fontSize: 10, color: C.muted, marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
      </div>
      {dropdown}
    </div>
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <View style={S.toggleRow}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={[S.toggleBtn, active && S.toggleBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={[S.toggleBtnText, active && S.toggleBtnTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ToggleSwitch({ value, onChange }) {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: C.border, true: C.accent }}
      thumbColor={"#fff"}
    />
  );
}

function Divider() { return <View style={S.divider} />; }

function SectionTitle({ children, blue }) {
  return <Text style={[S.sectionTitle, blue && S.sectionTitleBlue]}>{children}</Text>;
}

// ── Web Divider & Section Title ───────────────────────────────────────────────
function WDivider() {
  return <div style={{ borderTop: "1px dashed #E8ECF2", margin: "18px 0" }} />;
}
function WSectionTitle({ children }) {
  return <div style={{ fontSize: 17, fontWeight: 700, color: "#055075", marginBottom: 14 }}>{children}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Step Bar (mobile)
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = ["Basic Info", "Gym & Services", "Traits & Submit"];

function StepBar({ current }) {
  return (
    <View style={S.stepBar}>
      {STEPS.map((s, i) => {
        const active = i === current;
        return (
          <View key={i} style={[S.stepItem, active && S.stepItemActive]}>
            {(active || i < current) && (
              <View style={S.stepBubble}>
                <Text style={S.stepBubbleText}>{i + 1}</Text>
              </View>
            )}
            <Text style={[S.stepLabel, active && S.stepLabelActive]} numberOfLines={1}>{s}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Web Step Bar ──────────────────────────────────────────────────────────────
function WStepBar({ current }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      borderBottom: "1.5px solid #E8ECF2",
      backgroundColor: "#fff",
      flexShrink: 0,
    }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 4px",
          borderBottom: i === current ? "2.5px solid #055075" : "2.5px solid transparent",
          gap: 6,
        }}>
          {i <= current && (
            <div style={{
              width: 24, height: 24, borderRadius: 12,
              backgroundColor: "#055075",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
          )}
          <span style={{
            fontSize: 13,
            fontWeight: i === current ? 700 : 500,
            color: i === current ? "#055075" : "#8A96A8",
            whiteSpace: "nowrap",
          }}>
            {s}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pages — Mobile
// ─────────────────────────────────────────────────────────────────────────────

function Page1({ data, onChange, errors }) {
  return (
    <View>
      <View style={S.row}>
        <View style={S.col1}>
          <Field label="First Name" required error={errors.firstName}>
            <StyledTextInput placeholder="Enter first name" value={data.firstName} onChange={(v) => onChange("firstName", v)} hasError={!!errors.firstName} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Middle Name">
            <StyledTextInput placeholder="Enter middle name" value={data.middleName} onChange={(v) => onChange("middleName", v)} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Last Name">
            <StyledTextInput placeholder="Enter last name" value={data.lastName} onChange={(v) => onChange("lastName", v)} />
          </Field>
        </View>
      </View>
      <Divider />
      <SectionTitle blue>Personal Details</SectionTitle>
      <View style={S.row}>
        <View style={S.col1}>
          <Field label="Date of Birth">
            <DatePickerInput value={data.dob} onChange={(v) => onChange("dob", v)} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Gender">
            <ToggleGroup options={["Male", "Female", "Others"]} value={data.gender} onChange={(v) => onChange("gender", v)} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Marital Status">
            <ToggleGroup options={["Married", "Single"]} value={data.marital} onChange={(v) => { onChange("marital", v); if (v === "Single") onChange("anniversaryDate", ""); }} />
          </Field>
        </View>
      </View>
      {data.marital === "Married" && (
        <View style={S.row}>
          <View style={S.col1}>
            <Field label="Anniversary Date">
              <DatePickerInput value={data.anniversaryDate} onChange={(v) => onChange("anniversaryDate", v)} />
            </Field>
          </View>
          <View style={S.col1} /><View style={S.col1} />
        </View>
      )}
      <Divider />
      <SectionTitle blue>Contact Details</SectionTitle>
      <View style={S.row}>
        <View style={S.col1}>
          <Field label="Mobile Number" required error={errors.mobile}>
            <StyledTextInput placeholder="Enter mobile number" value={data.mobile} onChange={(v) => onChange("mobile", v)} hasError={!!errors.mobile} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Landline Number">
            <StyledTextInput placeholder="Enter landline number" value={data.landline} onChange={(v) => onChange("landline", v)} />
          </Field>
        </View>
      </View>
      <Field label="Emergency Contact">
        <StyledTextInput placeholder="Enter emergency contact number" value={data.emergency} onChange={(v) => onChange("emergency", v)} />
      </Field>
      <View style={S.row}>
        <View style={S.col1}>
          <Field label="E-mail">
            <StyledTextInput placeholder="Enter e-mail" value={data.email} onChange={(v) => onChange("email", v)} />
          </Field>
        </View>
        <View style={S.col2}>
          <Field label="Residential Address">
            <StyledTextInput placeholder="Enter residential address" value={data.address} onChange={(v) => onChange("address", v)} />
          </Field>
        </View>
      </View>
      <View style={S.row}>
        <View style={S.col2}>
          <Field label="Apartment / Society Name">
            <StyledTextInput placeholder="Enter apartment/society name" value={data.apartment} onChange={(v) => onChange("apartment", v)} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Pin Code">
            <StyledTextInput placeholder="Enter Pin / Zip" value={data.pincode} onChange={(v) => onChange("pincode", v)} />
          </Field>
        </View>
      </View>
      <Divider />
      <SectionTitle blue>Personal Fitness Status</SectionTitle>
      <View style={S.row}>
        <View style={S.col1}>
          <Field label="Health Challenges">
            <StyledTextInput placeholder="Enter health challenges" value={data.healthChallenges} onChange={(v) => onChange("healthChallenges", v)} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Fitness Goals">
            <StyledTextInput placeholder="Enter fitness goals" value={data.fitnessGoals} onChange={(v) => onChange("fitnessGoals", v)} />
          </Field>
        </View>
      </View>
      <Field label="Exercising currently?">
        <ToggleGroup options={["Yes", "No"]} value={data.exercising} onChange={(v) => onChange("exercising", v)} />
      </Field>
    </View>
  );
}

function Page2({ data, onChange, errors }) {
  return (
    <View>
      <SectionTitle blue>Gym Preferences & Services</SectionTitle>
      <View style={S.row}>
        <View style={S.col1}>
          <Field label="Gym Services" required error={errors.gymService}>
            <SelectInput placeholder="Select gym service" options={["Personal Training", "Group Classes", "Yoga", "Swimming", "Spa & Wellness"]} value={data.gymService} onChange={(v) => onChange("gymService", v)} hasError={!!errors.gymService} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Commitment Date">
            <DatePickerInput value={data.commitmentDate} onChange={(v) => onChange("commitmentDate", v)} />
          </Field>
        </View>
      </View>
      <Divider />
      <View style={S.switchRow}>
        <Text style={S.switchRowTitle}>Trial Booking</Text>
        <ToggleSwitch value={data.trialEnabled || false} onChange={(v) => onChange("trialEnabled", v)} />
      </View>
      {data.trialEnabled && (
        <View>
          <View style={S.row}>
            <View style={S.col1}>
              <Field label="Trial Date">
                <DatePickerInput value={data.trialDate} onChange={(v) => onChange("trialDate", v)} />
              </Field>
            </View>
            <View style={S.col1}>
              <Field label="Trial Time">
                <StyledTextInput placeholder="HH:MM" value={data.trialTime} onChange={(v) => onChange("trialTime", v)} />
              </Field>
            </View>
          </View>
          <Field label="Assign to">
            <SelectInput placeholder="Select trainer" options={["Trainer A", "Trainer B", "Trainer C"]} value={data.trialAssign} onChange={(v) => onChange("trialAssign", v)} />
          </Field>
        </View>
      )}
      <Divider />
      <SectionTitle blue>Leads and Referral Information</SectionTitle>
      <View style={S.row}>
        <View style={S.col1}>
          <Field label="Lead Type" required error={errors.leadType}>
            <SelectInput placeholder="Select lead type" options={["Walk-in", "Online", "Referral", "Campaign"]} value={data.leadType} onChange={(v) => onChange("leadType", v)} hasError={!!errors.leadType} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Employee Referral">
            <SelectInput placeholder="Select employee" options={["Employee A", "Employee B", "Employee C"]} value={data.employeeReferral} onChange={(v) => onChange("employeeReferral", v)} />
          </Field>
        </View>
      </View>
      <Field label="Other Referral">
        <StyledTextInput placeholder="Enter other referral" value={data.otherReferral} onChange={(v) => onChange("otherReferral", v)} />
      </Field>
    </View>
  );
}

function Page3({ data, onChange, errors }) {
  return (
    <View>
      <Field label="Where did you hear about us?">
        <StyledTextInput placeholder="Enter details" value={data.hearAboutUs} onChange={(v) => onChange("hearAboutUs", v)} multiline rows={5} />
      </Field>
      <Divider />
      <SectionTitle blue>Personal Traits & Budget</SectionTitle>
      <View style={S.row}>
        <View style={S.col1}>
          <Field label="Personality Type">
            <SelectInput placeholder="Select personality" options={["Introvert", "Extrovert", "Ambivert", "Analytical", "Creative"]} value={data.personalityType} onChange={(v) => onChange("personalityType", v)} />
          </Field>
        </View>
        <View style={S.col1}>
          <Field label="Budget Per Month (₹)">
            <StyledTextInput placeholder="Enter budget" value={data.budget} onChange={(v) => onChange("budget", v)} />
          </Field>
        </View>
      </View>
      <Divider />
      <Field label="Remarks">
        <StyledTextInput placeholder="Enter your remarks" value={data.remarks} onChange={(v) => onChange("remarks", v)} multiline rows={5} />
      </Field>
      <View style={S.checkRow}>
        <Switch value={data.followUp || false} onValueChange={(v) => onChange("followUp", v)} trackColor={{ false: C.border, true: C.accent }} thumbColor="#fff" />
        <Text style={S.checkLabel}>Add Follow Up</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pages — Web (pure HTML/div — no React Native components)
// ─────────────────────────────────────────────────────────────────────────────

function WPage1({ data, onChange, errors }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <WField label="First Name" required error={errors.firstName}>
            <WTextInput placeholder="Enter first name" value={data.firstName} onChange={(v) => onChange("firstName", v)} hasError={!!errors.firstName} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Middle Name">
            <WTextInput placeholder="Enter middle name" value={data.middleName} onChange={(v) => onChange("middleName", v)} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Last Name">
            <WTextInput placeholder="Enter last name" value={data.lastName} onChange={(v) => onChange("lastName", v)} />
          </WField>
        </div>
      </div>

      <WDivider />
      <WSectionTitle>Personal Details</WSectionTitle>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <WField label="Date of Birth">
            <WDateInput value={data.dob} onChange={(v) => onChange("dob", v)} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Gender">
            <WToggleGroup options={["Male", "Female", "Others"]} value={data.gender} onChange={(v) => onChange("gender", v)} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Marital Status">
            <WToggleGroup options={["Married", "Single"]} value={data.marital} onChange={(v) => { onChange("marital", v); if (v === "Single") onChange("anniversaryDate", ""); }} />
          </WField>
        </div>
      </div>

      {data.marital === "Married" && (
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <WField label="Anniversary Date">
              <WDateInput value={data.anniversaryDate} onChange={(v) => onChange("anniversaryDate", v)} />
            </WField>
          </div>
          <div style={{ flex: 1 }} /><div style={{ flex: 1 }} />
        </div>
      )}

      <WDivider />
      <WSectionTitle>Contact Details</WSectionTitle>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <WField label="Mobile Number" required error={errors.mobile}>
            <WTextInput placeholder="Enter mobile number" value={data.mobile} onChange={(v) => onChange("mobile", v)} hasError={!!errors.mobile} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Landline Number">
            <WTextInput placeholder="Enter landline number" value={data.landline} onChange={(v) => onChange("landline", v)} />
          </WField>
        </div>
      </div>

      <WField label="Emergency Contact">
        <WTextInput placeholder="Enter emergency contact number" value={data.emergency} onChange={(v) => onChange("emergency", v)} />
      </WField>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <WField label="E-mail">
            <WTextInput placeholder="Enter e-mail" value={data.email} onChange={(v) => onChange("email", v)} />
          </WField>
        </div>
        <div style={{ flex: 2 }}>
          <WField label="Residential Address">
            <WTextInput placeholder="Enter residential address" value={data.address} onChange={(v) => onChange("address", v)} />
          </WField>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 2 }}>
          <WField label="Apartment / Society Name">
            <WTextInput placeholder="Enter apartment/society name" value={data.apartment} onChange={(v) => onChange("apartment", v)} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Pin Code">
            <WTextInput placeholder="Enter Pin / Zip" value={data.pincode} onChange={(v) => onChange("pincode", v)} />
          </WField>
        </div>
      </div>

      <WDivider />
      <WSectionTitle>Personal Fitness Status</WSectionTitle>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <WField label="Health Challenges">
            <WTextInput placeholder="Enter health challenges" value={data.healthChallenges} onChange={(v) => onChange("healthChallenges", v)} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Fitness Goals">
            <WTextInput placeholder="Enter fitness goals" value={data.fitnessGoals} onChange={(v) => onChange("fitnessGoals", v)} />
          </WField>
        </div>
      </div>

      <WField label="Exercising currently?">
        <WToggleGroup options={["Yes", "No"]} value={data.exercising} onChange={(v) => onChange("exercising", v)} />
      </WField>
    </div>
  );
}

function WPage2({ data, onChange, errors }) {
  return (
    <div>
      <WSectionTitle>Gym Preferences & Services</WSectionTitle>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <WField label="Gym Services" required error={errors.gymService}>
            <WSelect placeholder="Select gym service" options={["Personal Training", "Group Classes", "Yoga", "Swimming", "Spa & Wellness"]} value={data.gymService} onChange={(v) => onChange("gymService", v)} hasError={!!errors.gymService} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Commitment Date">
            <WDateInput value={data.commitmentDate} onChange={(v) => onChange("commitmentDate", v)} />
          </WField>
        </div>
      </div>

      <WDivider />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E" }}>Trial Booking</span>
        <WSwitch value={data.trialEnabled || false} onChange={(v) => onChange("trialEnabled", v)} />
      </div>

      {data.trialEnabled && (
        <div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <WField label="Trial Date">
                <WDateInput value={data.trialDate} onChange={(v) => onChange("trialDate", v)} />
              </WField>
            </div>
            <div style={{ flex: 1 }}>
              <WField label="Trial Time">
                <WTextInput placeholder="HH:MM" value={data.trialTime} onChange={(v) => onChange("trialTime", v)} />
              </WField>
            </div>
          </div>
          <WField label="Assign to">
            <WSelect placeholder="Select trainer" options={["Trainer A", "Trainer B", "Trainer C"]} value={data.trialAssign} onChange={(v) => onChange("trialAssign", v)} />
          </WField>
        </div>
      )}

      <WDivider />
      <WSectionTitle>Leads and Referral Information</WSectionTitle>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <WField label="Lead Type" required error={errors.leadType}>
            <WSelect placeholder="Select lead type" options={["Walk-in", "Online", "Referral", "Campaign"]} value={data.leadType} onChange={(v) => onChange("leadType", v)} hasError={!!errors.leadType} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Employee Referral">
            <WSelect placeholder="Select employee" options={["Employee A", "Employee B", "Employee C"]} value={data.employeeReferral} onChange={(v) => onChange("employeeReferral", v)} />
          </WField>
        </div>
      </div>

      <WField label="Other Referral">
        <WTextInput placeholder="Enter other referral" value={data.otherReferral} onChange={(v) => onChange("otherReferral", v)} />
      </WField>
    </div>
  );
}

function WPage3({ data, onChange, errors }) {
  return (
    <div>
      <WField label="Where did you hear about us?">
        <WTextInput placeholder="Enter details" value={data.hearAboutUs} onChange={(v) => onChange("hearAboutUs", v)} multiline rows={5} />
      </WField>

      <WDivider />
      <WSectionTitle>Personal Traits & Budget</WSectionTitle>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <WField label="Personality Type">
            <WSelect placeholder="Select personality" options={["Introvert", "Extrovert", "Ambivert", "Analytical", "Creative"]} value={data.personalityType} onChange={(v) => onChange("personalityType", v)} />
          </WField>
        </div>
        <div style={{ flex: 1 }}>
          <WField label="Budget Per Month (₹)">
            <WTextInput placeholder="Enter budget" value={data.budget} onChange={(v) => onChange("budget", v)} />
          </WField>
        </div>
      </div>

      <WDivider />

      <WField label="Remarks">
        <WTextInput placeholder="Enter your remarks" value={data.remarks} onChange={(v) => onChange("remarks", v)} multiline rows={5} />
      </WField>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
        <WSwitch value={data.followUp || false} onChange={(v) => onChange("followUp", v)} />
        <span style={{ fontSize: 15, color: "#1A1A2E" }}>Add Follow Up</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Success Screen
// ─────────────────────────────────────────────────────────────────────────────

function SuccessScreen({ onReset }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => { if (onReset) onReset(); }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (Platform.OS === "web") {
    return (
      <div style={{ padding: "60px 28px 80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: "#E8F0FB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 34, color: "#055075" }}>✓</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#055075", marginBottom: 12 }}>Enquiry Submitted!</div>
        <div style={{ fontSize: 15, color: "#8A96A8", lineHeight: "22px", textAlign: "center", maxWidth: 320, marginBottom: 30 }}>
          Thank you for your interest. Our team will get back to you shortly.
        </div>
        <div style={{ fontSize: 16, color: "#6B7A90", textAlign: "center" }}>
          Redirecting to home in <span style={{ color: "#055075", fontWeight: 700, fontSize: 18 }}>{countdown}</span> seconds
        </div>
      </div>
    );
  }

  return (
    <View style={S.successWrap}>
      <View style={S.successCircle}>
        <Text style={S.successIcon}>✓</Text>
      </View>
      <Text style={S.successTitle}>Enquiry Submitted!</Text>
      <Text style={S.successSub}>Thank you for your interest. Our team will get back to you shortly.</Text>
      <ActivityIndicator size="large" color="#0D5C91" style={{ marginTop: 28, marginBottom: 24 }} />
      <Text style={S.redirectText}>
        You are redirect at home page in <Text style={S.redirectCount}>{countdown}</Text> seconds
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WebDrawerShell — pure HTML, no React Native — drag guaranteed
// ─────────────────────────────────────────────────────────────────────────────

function WebDrawerShell({ onClose, children }) {
  const drawerRef      = useRef(null);
  const dragState      = useRef({ dragging: false, startY: 0, currentY: 0 });
  const onMouseMoveRef = useRef(null);
  const onMouseUpRef   = useRef(null);

  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragState.current = { dragging: true, startY: e.clientY, currentY: 0 };
    document.body.style.cursor     = "grabbing";
    document.body.style.userSelect = "none";

    onMouseMoveRef.current = (ev) => {
      const dy = ev.clientY - dragState.current.startY;
      dragState.current.currentY = dy;
      if (dy > 0 && drawerRef.current) {
        drawerRef.current.style.transition = "";
        drawerRef.current.style.transform  = `translateY(${dy}px)`;
      }
    };

    onMouseUpRef.current = () => {
      document.removeEventListener("mousemove", onMouseMoveRef.current);
      document.removeEventListener("mouseup",   onMouseUpRef.current);
      document.body.style.cursor     = "";
      document.body.style.userSelect = "";

      const dy = dragState.current.currentY;
      dragState.current.dragging = false;

      if (dy > 80) {
        if (drawerRef.current) {
          drawerRef.current.style.transition = "transform 0.25s ease";
          drawerRef.current.style.transform  = "translateY(100%)";
          setTimeout(() => onClose(), 250);
        } else {
          onClose();
        }
      } else {
        if (drawerRef.current) {
          drawerRef.current.style.transition = "transform 0.2s ease";
          drawerRef.current.style.transform  = "translateY(0)";
          setTimeout(() => {
            if (drawerRef.current) drawerRef.current.style.transition = "";
          }, 200);
        }
      }
    };

    document.addEventListener("mousemove", onMouseMoveRef.current);
    document.addEventListener("mouseup",   onMouseUpRef.current);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 9998,
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          height: "85vh",
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          zIndex: 9999,
          animation: "enquirySlideUp 0.3s ease-out",
          fontFamily: "inherit",
        }}
      >
        {/* Drag Handle */}
        <div
          onMouseDown={onMouseDown}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 44,
            cursor: "grab",
            flexShrink: 0,
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          <div style={{
            width: 40, height: 4,
            borderRadius: 2,
            backgroundColor: "#CCCCCC",
            pointerEvents: "none",
          }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes enquirySlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bottom Drawer (mobile only)
// ─────────────────────────────────────────────────────────────────────────────

function BottomDrawer({ visible, onClose, children }) {
  const translateY  = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => { if (g.dy > 0) translateY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DRAWER_HEIGHT * 0.3 || g.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
    } else {
      Animated.timing(translateY, { toValue: DRAWER_HEIGHT, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={S.backdrop} />
      </TouchableWithoutFeedback>
      <Animated.View style={[S.drawer, { transform: [{ translateY }] }]}>
        <View {...panResponder.panHandlers} style={S.handleArea}>
          <View style={S.handle} />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          {children}
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main — EnquiryForm
// ─────────────────────────────────────────────────────────────────────────────

export default function EnquiryForm({ visible, onClose }) {
  const [step,      setStep]      = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors,    setErrors]    = useState({});
  const [formData,  setFormData]  = useState({
    gender: "Male", marital: "Single", exercising: "Yes", trialEnabled: false,
  });
  const scrollRef = useRef(null);

  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const reset = () => {
    setSubmitted(false);
    setStep(0);
    setErrors({});
    setFormData({ gender: "Male", marital: "Single", exercising: "Yes", trialEnabled: false });
  };

  const handleClose = () => { reset(); onClose?.(); };

  const handleNext = () => {
    const newErrors = validate(step, formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (Platform.OS !== "web") scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    setErrors({});
    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      saveEnquiry(formData);
      setSubmitted(true);
    }
  };

  const handlePrev = () => { setErrors({}); setStep((s) => s - 1); };

  // ── Web ─────────────────────────────────────────────────────────────────────
  if (Platform.OS === "web") {
    if (!visible) return null;

    const webPages = [
      <WPage1 data={formData} onChange={update} errors={errors} />,
      <WPage2 data={formData} onChange={update} errors={errors} />,
      <WPage3 data={formData} onChange={update} errors={errors} />,
    ];

    return ReactDOM.createPortal(
      <WebDrawerShell onClose={handleClose}>
        {/* Step Bar */}
        <WStepBar current={step} />

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 14px" }}>
          {submitted ? <SuccessScreen onReset={reset} /> : webPages[step]}
        </div>

        {/* Footer */}
        {!submitted && (
          <div style={{
            display: "flex",
            flexDirection: "row",
            padding: "16px 20px",
            borderTop: "1px solid #E8ECF2",
            backgroundColor: "#fff",
            flexShrink: 0,
            gap: 10,
          }}>
            {step > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  flex: 1, padding: 14, borderRadius: 10,
                  border: "1.5px solid #055075",
                  backgroundColor: "transparent",
                  color: "#055075", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                ← Previous
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                flex: 2, padding: 14, borderRadius: 10,
                border: "none", backgroundColor: "#055075",
                color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", letterSpacing: 0.4, fontFamily: "inherit",
              }}
            >
              {step < 2 ? "NEXT →" : "SUBMIT ENQUIRY →"}
            </button>
          </div>
        )}
      </WebDrawerShell>,
      document.body
    );
  }

  // ── Mobile ───────────────────────────────────────────────────────────────────
  const mobilePages = [
    <Page1 data={formData} onChange={update} errors={errors} />,
    <Page2 data={formData} onChange={update} errors={errors} />,
    <Page3 data={formData} onChange={update} errors={errors} />,
  ];

  return (
    <BottomDrawer visible={visible} onClose={handleClose}>
      <StepBar current={step} />
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={S.pageContent}
      >
        {submitted ? <SuccessScreen onReset={reset} /> : mobilePages[step]}
      </ScrollView>
      {!submitted && (
        <View style={S.footer}>
          {step > 0 && (
            <TouchableOpacity style={S.btnPrev} onPress={handlePrev} activeOpacity={0.8}>
              <Text style={S.btnPrevText}>← Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={S.btnNext} onPress={handleNext} activeOpacity={0.85}>
            <Text style={S.btnNextText}>{step < 2 ? "NEXT →" : "SUBMIT ENQUIRY →"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </BottomDrawer>
  );
}