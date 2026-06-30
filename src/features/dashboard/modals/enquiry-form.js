import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal,
  ScrollView, Image, Platform, KeyboardAvoidingView, Pressable,
  Animated, Easing, ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { enquiryStyles as S } from '../style-sheet';
import { submitEnquiry } from '../helper/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d) => {
  if (!d) return '';
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const normalizePhone = (raw) => {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(digits.length - 10);
  }
  return digits.slice(-10);
};

// ─── FloatingInput ────────────────────────────────────────────────────────────

function FloatingInput({ label, value, onChangeText, keyboardType, required, error, icon }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={S.fieldWrap}>
      <View style={[S.enqInputBox, focused && S.enqInputBoxFocused, error && S.enqInputBoxError]}>
        {icon && <View style={S.inputIcon}>{icon}</View>}
        <View style={S.inputInner}>
          <Text style={[S.floatLabel, (focused || (value && value.length > 0)) && S.floatLabelUp]}>
            {label}
            {required && <Text style={{ color: 'red' }}> *</Text>}
          </Text>
          <TextInput
            style={[
              S.enqInputText,
              Platform.OS === 'web' && { outlineStyle: 'none' },
            ]}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType || 'default'}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholderTextColor="transparent"
          />
        </View>
      </View>
      {error ? <Text style={S.enqErrorText}>{error}</Text> : null}
    </View>
  );
}

// ─── CalendarModal ────────────────────────────────────────────────────────────

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const DAY_NAMES   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function CalendarModal({ visible, value, onSelect, onClose }) {
  const today = new Date();
  const init  = value || today;
  const [viewYear,  setViewYear]  = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());

  const selected = value ? formatDate(value) : null;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleDay = (d) => {
    if (!d) return;
    onSelect(new Date(viewYear, viewMonth, d));
    onClose();
  };

  const todayStr = formatDate(today);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={S.calModalOverlay} onPress={onClose}>
        <Pressable style={S.calCard} onPress={() => {}}>
          <View style={S.calHeader}>
            <TouchableOpacity onPress={prevMonth} style={S.calNavBtn}>
              <Ionicons name="chevron-back" size={18} color="#1A56DB" />
            </TouchableOpacity>
            <Text style={S.calTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={nextMonth} style={S.calNavBtn}>
              <Ionicons name="chevron-forward" size={18} color="#1A56DB" />
            </TouchableOpacity>
          </View>

          <View style={S.calDayRow}>
            {DAY_NAMES.map(d => (
              <Text key={d} style={S.calDayLabel}>{d}</Text>
            ))}
          </View>

          <View style={S.calGrid}>
            {cells.map((d, i) => {
              const dateStr    = d ? formatDate(new Date(viewYear, viewMonth, d)) : null;
              const isSelected = dateStr && dateStr === selected;
              const isToday    = dateStr && dateStr === todayStr;
              return (
                <TouchableOpacity
                  key={i}
                  style={[S.calCell, isSelected && S.calCellSelected, isToday && !isSelected && S.calCellToday]}
                  onPress={() => handleDay(d)}
                  activeOpacity={d ? 0.7 : 1}
                >
                  {d ? (
                    <Text style={[S.calCellText, isSelected && S.calCellTextSelected, isToday && !isSelected && S.calCellTextToday]}>
                      {d}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={S.calTodayBtn} onPress={() => { onSelect(today); onClose(); }}>
            <Text style={S.calTodayBtnText}>Today</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── DateField ────────────────────────────────────────────────────────────────

function DateField({ label, value, onChange, required, error }) {
  const [showCal, setShowCal] = useState(false);
  const [focused, setFocused] = useState(false);
  const [text,    setText]    = useState(value ? formatDate(value) : '');

  React.useEffect(() => {
    setText(value ? formatDate(value) : '');
  }, [value]);

  const handleTextChange = (raw) => {
    let t = raw.replace(/[^0-9]/g, '');
    if (t.length > 4)  t = t.slice(0, 4) + '-' + t.slice(4);
    if (t.length > 7)  t = t.slice(0, 7) + '-' + t.slice(7);
    if (t.length > 10) t = t.slice(0, 10);
    setText(t);
    if (t.length === 10) {
      const parsed = new Date(t);
      if (!isNaN(parsed.getTime())) onChange(parsed);
    }
  };

  return (
    <View style={S.fieldWrap}>
      <View style={[S.dateBox, focused && S.dateBoxFocused, error && S.enqInputBoxError]}>
        <Text style={S.dateLabel}>{label}{required ? ' *' : ''}</Text>
        <View style={S.dateRow}>
          <Ionicons name="calendar-outline" size={15} color="#6B7280" style={{ marginRight: 6 }} />
          <TextInput
            style={[S.dateInput, Platform.OS === 'web' && { outlineStyle: 'none' }]}
            value={text}
            onChangeText={handleTextChange}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={10}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <TouchableOpacity onPress={() => setShowCal(true)} activeOpacity={0.7} style={S.calendarBtn}>
            <Ionicons name="calendar" size={17} color="#1A56DB" />
          </TouchableOpacity>
        </View>
      </View>
      {error ? <Text style={S.enqErrorText}>{error}</Text> : null}

      <CalendarModal
        visible={showCal}
        value={value}
        onSelect={onChange}
        onClose={() => setShowCal(false)}
      />
    </View>
  );
}

// ─── DropdownField ────────────────────────────────────────────────────────────

function DropdownField({ label, value, options, onSelect, required, error, icon, onOpenChange }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = (val) => {
    setOpen(val);
    onOpenChange && onOpenChange(val);
  };

  return (
    <View style={[S.fieldWrap, open && S.fieldWrapOpen]}>
      <TouchableOpacity
        style={[S.enqInputBox, error && S.enqInputBoxError]}
        onPress={() => toggleOpen(!open)}
        activeOpacity={0.8}
      >
        {icon && <View style={S.inputIcon}>{icon}</View>}
        <View style={S.inputInner}>
          <Text style={[S.floatLabel, value && S.floatLabelUp]}>
            {label}
            {required && <Text style={{ color: 'red' }}> *</Text>}
          </Text>
          {value ? <Text style={S.enqInputText}>{value}</Text> : null}
        </View>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={17} color="#6B7280" style={{ marginRight: 4 }}
        />
      </TouchableOpacity>
      {error ? <Text style={S.enqErrorText}>{error}</Text> : null}

      {open && (
        <View style={S.inlineDropList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[S.inlineDropItem, value === opt && S.inlineDropItemActive]}
              onPress={() => { onSelect(opt); toggleOpen(false); }}
            >
              <Text style={[S.inlineDropText, value === opt && S.inlineDropTextActive]}>{opt}</Text>
              {value === opt && <Ionicons name="checkmark" size={15} color="#1A56DB" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── MaritalStatus ────────────────────────────────────────────────────────────

function MaritalStatus({ value, onChange }) {
  const options = [
    { key: 'Single',  renderIcon: (a) => <FontAwesome5 name="user"        size={15} color={a ? '#1A56DB' : '#6B7280'} /> },
    { key: 'Married', renderIcon: (a) => <FontAwesome5 name="user-friends" size={13} color={a ? '#1A56DB' : '#6B7280'} /> },
  ];
  return (
    <View style={S.maritalRow}>
      {options.map((o) => {
        const active = value === o.key;
        return (
          <TouchableOpacity
            key={o.key}
            style={[S.maritalBtn, active && S.maritalBtnActive]}
            onPress={() => onChange(o.key)}
            activeOpacity={0.8}
          >
            {o.renderIcon(active)}
            <Text style={[S.maritalText, active && S.maritalTextActive]}>{o.key}</Text>
            <View style={[S.maritalRadio, active && S.maritalRadioActive]}>
              {active && <View style={S.maritalRadioDot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Options ──────────────────────────────────────────────────────────────────

const GENDER_OPTIONS    = ['Male', 'Female', 'Other', 'Prefer not to say'];
const HEARD_OPTIONS     = ['Social Media', 'Friend / Family', 'Google Search', 'Walk-in', 'Advertisement', 'Other'];
const ATTENDANT_OPTIONS = ['Trainer A', 'Trainer B', 'Trainer C', 'Front Desk'];
const SERVICE_OPTIONS   = ['Gym Workout', 'Personal Training', 'Group Exercise', 'Liberty Membership'];

// ─── EnquiryPopup ─────────────────────────────────────────────────────────────

export default function EnquiryPopup({ visible, onClose }) {
  const [avatar,      setAvatar]      = useState(null);
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [phone,       setPhone]       = useState('');
  const [gender,      setGender]      = useState('');
  const [genderOpen,  setGenderOpen]  = useState(false);
  const [dob,         setDob]         = useState(null);
  const [marital,     setMarital]     = useState('Single');
  const [anniversary, setAnniversary] = useState(null);
  const [heardFrom,   setHeardFrom]   = useState('');
  const [attendant,   setAttendant]   = useState('');
  const [service,     setService]     = useState('');
  const [joiningDate, setJoiningDate] = useState(null);
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);
  const [countdown,   setCountdown]   = useState(4);
  const [loading,     setLoading]     = useState(false);
  const [apiError,    setApiError]    = useState('');
  const spinAnim = useRef(new Animated.Value(0)).current;

  const reset = () => {
    setFirstName(''); setLastName(''); setEmail(''); setPhone('');
    setGender(''); setDob(null); setMarital('Single');
    setAnniversary(null); setHeardFrom(''); setAttendant('');
    setService(''); setJoiningDate(null); setAvatar(null);
    setErrors({}); setSubmitted(false); setCountdown(4);
    setLoading(false); setApiError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7, allowsEditing: true, aspect: [1, 1],
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = 'Required';
    if (!lastName.trim())  e.lastName  = 'Required';
    if (!phone.trim())     e.phone     = 'Required';
    if (!heardFrom)        e.heardFrom = 'Please select';
    if (!attendant)        e.attendant = 'Please select';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Async submit with API call ─────────────────────────────────────────────
  // ── Async submit with API call ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone.length !== 10) {
      setErrors(prev => ({ ...prev, phone: 'Enter a valid 10-digit Indian number' }));
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const middleName = ''; // no UI field yet — wire up if/when added
      const fullName = `${firstName.trim()} ${middleName} ${lastName.trim()}`
        .replace(/\s+/g, ' ')
        .trim();

      // plain JS object — sent as real JSON, NOT FormData/stringified.
      // userInfo stays a true nested object so the server's express.json()
      // parser reads userInfo.name etc. correctly.
      const payload = {
        userInfo: {
          first_name: firstName.trim(),
          middle_name: middleName,
          last_name: lastName.trim(),
          full_name: fullName,
          email: email.trim(),
          phone: normalizedPhone,
          countryCode: 91,
          isPhoneNumberVerified: false,
          land_line_number: '', // no UI field yet
          gender: gender || '',
          address: '', // no UI field yet
          date_of_birth: dob || null,
          date_of_birth_string: dob ? formatDate(dob) : '',
          anniversary_date: anniversary || null,
          anniversary_date_string: anniversary ? formatDate(anniversary) : '',
          marital_status: marital || '',
          emergency_contact_person: '', // no UI field yet
          emergency_contact_no: '', // no UI field yet
          residential_address: '', // no UI field yet
          apartment_name: '', // no UI field yet
        },
        heardFrom: heardFrom || '',
        attendant: attendant || '',
        serviceOffered: service || '',
        approxJoiningDate: joiningDate ? formatDate(joiningDate) : '',
        // NOTE: photo (avatar) can't ride along in this JSON body as raw
        // binary. Needs a separate upload step/endpoint or base64 — not
        // wired up yet. avatar local uri is: ${avatar}
      };

      //console.log('[EnquiryPopup] submitting payload:', JSON.stringify(payload, null, 2));
 console.log(payload);
 
      await submitEnquiry(payload);

      setSubmitted(true); // success screen dikhao
    } catch (err) {
      setApiError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // ── Countdown + spinner after successful submit ────────────────────────────
  useEffect(() => {
    if (!submitted) return;

    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    );
    spin.start();

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          spin.stop();
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { clearInterval(interval); spin.stop(); };
  }, [submitted]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={S.popupOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* dim backdrop */}
        <Pressable style={S.popupBackdrop} onPress={handleClose} />

        {/* centered card */}
        <View style={S.popupCard}>

          {/* ── Success screen ── */}
          {submitted ? (
            <View style={S.successCard}>
              <View style={S.successIconWrap}>
                <Ionicons name="checkmark" size={36} color="#1A56DB" />
              </View>

              <Text style={S.successTitle}>Enquiry Submitted!</Text>
              <Text style={S.successSubtitle}>
                Thank you for your interest. Our team will get back to you shortly.
              </Text>

              <Animated.View style={[S.spinnerWrap, {
                transform: [{
                  rotate: spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
                }]
              }]}>
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    style={[S.spinnerDot, {
                      transform: [
                        { rotate: `${i * 45}deg` },
                        { translateY: -22 },
                      ],
                      opacity: 0.25 + (i / 8) * 0.75,
                    }]}
                  />
                ))}
              </Animated.View>

              <Text style={S.successCountdown}>
                You are redirect at home page in{' '}
                <Text style={S.successCountdownBold}>{countdown}</Text>
                {' '}seconds
              </Text>
            </View>

          ) : (
            <>
              {/* header bar */}
              <View style={S.popupHeader}>
                <Text style={S.popupTitle}>Give your enquiry</Text>
                <TouchableOpacity onPress={handleClose} style={S.closeBtn} activeOpacity={0.7}>
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                contentContainerStyle={S.popupBody}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* ── Avatar ── */}
                <View style={S.avatarWrap}>
                  <TouchableOpacity onPress={pickAvatar} activeOpacity={0.85}>
                    {avatar
                      ? <Image source={{ uri: avatar }} style={S.enqAvatar} />
                      : (
                        <View style={S.avatarPlaceholder}>
                          <Ionicons name="person" size={40} color="#B0BAC9" />
                        </View>
                      )
                    }
                    <View style={S.cameraBadge}>
                      <Ionicons name="camera" size={13} color="#fff" />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* ── First / Last name ── */}
                <View style={S.enqRow}>
                  <View style={{ flex: 1 }}>
                    <FloatingInput
                      label="First name" value={firstName} onChangeText={setFirstName}
                      required error={errors.firstName}
                      icon={<Ionicons name="person-outline" size={15} color="#6B7280" />}
                    />
                  </View>
                  <View style={S.rowGap} />
                  <View style={{ flex: 1 }}>
                    <FloatingInput
                      label="Last name" value={lastName} onChangeText={setLastName}
                      required error={errors.lastName}
                      icon={<Ionicons name="person-outline" size={15} color="#6B7280" />}
                    />
                  </View>
                </View>

                {/* ── Email ── */}
                <FloatingInput
                  label="Email" value={email} onChangeText={setEmail}
                  keyboardType="email-address"
                  icon={<Ionicons name="mail-outline" size={15} color="#6B7280" />}
                />

                {/* ── Phone ── */}
                <FloatingInput
                  label="Phone number" value={phone} onChangeText={setPhone}
                  keyboardType="phone-pad" required error={errors.phone}
                  icon={<Ionicons name="call-outline" size={15} color="#6B7280" />}
                />

                {/* ── Gender + DOB ── */}
                <View style={[S.enqRow, genderOpen && S.enqRowOpen]}>
                  <View style={{ flex: 1, zIndex: genderOpen ? 999 : 1 }}>
                    <DropdownField
                      label="Gender" value={gender} options={GENDER_OPTIONS} onSelect={setGender}
                      icon={<Ionicons name="person-outline" size={15} color="#6B7280" />}
                      onOpenChange={setGenderOpen}
                    />
                  </View>
                  <View style={S.rowGap} />
                  <View style={{ flex: 1, zIndex: 0 }}>
                    <DateField label="Date of birth" value={dob} onChange={setDob} />
                  </View>
                </View>

                {/* ── Marital status ── */}
                <MaritalStatus value={marital} onChange={setMarital} />

                {/* ── Anniversary (Married only) ── */}
                {marital === 'Married' && (
                  <DateField label="Anniversary date" value={anniversary} onChange={setAnniversary} />
                )}

                {/* ── Where did you hear about us ── */}
                <DropdownField
                  label="Where did you hear about us" value={heardFrom}
                  options={HEARD_OPTIONS} onSelect={setHeardFrom}
                  required error={errors.heardFrom}
                  icon={<Ionicons name="megaphone-outline" size={15} color="#6B7280" />}
                />

                {/* ── Name of attendant ── */}
                <DropdownField
                  label="Name of attendant" value={attendant}
                  options={ATTENDANT_OPTIONS} onSelect={setAttendant}
                  required error={errors.attendant}
                  icon={<Ionicons name="person-circle-outline" size={15} color="#6B7280" />}
                />

                {/* ── Services offered ── */}
                <DropdownField
                  label="Services offered" value={service}
                  options={SERVICE_OPTIONS} onSelect={setService}
                  icon={<Ionicons name="briefcase-outline" size={15} color="#6B7280" />}
                />

                {/* ── Approx joining date ── */}
                <DateField label="Approx joining date" value={joiningDate} onChange={setJoiningDate} />

                {/* ── API error message ── */}
                {apiError ? (
                  <Text style={[S.enqErrorText, { textAlign: 'center', marginBottom: 8 }]}>
                    {apiError}
                  </Text>
                ) : null}

                {/* ── Submit ── */}
                <TouchableOpacity
                  style={[S.submitBtn, loading && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={S.submitText}>Submit Enquiry</Text>
                  }
                </TouchableOpacity>

              </ScrollView>
            </>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}