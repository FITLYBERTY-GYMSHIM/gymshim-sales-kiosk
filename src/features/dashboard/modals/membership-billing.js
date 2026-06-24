import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Membershipbilling() {
  return (
    <ScrollView style={styles.container}>
      {/* Top Handle */}
      <View style={styles.handle} />

      {/* My Bio */}
      <View style={styles.section}>
        <View style={styles.titleRow}>
          <Ionicons name="person-outline" size={22} color="#005b96" />
          <Text style={styles.sectionTitle}>My Bio</Text>
        </View>

        <View style={styles.bioContainer}>
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Enter Your Name"
              style={styles.input}
            />

            <TextInput
              placeholder="DD-MM-YYYY"
              style={styles.input}
            />

            <TextInput
              placeholder="Select"
              style={styles.input}
            />

            <TextInput
              placeholder="+91 00000-00000"
              style={styles.input}
            />

            <TextInput
              placeholder="Select Gender"
              style={styles.input}
            />

            <TextInput
              placeholder="DD-MM-YYYY"
              style={styles.input}
            />

            <TextInput
              placeholder="Enter GSTIN Number"
              style={[styles.input, { width: "48%" }]}
            />
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <TouchableOpacity style={styles.cameraBtn}>
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Membership & Billing */}
      <View style={styles.middleContainer}>
        {/* Left */}
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

          {/* Payment Method */}
          <View style={styles.titleRow}>
            <MaterialIcons
              name="payment"
              size={22}
              color="#005b96"
            />
            <Text style={styles.sectionTitle}>Payment method</Text>
          </View>

          <View style={styles.upiCard}>
            <Text style={styles.upiText}>UPI</Text>
          </View>

          <TextInput
            placeholder="Enter Coupon Code"
            style={styles.couponInput}
          />
        </View>

        {/* Right */}
        <View style={styles.rightColumn}>
          <View style={styles.titleRow}>
            <MaterialIcons
              name="receipt-long"
              size={22}
              color="#005b96"
            />
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

          <TouchableOpacity style={styles.payBtn}>
            <Text style={styles.payText}>Pay ₹ 3300</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  handle: {
    width: 100,
    height: 6,
    backgroundColor: "#d00000",
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  section: {
    backgroundColor: "#ececec",
    padding: 16,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 10,
    color: "#111",
  },

  bioContainer: {
    flexDirection: "row",
  },

  formContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  input: {
    width: "48%",
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1976d2",
    paddingHorizontal: 12,
  },

  avatarSection: {
    width: 150,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 115,
    height: 115,
    borderRadius: 55,
    backgroundColor: "#bdbdbd",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },

  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#666",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  middleContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },

  leftColumn: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },

  rightColumn: {
    flex: 1,
    padding: 16,
  },

  membershipCard: {
    flexDirection: "row",
    backgroundColor: "#ecffe9",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
  },

  planTitle: {
    color: "#888",
    fontWeight: "600",
  },

  planName: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 2,
  },

  price: {
    color: "#ff3333",
    fontWeight: "bold",
    marginTop: 10,
  },

  verticalLine: {
    width: 1,
    height: 60,
    backgroundColor: "#ff3333",
    marginHorizontal: 15,
  },

  smallHeading: {
    color: "#d32f2f",
    fontWeight: "600",
  },

  smallValue: {
    marginTop: 10,
    fontWeight: "500",
  },

  upiCard: {
    height: 100,
    backgroundColor: "#d9efff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  upiText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#004a8f",
  },

  couponInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#2ecc71",
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  billText: {
    fontSize: 18,
  },

  billAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },

  discount: {
    fontSize: 20,
    color: "#00c853",
    fontWeight: "bold",
  },

  payBtn: {
    backgroundColor: "#00a11b",
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  payText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});