import React, { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  StyleSheet,
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

// Floating Label Input
const FloatingInput = ({ label, value, onChangeText, error, keyboardType }) => {
  const [focused, setFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    if (!value) {
      Animated.timing(animatedValue, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    }
  };

  const labelTop = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [17, 6] });
  const labelFontSize = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor = animatedValue.interpolate({ inputRange: [0, 1], outputRange: ["#aaa", "#1976d2"] });

  return (
    <View style={styles.fieldWrapper}>
      <View style={[styles.inputBox, focused && styles.inputBoxFocused, error && styles.inputError]}>
        <Animated.Text style={[styles.floatingLabel, { top: labelTop, fontSize: labelFontSize, color: labelColor }]}>
          {label}
        </Animated.Text>
        <TextInput
          style={styles.inputField}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType || "default"}
          underlineColorAndroid="transparent"
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
          importantForAutofill="no"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Floating Label Dropdown
const FloatingDropdown = ({ label, options, value, onSelect, error }) => {
  const [visible, setVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleOpen = () => {
    setVisible(true);
    Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start();
  };

  React.useEffect(() => {
    if (value) {
      Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    }
  }, [value]);

  const labelTop = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [17, 6] });
  const labelFontSize = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor = animatedValue.interpolate({ inputRange: [0, 1], outputRange: ["#aaa", "#1976d2"] });

  return (
    <View style={styles.fieldWrapper}>
      <TouchableOpacity style={[styles.inputBox, error && styles.inputError]} onPress={handleOpen} activeOpacity={0.8}>
        <Animated.Text style={[styles.floatingLabel, { top: labelTop, fontSize: labelFontSize, color: labelColor }]}>
          {label}
        </Animated.Text>
        <View style={styles.dropdownRow}>
          <Text style={[styles.inputField, { color: value ? "#111" : "transparent" }]}>{value || " "}</Text>
          <Ionicons name="chevron-down" size={18} color="#555" />
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dropdownItem} onPress={() => { onSelect(item); setVisible(false); }}>
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
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      // Format as DD-MM-YYYY
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();
      onChange(`${day}-${month}-${year}`);
      Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    }
  };

  const labelTop = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [17, 6] });
  const labelFontSize = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor = animatedValue.interpolate({ inputRange: [0, 1], outputRange: ["#aaa", "#1976d2"] });

  return (
    <View style={styles.fieldWrapper}>
      <TouchableOpacity
        style={[styles.inputBox, error && styles.inputError]}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Animated.Text style={[styles.floatingLabel, { top: labelTop, fontSize: labelFontSize, color: labelColor }]}>
          {label}
        </Animated.Text>
        <View style={styles.dropdownRow}>
          <Text style={[styles.inputField, { color: value ? "#111" : "transparent" }]}>
            {value || " "}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#555" />
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          mode="date"
          display="default"
          value={new Date()}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

// Bottom Drawer Component
const BottomDrawer = ({ visible, onClose, children }) => {
  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const lastY = useRef(0);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
    } else {
      Animated.timing(translateY, { toValue: DRAWER_HEIGHT, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderGrant: () => { lastY.current = 0; },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DRAWER_HEIGHT * 0.5) {
          Animated.timing(translateY, { toValue: DRAWER_HEIGHT, duration: 250, useNativeDriver: true }).start(() => onClose());
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateY }] }]}>
        <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
          <View style={styles.dragHandle} />
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default function Membershipbilling() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [avatarUri, setAvatarUri] = useState(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: "", birthDate: "", maritalStatus: "",
    phone: "", gender: "", anniversaryDate: "", gstin: "",
  });
  const [errors, setErrors] = useState({});

  // Open camera
  const openCamera = async () => {
    setPickerModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  // Open gallery
  const openGallery = async () => {
    setPickerModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery permission is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const updateField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.birthDate.trim()) newErrors.birthDate = "Birth date is required";
    if (
      form.maritalStatus === "Married" &&
      !form.anniversaryDate.trim()
    ) {
      newErrors.anniversaryDate = "Anniversary date is required";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.bgPage}>
        <Text style={styles.bgText}>GymShim 2.0</Text>
      </View>

      <BottomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {/* My Bio */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Ionicons name="person-outline" size={22} color="#005b96" />
            <Text style={styles.sectionTitle}>My Bio</Text>
          </View>

          <View style={styles.bioContainer}>
            <View style={styles.formContainer}>
              <FloatingInput label="Name *" value={form.name} onChangeText={(v) => updateField("name", v)} error={errors.name} />
              <FloatingInput label="Phone" value={form.phone} onChangeText={(v) => updateField("phone", v)} error={errors.phone} keyboardType="phone-pad" />
              <FloatingInput label="Birth Date" value={form.birthDate} onChangeText={(v) => updateField("birthDate", v)} error={errors.birthDate} />
              <FloatingDropdown label="Marital Status" options={["Single", "Married", "Divorced", "Widowed"]} value={form.maritalStatus} onSelect={(v) => updateField("maritalStatus", v)} error={errors.maritalStatus} />
              <FloatingDropdown label="Gender" options={["Male", "Female", "Other"]} value={form.gender} onSelect={(v) => updateField("gender", v)} error={errors.gender} />
              <FloatingInput
                  label="Anniversary Date"
                  value={form.anniversaryDate}
                  onChangeText={(v) => updateField("anniversaryDate", v)}
                  error={errors.anniversaryDate}
                />
              <FloatingInput label="GSTIN Number" value={form.gstin} onChangeText={(v) => updateField("gstin", v)} error={errors.gstin} />
            </View>

            {/* Avatar */}
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={40} color="#fff" />
                )}
                <TouchableOpacity style={styles.cameraBtn} onPress={() => setPickerModalVisible(true)}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Membership & Billing */}
        <View style={styles.middleContainer}>
          <View style={styles.leftColumn}>
            <View style={styles.titleRow}>
              <Ionicons name="calendar-outline" size={22} color="#005b96" />
              <Text style={styles.sectionTitle}>Selected Memberships</Text>
            </View>

            {[1, 2].map((item) => (
              <View key={item} style={styles.membershipCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planTitle}>GYM WORKOUT</Text>
                  <Text style={styles.planName}>Annual Plan</Text>
                  <Text style={styles.price}>₹ 11,999 / YR</Text>
                </View>
                <View style={styles.verticalLine} />
                <View>
                  <Text style={styles.smallHeading}>Duration</Text>
                  <Text style={styles.smallValue}>30 Days</Text>
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={styles.smallHeading}>Session</Text>
                  <Text style={styles.smallValue}>20/30</Text>
                </View>
              </View>
            ))}

            <View style={styles.titleRow}>
              <MaterialIcons name="payment" size={22} color="#005b96" />
              <Text style={styles.sectionTitle}>Payment method</Text>
            </View>

            <View style={styles.upiCard}>
              <Image source={require("../../../../assets/upi (1).png")} style={styles.upiLogo} resizeMode="contain"/>
            </View>

            <TextInput placeholder="Enter Coupon Code" style={styles.couponInput} />
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.titleRow}>
              <MaterialIcons name="receipt-long" size={22} color="#005b96" />
              <Text style={styles.sectionTitle}>Billing Summary</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billText}>Selected Plan Total</Text>
              <Text style={styles.billAmount}>₹ 3400</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billText}>Coupon Discount</Text>
              <Text style={styles.discount}>- ₹ 100</Text>
            </View>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => { if (validate()) { console.log("Proceed to pay", form); } }}
            >
              <Text style={styles.payText}>Pay ₹ 3300</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomDrawer>

      {/* Image Picker Modal — outside drawer so it renders on top */}
      <Modal transparent visible={pickerModalVisible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPickerModalVisible(false)}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Choose Photo</Text>
            <TouchableOpacity style={styles.pickerOption} onPress={openCamera}>
              <Ionicons name="camera-outline" size={24} color="#1976d2" />
              <Text style={styles.pickerOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <View style={styles.pickerDivider} />
            <TouchableOpacity style={styles.pickerOption} onPress={openGallery}>
              <Ionicons name="image-outline" size={24} color="#1976d2" />
              <Text style={styles.pickerOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerCancel} onPress={() => setPickerModalVisible(false)}>
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

