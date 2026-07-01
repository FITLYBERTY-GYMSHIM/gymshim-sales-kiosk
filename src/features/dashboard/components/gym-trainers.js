import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { fetchBranchEmployees } from "../helper/api";
const SCREEN_WIDTH = Dimensions.get("window").width;

const SPECIALIZATIONS = [
  "Strength & Conditioning",
  "Yoga & Flexibility",
  "Weight Loss & Nutrition",
  "Cardio & HIIT",
  "Bodybuilding & Nutrition",
  "Functional Training",
];
const CERTIFICATIONS_POOL = [
  ["NSCA-CSCS", "CrossFit L2"],
  ["RYT-500", "Pilates Certified"],
  ["ACE-CPT", "Precision Nutrition L1"],
  ["ACSM-CPT", "TRX Certified"],
  ["ISSA Elite Trainer", "Sports Nutrition Specialist"],
];
const LOCATIONS = ["Koramangala, Bangalore", "Indiranagar, Bangalore", "HSR Layout, Bangalore", "Whitefield, Bangalore"];

// Deterministically derive filler stats from the employee id, so the same
// employee always gets the same "fake" rating/fee/etc instead of changing
// every refresh.
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function enrichEmployee(emp) {
  const h = hashString(String(emp.id));
  const rating = (4.0 + (h % 10) / 10).toFixed(1) * 1;
  const totalRatings = 50 + (h % 500);
  const fee = 800 + (h % 12) * 100;
  const available = true; // h % 5 !==0;
  const specialization = SPECIALIZATIONS[h % SPECIALIZATIONS.length];
  const certifications = CERTIFICATIONS_POOL[h % CERTIFICATIONS_POOL.length];
  const location = LOCATIONS[h % LOCATIONS.length];
  const experienceYears = 2 + (h % 12);

  const five = Math.round(totalRatings * 0.6);
  const four = Math.round(totalRatings * 0.22);
  const three = Math.round(totalRatings * 0.1);
  const two = Math.round(totalRatings * 0.05);
  const one = Math.max(0, totalRatings - five - four - three - two);

  return {
    id: emp.id,
    name: emp.name,
    phone: emp.phone,
    email: emp.email,
    specialization,
    experience: `${experienceYears} years experience overall`,
    location,
    gym: "Pulse Fitness",
    fee: `\u20B9${fee.toLocaleString("en-IN")}`,
    feeLabel: "Session fee",
    rating,
    totalRatings,
    available,
    certifications,
    ratingBreakdown: { 5: five, 4: four, 3: three, 2: two, 1: one },
    bio: `Experienced ${specialization.toLowerCase()} coach helping members at ${location.split(",")[0]} reach their fitness goals.`,
  };
}

const StarRating = ({ rating, size = 14, color = "#FFA726" }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rating);
    const half = !filled && i === Math.ceil(rating) && rating % 1 >= 0.5;
    stars.push(
      <FontAwesome
        key={i}
        name={filled ? "star" : half ? "star-half-o" : "star-o"}
        size={size}
        color={color}
        style={{ marginRight: 1 }}
      />
    );
  }
  return <View style={{ flexDirection: "row", alignItems: "center" }}>{stars}</View>;
};

const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
      <Text style={{ fontSize: 12, color: "#555", width: 14 }}>{star}</Text>
      <FontAwesome name="star" size={11} color="#FFA726" style={{ marginHorizontal: 4 }} />
      <View style={{ flex: 1, height: 7, backgroundColor: "#ECECEC", borderRadius: 4, overflow: "hidden", marginHorizontal: 6 }}>
        <View style={{ width: `${pct}%`, height: "100%", backgroundColor: pct > 60 ? "#4CAF50" : pct > 30 ? "#FFA726" : "#EF5350", borderRadius: 4 }} />
      </View>
      <Text style={{ fontSize: 12, color: "#888", width: 28, textAlign: "right" }}>{count}</Text>
    </View>
  );
};

const RatingsModal = ({ visible, onClose, trainer }) => {
  if (!trainer) return null;
  const total = trainer.totalRatings;
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#111" }}>Ratings & Reviews</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 16 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 48, fontWeight: "800", color: "#111", lineHeight: 52 }}>{trainer.rating.toFixed(1)}</Text>
              <StarRating rating={trainer.rating} size={16} />
              <Text style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{total} ratings</Text>
            </View>
            <View style={{ flex: 1 }}>
              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar key={star} star={star} count={trainer.ratingBreakdown[star]} total={total} />
              ))}
            </View>
          </View>

          <View style={{ backgroundColor: "#F5F7FA", borderRadius: 10, padding: 12 }}>
            <Text style={{ fontSize: 13, color: "#444", lineHeight: 19 }}>{trainer.bio}</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── TRAINER CARD ────────────────────────────────────────────────────────────
const TrainerCard = ({ trainer, onViewRatings, onBook }) => {
  const initials = trainer.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const COLORS = ["#1565C0", "#2E7D32", "#6A1B9A", "#AD1457", "#00838F"];
  const color = COLORS[hashString(String(trainer.id)) % COLORS.length];

  return (
    <View style={{
      backgroundColor: "#fff",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#E8ECF0",
      marginBottom: 14,
      overflow: "hidden",
    }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", gap: 14 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: color, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#E8ECF0" }}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 22 }}>{initials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#111", marginBottom: 2 }}>{trainer.name}</Text>
            <Text style={{ fontSize: 13, color: "#555", marginBottom: 2 }}>{trainer.specialization}</Text>
            <Text style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{trainer.experience}</Text>

            <TouchableOpacity onPress={() => onViewRatings(trainer)} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <StarRating rating={trainer.rating} size={13} />
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#FFA726" }}>{trainer.rating.toFixed(1)}</Text>
              <Ionicons name="chevron-forward" size={14} color="#005b96" />
              <Text style={{ fontSize: 12, color: "#005b96", textDecorationLine: "underline" }}>({trainer.totalRatings} reviews)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="location-outline" size={14} color="#888" />
            <Text style={{ fontSize: 12, color: "#666" }}>{trainer.location}</Text>
            <Text style={{ fontSize: 12, color: "#ccc", marginHorizontal: 4 }}>·</Text>
            <Text style={{ fontSize: 12, color: "#666" }}>{trainer.gym}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 4 }}>
          <MaterialIcons name="currency-rupee" size={13} color="#333" />
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111" }}>{trainer.fee}</Text>
          <Text style={{ fontSize: 12, color: "#888" }}> {trainer.feeLabel}</Text>
        </View>

        {/* Contact info — real data */}
        <View style={{ marginBottom: 10 }}>
          {trainer.phone ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <Ionicons name="call-outline" size={13} color="#888" />
              <Text style={{ fontSize: 12, color: "#666" }}>{trainer.phone}</Text>
            </View>
          ) : null}
          {trainer.email ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <MaterialIcons name="email" size={13} color="#888" />
              <Text style={{ fontSize: 12, color: "#666" }}>{trainer.email}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {trainer.certifications.map((cert) => (
            <View key={cert} style={{ backgroundColor: "#EEF4FF", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, color: "#1565C0", fontWeight: "600" }}>{cert}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: trainer.available ? "#4CAF50" : "#9E9E9E" }} />
            <Text style={{ fontSize: 12, color: trainer.available ? "#2E7D32" : "#9E9E9E", fontWeight: "600" }}>
              {trainer.available ? "Available Today" : "Not Available"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={{ borderWidth: 1.5, borderColor: "#005b96", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 }}
              onPress={() => {}}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#005b96" }}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: trainer.available ? "#005b96" : "#B0BEC5", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 }}
              disabled={!trainer.available}
              onPress={() => onBook(trainer)}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>Book Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── LOADING / ERROR STATES ───────────────────────────────────────────────────
function LoadingState() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#005b96" />
      <Text style={{ marginTop: 12, color: "#666" }}>Loading trainers...</Text>
    </View>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
      <Text style={{ marginTop: 12, fontSize: 15, color: "#444", textAlign: "center" }}>{error}</Text>
      <TouchableOpacity
        onPress={onRetry}
        style={{ marginTop: 16, backgroundColor: "#005b96", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function GymTrainersScreen({ onClose }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [ratingsModalVisible, setRatingsModalVisible] = useState(false);
  const [filter, setFilter] = useState("All");

  const FILTERS = ["All", "Available", "Strength", "Yoga", "Cardio", "Nutrition"];

  const load = useCallback(async () => {
    try {
      setError(null);
      const rawEmployees = await fetchBranchEmployees();
      const enriched = rawEmployees.map(enrichEmployee);
      setTrainers(enriched);
    } catch (err) {
      console.error("Failed to load trainers:", err);
      setError(err.message || "Failed to load trainers");
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

  const filteredTrainers = trainers.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Available") return t.available;
    if (filter === "Strength") return t.specialization.toLowerCase().includes("strength");
    if (filter === "Yoga") return t.specialization.toLowerCase().includes("yoga");
    if (filter === "Cardio") return t.specialization.toLowerCase().includes("cardio");
    if (filter === "Nutrition") return t.specialization.toLowerCase().includes("nutrition");
    return true;
  });

  const handleViewRatings = (trainer) => {
    setSelectedTrainer(trainer);
    setRatingsModalVisible(true);
  };

  const handleBook = (trainer) => {
    alert(`Booking session with ${trainer.name}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#005b96", paddingTop:26 , paddingBottom: 26, paddingHorizontal: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 }}>
          {onClose && (
            <TouchableOpacity onPress={onClose} hitSlop={{  }}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1, justifyContent: "center"}}>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>Our Trainers</Text>
            <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", marginTop: -2 }}>
              {trainers.length} trainers at Pulse Fitness
            </Text>
          </View>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, flexShrink: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{
              backgroundColor: filter === f ? "#005b96" : "#fff",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: filter === f ? "#005b96" : "#D8DDE3",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "600", color: filter === f ? "#fff" : "#555" }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && !refreshing ? (
        <LoadingState />
      ) : error && trainers.length === 0 ? (
        <ErrorState error={error} onRetry={load} />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <Text style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
            {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? "s" : ""} found
          </Text>
          {filteredTrainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onViewRatings={handleViewRatings}
              onBook={handleBook}
            />
          ))}
        </ScrollView>
      )}

      <RatingsModal
        visible={ratingsModalVisible}
        onClose={() => { setRatingsModalVisible(false); setSelectedTrainer(null); }}
        trainer={selectedTrainer}
      />
    </View>
  );
}