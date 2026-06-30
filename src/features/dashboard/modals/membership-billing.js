import React, { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { assignMembershipFromKiosk } from "../../login/helper/api";
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
import * as SplashScreen from "expo-splash-screen";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Animated,
  PanResponder,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { C, styles } from "../style-sheet";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.88;

const COUPONS = {
  "FIT5":      { percent: 5,  label: "5% OFF" },
  "GYM10":     { percent: 10, label: "10% OFF" },
  "PULSE20":   { percent: 20, label: "20% OFF" },
  "SHIM30":    { percent: 30, label: "30% OFF" },
  "LIBERTY50": { percent: 50, label: "50% OFF" },
};

const FloatingInput = ({ label, value, onChangeText, error, keyboardType, maxLength }) => {
  const [focused, setFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => { setFocused(true); Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start(); };
  const handleBlur  = () => { setFocused(false); if (!value) Animated.timing(animatedValue, { toValue: 0, duration: 150, useNativeDriver: false }).start(); };

  const labelTop      = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [16, 4] });
  const labelFontSize = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [14, 10] });
  const labelColor    = animatedValue.interpolate({ inputRange: [0, 1], outputRange: ["#aaa", "#1976d2"] });

  return (
    <View style={styles.fieldWrapper}>
      <View style={[styles.inputBox, focused && styles.inputBoxFocused, error && styles.inputError]}>
        <Animated.Text style={{ position: "absolute", left: 12, top: labelTop, fontSize: labelFontSize, color: labelColor, zIndex: 1, pointerEvents: "none", backgroundColor: "transparent" }}>
          {label}
        </Animated.Text>
        <TextInput
          style={{ height: 28, marginTop: 22, marginBottom: 4, fontSize: 15, color: "#111", paddingHorizontal: 0, paddingVertical: 0, borderWidth: 0, outline: "none", outlineWidth: 0, boxShadow: "none", backgroundColor: "transparent" }}
          value={value} onChangeText={onChangeText} onFocus={handleFocus} onBlur={handleBlur}
          keyboardType={keyboardType || "default"} 
          maxLength={maxLength}
          underlineColorAndroid="transparent"
          autoComplete="off" autoCorrect={false} autoCapitalize="none"
          importantForAutofill="no" blurOnSubmit={true} returnKeyType="done"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};


const FloatingDropdown = ({ label, options, value, onSelect, error }) => {
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const fieldRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleOpen = () => {
    fieldRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownTop(py + height);
      setDropdownLeft(px);
      setDropdownWidth(width);
      setVisible(true);
    });
    Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start();
  };

  React.useEffect(() => {
    if (value) Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start();
  }, [value]);

  const labelTop      = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [16, 4] });
  const labelFontSize = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [14, 10] });
  const labelColor    = animatedValue.interpolate({ inputRange: [0, 1], outputRange: ["#aaa", "#1976d2"] });

  return (
    <View style={styles.fieldWrapper}>
      <TouchableOpacity
        ref={fieldRef}
        style={[styles.inputBox, error && styles.inputError]}
        onPress={handleOpen}
        activeOpacity={0.8}
      >
        <Animated.Text style={{
          position: "absolute", left: 12, top: labelTop,
          fontSize: labelFontSize, color: labelColor,
          zIndex: 1, pointerEvents: "none", backgroundColor: "transparent"
        }}>
          {label}
        </Animated.Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 22, marginBottom: 4, height: 28 }}>
          <Text style={{ flex: 1, fontSize: 15, color: value ? "#111" : "transparent" }}>{value || " "}</Text>
          <Ionicons name="chevron-down" size={18} color="#555" />
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal transparent visible={visible} animationType="none" statusBarTranslucent={true}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={{
            position: "absolute",
            top: dropdownTop,
            left: dropdownLeft,
            width: dropdownWidth,
            backgroundColor: "#fff",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#e0e0e0",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 8,
            overflow: "hidden",
          }}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => { onSelect(item); setVisible(false); }}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};


const DateField = ({ label, value, onChange, error }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => { setFocused(true); Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start(); };
  const handleBlur  = () => { setFocused(false); if (!value) Animated.timing(animatedValue, { toValue: 0, duration: 150, useNativeDriver: false }).start(); };

  const handleTextChange = (text) => {
    let cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
    let formatted = cleaned;
    if (cleaned.length >= 3 && cleaned.length <= 4) formatted = cleaned.slice(0, 2) + "-" + cleaned.slice(2);
    else if (cleaned.length >= 5) formatted = cleaned.slice(0, 2) + "-" + cleaned.slice(2, 4) + "-" + cleaned.slice(4);
    onChange(formatted);
    Animated.timing(animatedValue, { toValue: cleaned.length > 0 ? 1 : 0, duration: 150, useNativeDriver: false }).start();
  };

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      onChange(`${day}-${month}-${selectedDate.getFullYear()}`);
      Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    }
  };

  const handleWebChange = (e) => {
    const raw = e.target.value;
    if (raw) { const [y, m, d] = raw.split("-"); onChange(`${d}-${m}-${y}`); Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start(); }
    setShow(false);
  };

  const labelTop      = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [16, 4] });
  const labelFontSize = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [14, 10] });
  const labelColor    = animatedValue.interpolate({ inputRange: [0, 1], outputRange: ["#aaa", "#1976d2"] });
  const isWeb = typeof document !== "undefined";

  return (
    <View style={styles.fieldWrapper}>
      <View style={[styles.inputBox, focused && styles.inputBoxFocused, error && styles.inputError]}>
        <Animated.Text style={{ position: "absolute", left: 12, top: labelTop, fontSize: labelFontSize, color: labelColor, zIndex: 1, pointerEvents: "none", backgroundColor: "transparent" }}>
          {label}
        </Animated.Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 22, marginBottom: 4, height: 28 }}>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: "#111", paddingHorizontal: 0, paddingVertical: 0, borderWidth: 0, outline: "none", outlineWidth: 0, boxShadow: "none", backgroundColor: "transparent" }}
            value={value} onChangeText={handleTextChange} onFocus={handleFocus} onBlur={handleBlur}
            placeholder={focused ? "DD-MM-YYYY" : ""} placeholderTextColor="#bbb"
            keyboardType="numeric" maxLength={10} underlineColorAndroid="transparent" blurOnSubmit={true} returnKeyType="done"
          />
          <TouchableOpacity onPress={() => setShow(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="calendar-outline" size={18} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {show && isWeb && <input type="date" max={new Date().toISOString().split("T")[0]} onChange={handleWebChange} onBlur={() => setShow(false)} autoFocus style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", top: 0, left: 0, cursor: "pointer", zIndex: 999 }} />}
      {show && !isWeb && <DateTimePicker mode="date" display="default" value={new Date()} maximumDate={new Date()} onChange={handleChange} />}
    </View>
  );
};

// ─── BOTTOM DRAWER ────────────────────────────────────────────────────────────
const BottomDrawer = ({ visible, onClose, children }) => {
  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const lastY = useRef(0);

  React.useEffect(() => {
    if (visible) Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
    else Animated.timing(translateY, { toValue: DRAWER_HEIGHT, duration: 300, useNativeDriver: true }).start();
  }, [visible]);

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
    onPanResponderGrant: () => { lastY.current = 0; },
    onPanResponderMove: (_, g) => { if (g.dy > 0) translateY.setValue(g.dy); },
    onPanResponderRelease: (_, g) => {
      if (g.dy > DRAWER_HEIGHT * 0.5) Animated.timing(translateY, { toValue: DRAWER_HEIGHT, duration: 250, useNativeDriver: true }).start(() => onClose());
      else Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
    },
  })).current;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent={true}>
      <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateY }] }]}>
        <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
          <View style={styles.dragHandle} />
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};


const SuccessModal = ({ visible, payable, membershipId, onDone, formatPrice }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent={true}>
      <View style={{
        flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center", alignItems: "center", paddingHorizontal: 24,
      }}>
        <Animated.View style={{
          backgroundColor: "#fff", borderRadius: 20, padding: 32,
          alignItems: "center", width: "100%", maxWidth: 380,
          transform: [{ scale: scaleAnim }],
          shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
        }}>
          {/* Green circle with checkmark */}
          <View style={{
            width: 90, height: 90, borderRadius: 45,
            backgroundColor: "#e8f5e9", justifyContent: "center",
            alignItems: "center", marginBottom: 20,
          }}>
            <View style={{
              width: 70, height: 70, borderRadius: 35,
              backgroundColor: "#4CAF50", justifyContent: "center", alignItems: "center",
            }}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
          </View>

          {/* Title */}
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 6 }}>
            Payment Successful!
          </Text>
          <Text style={{ fontSize: 13, color: "#888", marginBottom: 24, textAlign: "center" }}>
            Your membership has been activated
          </Text>

          {/* Amount box */}
          <View style={{
            backgroundColor: "#f0fff4", borderRadius: 12, borderWidth: 1,
            borderColor: "#c8e6c9", paddingVertical: 16, paddingHorizontal: 24,
            width: "100%", alignItems: "center", marginBottom: 20,
          }}>
            <Text style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>Amount Paid</Text>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#2e7d32" }}>
              {formatPrice(payable)}
            </Text>
          </View>

          {/* Membership ID */}
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 8,
            backgroundColor: "#f5f5f5", borderRadius: 8, paddingVertical: 10,
            paddingHorizontal: 16, width: "100%", marginBottom: 28,
          }}>
            <MaterialIcons name="confirmation-number" size={18} color="#005b96" />
            <View>
              <Text style={{ fontSize: 11, color: "#888" }}>Membership ID</Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#111" }}>{membershipId}</Text>
            </View>
          </View>

          {/* Done button */}
          <TouchableOpacity
            onPress={onDone}
            style={{
              backgroundColor: "#005b96", borderRadius: 12,
              paddingVertical: 14, width: "100%", alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

SplashScreen.preventAutoHideAsync();

export default function Membershipbilling({ visible, onClose, selectedPlans }) {

  const [avatarUri, setAvatarUri]                   = useState(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: "", birthDate: "", maritalStatus: "",
    phone: "", gender: "", anniversaryDate: "", gstin: "",
  });
  const [errors, setErrors]               = useState({});
  const [couponCode, setCouponCode]       = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError]     = useState("");
  const [loading, setLoading]             = useState(false);


  const [showSuccess, setShowSuccess]       = useState(false);
  const [paidAmount, setPaidAmount]         = useState(0);
  const [createdMembershipId, setCreatedMembershipId] = useState("");

  const total    = selectedPlans.reduce((sum, p) => sum + p.price, 0);
  const discount = appliedCoupon ? Math.round((total * appliedCoupon.percent) / 100) : 0;
  const payable  = total - discount;
  const formatPrice = (v) => `₹${v.toLocaleString("en-IN")}`;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) { setAppliedCoupon(COUPONS[code]); setCouponError(""); }
    else { setAppliedCoupon(null); setCouponError("Invalid code. Try: FIT5, GYM10, PULSE20, SHIM30, LIBERTY50"); }
  };
  const removeCoupon = () => { setAppliedCoupon(null); setCouponCode(""); setCouponError(""); };

  const openCamera = async () => {
    setPickerModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permission needed", "Camera permission is required."); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };
  const openGallery = async () => {
    setPickerModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permission needed", "Gallery permission is required."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const updateField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };
  const validate = () => {
    const e = {};
    if (!form.name.trim())      e.name      = "Name is required";
    if (!form.birthDate.trim()) e.birthDate = "Birth date is required";
    if (form.maritalStatus === "Married" && !form.anniversaryDate.trim()) e.anniversaryDate = "Anniversary date is required";
    if (!form.phone.trim())     e.phone     = "Phone is required";
    if (!form.gender)           e.gender    = "Gender is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── handlePay ──────────────────────────────────────────────────────────────
  const handlePay = async () => {
  if (!validate()) return;
  setLoading(true);
  try {
    const membership = await assignMembershipFromKiosk(
      form,
      selectedPlans,
      payable,
      "upi"
    );
    console.log("Membership assigned:", membership);

    setPaidAmount(payable);
    setCreatedMembershipId(membership._id);
    setShowSuccess(true);

  } catch (err) {
    console.error("API error:", err);
    Alert.alert("Payment Failed", err.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  
  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <BottomDrawer visible={visible} onClose={onClose}>

        {/* MY BIO */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Ionicons name="person-outline" size={22} color="#005b96" />
            <Text style={styles.sectionTitle}>My Bio</Text>
          </View>
          <View style={styles.bioContainer}>
            <View style={styles.formContainer}>
              <FloatingInput label="Name *"           value={form.name}            onChangeText={(v) => updateField("name", v)}          error={errors.name} />
              <FloatingInput label="Phone"            
              value={form.phone}           
              onChangeText={(v) => updateField("phone", v.replace(/[^0-9]/g, "").slice(0, 10))}         
              error={errors.phone} 
              keyboardType="phone-pad" 
              maxLength= {10}/>
              <DateField     label="Birth Date"       value={form.birthDate}       onChange={(v) => updateField("birthDate", v)}         error={errors.birthDate} />
              <FloatingDropdown label="Marital Status" options={["Single", "Married", "Divorced", "Widowed"]} value={form.maritalStatus} onSelect={(v) => updateField("maritalStatus", v)} error={errors.maritalStatus} />
              <FloatingDropdown label="Gender"        options={["Male", "Female", "Other"]} value={form.gender} onSelect={(v) => updateField("gender", v)} error={errors.gender} />
              <DateField     label="Anniversary Date" value={form.anniversaryDate} onChange={(v) => updateField("anniversaryDate", v)}  error={errors.anniversaryDate} />
              <FloatingInput label="GSTIN Number"     value={form.gstin}           onChangeText={(v) => updateField("gstin", v)}        error={errors.gstin} />
            </View>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                {avatarUri ? <Image source={{ uri: avatarUri }} style={styles.avatarImage} /> : <Ionicons name="person" size={40} color="#fff" />}
                <TouchableOpacity style={styles.cameraBtn} onPress={() => setPickerModalVisible(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* MEMBERSHIP & BILLING */}
        <View style={styles.middleContainer}>

          {/* LEFT */}
          <View style={styles.leftColumn}>
            <View style={styles.titleRow}>
              <Ionicons name="calendar-outline" size={22} color="#005b96" />
              <Text style={styles.sectionTitle}>Selected Memberships</Text>
            </View>
            {selectedPlans.map((plan) => (
              <View key={plan.id} style={styles.membershipCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planTitle}>{plan.label}</Text>
                  <Text style={styles.planName}>{plan.duration}</Text>
                  <Text style={styles.price}>{formatPrice(plan.price)}</Text>
                </View>
                <View style={styles.verticalLine} />
                <View>
                  <Text style={styles.smallHeading}>Duration</Text>
                  <Text style={styles.smallValue}>{plan.duration}</Text>
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={styles.smallHeading}>Status</Text>
                  <Text style={styles.smallValue}>Selected</Text>
                </View>
              </View>
            ))}

            <View style={styles.titleRow}>
              <MaterialIcons name="payment" size={22} color="#005b96" />
              <Text style={styles.sectionTitle}>Payment method</Text>
            </View>
            <View style={styles.upiCard}>
              <Image source={require("../../../../assets/upi (1).png")} style={styles.upiLogo} resizeMode="contain" />
            </View>

            {/* COUPON */}
            <View style={{ marginTop: 10 }}>
              {appliedCoupon ? (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1.5, borderColor: "#4CAF50", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#f0fff4" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <View>
                      <Text style={{ fontWeight: "700", color: "#4CAF50", fontSize: 13 }}>{couponCode.toUpperCase()} Applied!</Text>
                      <Text style={{ color: "#4CAF50", fontSize: 11 }}>{appliedCoupon.label} — You save {formatPrice(discount)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={removeCoupon}>
                    <Ionicons name="close-circle" size={22} color="#e53935" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={{ flexDirection: "row", borderWidth: 1, borderColor: couponError ? "#e53935" : "#ccc", borderRadius: 8, overflow: "hidden" }}>
                    <TextInput
                      placeholder="Enter Coupon Code" value={couponCode}
                      onChangeText={(t) => { setCouponCode(t); setCouponError(""); }}
                      style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: "#111" }}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity onPress={applyCoupon} style={{ backgroundColor: "#005b96", paddingHorizontal: 16, justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                  {couponError ? <Text style={{ color: "#e53935", fontSize: 11, marginTop: 4, marginLeft: 4 }}>{couponError}</Text> : null}
                </View>
              )}
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.rightColumn}>
            <View style={styles.titleRow}>
              <MaterialIcons name="receipt-long" size={22} color="#005b96" />
              <Text style={styles.sectionTitle}>Billing Summary</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billText}>Selected Plan Total</Text>
              <Text style={styles.billAmount}>{formatPrice(total)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billText}>Coupon Discount{appliedCoupon ? ` (${appliedCoupon.percent}%)` : ""}</Text>
              <Text style={styles.discount}>{discount > 0 ? `- ${formatPrice(discount)}` : "- ₹ 0"}</Text>
            </View>
            {appliedCoupon && (
              <>
                <View style={{ borderTopWidth: 1, borderTopColor: "#eee", marginVertical: 8 }} />
                <View style={styles.billRow}>
                  <Text style={{ fontWeight: "700", fontSize: 14, color: "#111" }}>Payable Amount</Text>
                  <Text style={{ fontWeight: "700", fontSize: 14, color: "#005b96" }}>{formatPrice(payable)}</Text>
                </View>
              </>
            )}

            {/* PAY BUTTON */}
            <TouchableOpacity
              style={[styles.payBtn, loading && { opacity: 0.7 }]}
              onPress={handlePay}
              disabled={loading}
            >
              <Text style={styles.payText}>
                {loading ? "Processing..." : `Pay ${formatPrice(payable)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomDrawer>
      <SuccessModal
        visible={showSuccess}
        payable={paidAmount}
        membershipId={createdMembershipId}
        onDone={handleSuccessDone}
        formatPrice={formatPrice}
      />

      {/* IMAGE PICKER MODAL */}
      <Modal transparent visible={pickerModalVisible} animationType="fade" statusBarTranslucent={true}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPickerModalVisible(false)}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Choose Photo</Text>
            <TouchableOpacity style={styles.pickerOption} onPress={openCamera}>
              <Ionicons name="camera-outline" size={24} color="#1976d2" />
              <Text style={styles.pickerOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <View style={styles.pickerDivider} />
            {/* <TouchableOpacity style={styles.pickerOption} onPress={openGallery}>
              <Ionicons name="image-outline" size={24} color="#1976d2" />
              <Text style={styles.pickerOptionText}>Choose from Gallery</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.pickerCancel} onPress={() => setPickerModalVisible(false)}>
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}