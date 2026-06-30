import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Text from "../../../components/text";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { fetchBranchEmployees } from "../helper/api";

const AVATAR_COLORS = ["#1565C0", "#2E7D32", "#6A1B9A", "#AD1457", "#00838F"];

// ─── NUNITO TEXT ──────────────────────────────────────────────────────────────
const N = ({ style, weight, children, ...props }) => {
  const fontFamily =
    weight === "800" ? "Nunito_800ExtraBold" :
    weight === "700" ? "Nunito_700Bold" :
    weight === "600" ? "Nunito_600SemiBold" :
    "Nunito_400Regular";
  return (
    <Text style={[{ fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
};

function colorForId(id) {
  let hash = 0;
  for (let i = 0; i < String(id).length; i++) {
    hash = (hash + String(id).charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash];
}

function initialsFor(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── EMPLOYEE CARD ────────────────────────────────────────────────────────────
const EmployeeCard = ({ employee }) => {
  const color = colorForId(employee.id);
  const initials = initialsFor(employee.name);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E8ECF0",
        marginBottom: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <N weight="800" style={{ color: "#fff", fontSize: 18 }}>{initials}</N>
      </View>

      <View style={{ flex: 1 }}>
        <N weight="700" style={{ fontSize: 16, color: "#111", marginBottom: 4 }}>
          {employee.name}
        </N>

        {employee.phone ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <Ionicons name="call-outline" size={13} color="#888" />
            <N style={{ fontSize: 12, color: "#666" }}>{employee.phone}</N>
          </View>
        ) : null}

        {employee.email ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <MaterialIcons name="email" size={13} color="#888" />
            <N style={{ fontSize: 12, color: "#666" }}>{employee.email}</N>
          </View>
        ) : null}
      </View>
    </View>
  );
};

// ─── LOADING / ERROR STATES ───────────────────────────────────────────────────
function LoadingState() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#005b96" />
      <N style={{ marginTop: 12, color: "#666" }}>Loading employees...</N>
    </View>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
      <N style={{ marginTop: 12, fontSize: 15, color: "#444", textAlign: "center" }}>
        {error}
      </N>
      <TouchableOpacity
        onPress={onRetry}
        style={{
          marginTop: 16,
          backgroundColor: "#005b96",
          paddingHorizontal: 24,
          paddingVertical: 10,
          borderRadius: 8,
        }}
      >
        <N weight="700" style={{ color: "#fff" }}>Retry</N>
      </TouchableOpacity>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function GymTrainersScreen({ onClose }) {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchBranchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#005b96", paddingTop: 52, paddingBottom: 16, paddingHorizontal: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {onClose && (
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <N weight="800" style={{ fontSize: 20, color: "#fff" }}>Our Team</N>
            <N style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
              {employees.length} {employees.length === 1 ? "member" : "members"} at this branch
            </N>
          </View>
        </View>
      </View>

      {loading && !refreshing ? (
        <LoadingState />
      ) : error && employees.length === 0 ? (
        <ErrorState error={error} onRetry={load} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}