import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";

const SCREEN_WIDTH = Dimensions.get("window").width;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const TRAINERS = [
  {
    id: "1",
    name: "Rohit Sharma",
    specialization: "Strength & Conditioning",
    experience: "8 years experience overall",
    location: "Koramangala, Bangalore",
    gym: "Pulse Fitness",
    fee: "₹1,500",
    feeLabel: "Session fee",
    rating: 4.8,
    totalRatings: 312,
    available: true,
    phone: "+91 98765 43210",
    certifications: ["NSCA-CSCS", "CrossFit L2"],
    avatar: null,
    ratingBreakdown: { 5: 210, 4: 72, 3: 20, 2: 6, 1: 4 },
    bio: "Specialises in powerlifting, functional movement, and athletic performance. Works with beginners and competitive athletes alike.",
    slots: {
      Today: ["06:00 AM", "07:00 AM", "08:00 AM", "05:00 PM", "06:00 PM"],
      Tomorrow: ["07:00 AM", "08:00 AM", "06:00 PM", "07:00 PM"],
      "Wed": [],
    },
  },
  {
    id: "2",
    name: "Nilesh Deb",
    specialization: "Yoga & Flexibility",
    experience: "12 years experience overall",
    location: "Indiranagar, Bangalore",
    gym: "Pulse Fitness",
    fee: "₹1,200",
    feeLabel: "Session fee",
    rating: 4.6,
    totalRatings: 189,
    available: true,
    phone: "+91 87654 32109",
    certifications: ["RYT-500", "Pilates Certified"],
    avatar: null,
    ratingBreakdown: { 5: 120, 4: 45, 3: 16, 2: 5, 1: 3 },
    bio: "Brings a holistic approach combining Hatha yoga, mobility work, and breathwork. Ideal for stress relief and injury rehabilitation.",
    slots: {
      Today: ["06:30 AM", "07:30 AM", "04:00 PM", "05:00 PM"],
      Tomorrow: ["06:30 AM", "07:30 AM"],
      "Wed": ["05:00 PM", "06:00 PM"],
    },
  },
  {
    id: "3",
    name: "Pintu Deb",
    specialization: "Weight Loss & Nutrition",
    experience: "5 years experience overall",
    location: "HSR Layout, Bangalore",
    gym: "Pulse Fitness",
    fee: "₹1,800",
    feeLabel: "Session fee",
    rating: 4.2,
    totalRatings: 94,
    available: false,
    phone: "+91 76543 21098",
    certifications: ["ACE-CPT", "Precision Nutrition L1"],
    avatar: null,
    ratingBreakdown: { 5: 45, 4: 28, 3: 12, 2: 6, 1: 3 },
    bio: "Data-driven coaching with personalised nutrition plans. Helped 100+ clients achieve sustainable fat loss.",
    slots: {
      Today: [],
      Tomorrow: [],
      "Wed": ["09:00 AM", "10:00 AM"],
    },
  },
  {
    id: "4",
    name: "Anik Roy",
    specialization: "Cardio & HIIT",
    experience: "7 years experience overall",
    location: "Whitefield, Bangalore",
    gym: "Pulse Fitness",
    fee: "₹1,000",
    feeLabel: "Session fee",
    rating: 4.9,
    totalRatings: 427,
    available: true,
    phone: "+91 65432 10987",
    certifications: ["ACSM-CPT", "TRX Certified"],
    avatar: null,
    ratingBreakdown: { 5: 380, 4: 35, 3: 8, 2: 3, 1: 1 },
    bio: "High-energy group and one-on-one HIIT training. Passionate about making cardio fun and effective for all fitness levels.",
    slots: {
      Today: ["05:30 AM", "06:30 AM", "07:30 AM", "04:30 PM"],
      Tomorrow: ["06:30 AM", "07:30 AM", "05:30 PM"],
      "Wed": ["06:00 AM", "07:00 AM"],
    },
  },
  {
  id: "5",
  name: "Aditya Paul",
  specialization: "Strength & Conditioning",
  experience: "6 years experience overall",
  location: "Koramangala, Bangalore",
  gym: "Pulse Fitness",
  fee: "₹900",
  feeLabel: "Session fee",
  rating: 4.8,
  totalRatings: 365,
  available: true,
  phone: "+91 98765 43210",
  certifications: ["NSCA-CPT", "Kettlebell Level 1"],
  avatar: null,
  ratingBreakdown: { 5: 310, 4: 42, 3: 9, 2: 3, 1: 1 },
  bio: "Dedicated strength coach helping clients improve muscle gain, endurance, and athletic performance through personalized training.",
  slots: {
    Today: ["07:00 AM", "08:00 AM", "06:00 PM"],
    Tomorrow: ["06:30 AM", "07:30 AM", "05:30 PM"],
    Wed: ["07:00 AM", "08:00 AM"],
  },
},
{
  id: "6",
  name: "Debojyoti Debnath",
  specialization: "Weight Loss & Functional Training",
  experience: "8 years experience overall",
  location: "HSR Layout, Bangalore",
  gym: "Pulse Fitness",
  fee: "₹1,100",
  feeLabel: "Session fee",
  rating: 4.9,
  totalRatings: 512,
  available: false,
  phone: "+91 91234 56789",
  certifications: ["ACE-CPT", "Functional Movement Specialist"],
  avatar: null,
  ratingBreakdown: { 5: 455, 4: 42, 3: 10, 2: 3, 1: 2 },
  bio: "Specializes in fat loss and functional fitness with customized workout plans for beginners and advanced members.",
  slots: {
    Today: ["05:00 PM", "06:00 PM"],
    Tomorrow: ["07:00 AM", "08:00 AM", "06:30 PM"],
    Wed: ["06:00 AM", "07:00 AM", "05:00 PM"],
  },
},
{
  id: "7",
  name: "Sayan Deb",
  specialization: "Yoga & Mobility",
  experience: "5 years experience overall",
  location: "Indiranagar, Bangalore",
  gym: "Pulse Fitness",
  fee: "₹850",
  feeLabel: "Session fee",
  rating: 4.7,
  totalRatings: 298,
  available: true,
  phone: "+91 99887 66554",
  certifications: ["RYT 500", "Prenatal Yoga Certified"],
  avatar: null,
  ratingBreakdown: { 5: 245, 4: 38, 3: 10, 2: 3, 1: 2 },
  bio: "Experienced yoga instructor focusing on flexibility, posture correction, stress management, and injury prevention.",
  slots: {
    Today: ["06:00 AM", "07:00 AM", "07:00 PM"],
    Tomorrow: ["06:30 AM", "07:30 PM"],
    Wed: ["06:00 AM", "06:45 PM"],
  },
},
{
  id: "8",
  name: "Kranti Deb",
  specialization: "Bodybuilding & Nutrition",
  experience: "10 years experience overall",
  location: "Electronic City, Bangalore",
  gym: "Pulse Fitness",
  fee: "₹1,200",
  feeLabel: "Session fee",
  rating: 5.0,
  totalRatings: 648,
  available: true,
  phone: "+91 97654 32109",
  certifications: ["ISSA Elite Trainer", "Sports Nutrition Specialist"],
  avatar: null,
  ratingBreakdown: { 5: 610, 4: 28, 3: 7, 2: 2, 1: 1 },
  bio: "Expert bodybuilding coach providing personalized workout and nutrition plans for muscle building, strength, and competition preparation.",
  slots: {
    Today: ["08:00 AM", "09:00 AM", "05:00 PM", "07:00 PM"],
    Tomorrow: ["07:00 AM", "08:00 AM", "06:00 PM"],
    Wed: ["08:00 AM", "09:00 AM", "07:00 PM"],
  },
},
];

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

// ─── STAR RATING ──────────────────────────────────────────────────────────────
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

// ─── RATING BAR ───────────────────────────────────────────────────────────────
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
      <N weight="600" style={{ fontSize: 12, color: "#555", width: 14 }}>{star}</N>
      <FontAwesome name="star" size={11} color="#FFA726" style={{ marginHorizontal: 4 }} />
      <View style={{ flex: 1, height: 7, backgroundColor: "#ECECEC", borderRadius: 4, overflow: "hidden", marginHorizontal: 6 }}>
        <View style={{ width: `${pct}%`, height: "100%", backgroundColor: pct > 60 ? "#4CAF50" : pct > 30 ? "#FFA726" : "#EF5350", borderRadius: 4 }} />
      </View>
      <N style={{ fontSize: 12, color: "#888", width: 28, textAlign: "right" }}>{count}</N>
    </View>
  );
};

// ─── RATINGS MODAL ────────────────────────────────────────────────────────────
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
            <N weight="700" style={{ fontSize: 17, color: "#111" }}>Ratings & Reviews</N>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 16 }}>
            <View style={{ alignItems: "center" }}>
              <N weight="800" style={{ fontSize: 48, color: "#111", lineHeight: 52 }}>{trainer.rating.toFixed(1)}</N>
              <StarRating rating={trainer.rating} size={16} />
              <N style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{total} ratings</N>
            </View>
            <View style={{ flex: 1 }}>
              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar key={star} star={star} count={trainer.ratingBreakdown[star]} total={total} />
              ))}
            </View>
          </View>
          <View style={{ backgroundColor: "#F5F7FA", borderRadius: 10, padding: 12 }}>
            <N style={{ fontSize: 13, color: "#444", lineHeight: 20 }}>{trainer.bio}</N>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── TRAINER DETAIL SCREEN ───────────────────────────────────────────────────
const TrainerDetailScreen = ({ trainer, onBack, onViewRatings }) => {
  const [selectedDay, setSelectedDay] = useState("Today");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const days = Object.keys(trainer.slots);
  const color = AVATAR_COLORS[parseInt(trainer.id) % AVATAR_COLORS.length];
  const initials = trainer.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const currentSlots = trainer.slots[selectedDay] || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#005b96", paddingTop: 52, paddingBottom: 20, paddingHorizontal: 18 }}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginBottom: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: color, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.4)" }}>
            <N weight="800" style={{ color: "#fff", fontSize: 26 }}>{initials}</N>
          </View>
          <View style={{ flex: 1 }}>
            <N weight="800" style={{ fontSize: 20, color: "#fff", marginBottom: 2 }}>{trainer.name}</N>
            <N weight="600" style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 4 }}>{trainer.specialization}</N>
            <N style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{trainer.experience}</N>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Stats row */}
        <View style={{ flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" }}>
          <View style={{ flex: 1, alignItems: "center", paddingVertical: 14, borderRightWidth: 1, borderRightColor: "#F0F0F0" }}>
            <TouchableOpacity onPress={() => onViewRatings(trainer)} style={{ alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <N weight="700" style={{ fontSize: 18, color: "#FFA726" }}>{trainer.rating.toFixed(1)}</N>
                <Ionicons name="chevron-forward" size={14} color="#005b96" />
              </View>
              <N style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{trainer.totalRatings} reviews</N>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "center", paddingVertical: 14, borderRightWidth: 1, borderRightColor: "#F0F0F0" }}>
            <N weight="700" style={{ fontSize: 18, color: "#111" }}>{trainer.fee}</N>
            <N style={{ fontSize: 11, color: "#888", marginTop: 2 }}>per session</N>
          </View>
          <View style={{ flex: 1, alignItems: "center", paddingVertical: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: trainer.available ? "#4CAF50" : "#9E9E9E" }} />
              <N weight="700" style={{ fontSize: 13, color: trainer.available ? "#2E7D32" : "#9E9E9E" }}>
                {trainer.available ? "Available" : "Unavailable"}
              </N>
            </View>
            <N style={{ fontSize: 11, color: "#888", marginTop: 2 }}>today</N>
          </View>
        </View>

        {/* About */}
        <View style={{ backgroundColor: "#fff", marginTop: 10, padding: 16 }}>
          <N weight="700" style={{ fontSize: 15, color: "#111", marginBottom: 8 }}>About</N>
          <N style={{ fontSize: 13, color: "#555", lineHeight: 21 }}>{trainer.bio}</N>
        </View>

        {/* Certifications */}
        <View style={{ backgroundColor: "#fff", marginTop: 10, padding: 16 }}>
          <N weight="700" style={{ fontSize: 15, color: "#111", marginBottom: 12 }}>Certifications</N>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {trainer.certifications.map((cert) => (
              <View key={cert} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EEF4FF", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 }}>
                <Ionicons name="checkmark-circle" size={15} color="#1565C0" />
                <N weight="600" style={{ fontSize: 13, color: "#1565C0" }}>{cert}</N>
              </View>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={{ backgroundColor: "#fff", marginTop: 10, padding: 16 }}>
          <N weight="700" style={{ fontSize: 15, color: "#111", marginBottom: 10 }}>Location</N>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#EEF4FF", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="location" size={18} color="#005b96" />
            </View>
            <View>
              <N weight="600" style={{ fontSize: 14, color: "#111" }}>{trainer.gym}</N>
              <N style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{trainer.location}</N>
            </View>
          </View>
        </View>

        {/* Pick a time slot */}
        <View style={{ backgroundColor: "#fff", marginTop: 10, padding: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#EEF4FF", borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <Ionicons name="home-outline" size={20} color="#005b96" />
            <View style={{ flex: 1 }}>
              <N weight="700" style={{ fontSize: 14, color: "#005b96" }}>Gym Session</N>
              <N style={{ fontSize: 12, color: "#555" }}>{trainer.gym} · {trainer.fee} fee</N>
            </View>
          </View>

          {/* Day tabs */}
          <View style={{ flexDirection: "row", marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" }}>
            {days.map((day) => {
              const daySlots = trainer.slots[day] || [];
              const isSelected = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => { setSelectedDay(day); setSelectedSlot(null); }}
                  style={{ flex: 1, alignItems: "center", paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: isSelected ? "#005b96" : "transparent" }}
                >
                  <N weight="700" style={{ fontSize: 13, color: isSelected ? "#005b96" : "#555" }}>{day}</N>
                  {daySlots.length > 0 ? (
                    <N weight="600" style={{ fontSize: 11, color: "#4CAF50", marginTop: 2 }}>{daySlots.length} slots</N>
                  ) : (
                    <N style={{ fontSize: 11, color: "#EF5350", marginTop: 2 }}>No slots</N>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Time slots */}
          {currentSlots.length > 0 ? (
            <>
              <N weight="600" style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>
                {currentSlots.some(s => parseInt(s) < 12) && currentSlots.some(s => parseInt(s) >= 12)
                  ? "Morning & Evening"
                  : currentSlots[0] && parseInt(currentSlots[0]) < 12 ? "Morning" : "Evening"
                } ({currentSlots.length} slots)
              </N>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {currentSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => setSelectedSlot(slot)}
                    style={{
                      borderWidth: 1.5,
                      borderColor: selectedSlot === slot ? "#005b96" : "#D0D8E4",
                      borderRadius: 8,
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      backgroundColor: selectedSlot === slot ? "#EEF4FF" : "#fff",
                    }}
                  >
                    <N weight="600" style={{ fontSize: 13, color: selectedSlot === slot ? "#005b96" : "#333" }}>{slot}</N>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 24 }}>
              <Ionicons name="calendar-outline" size={36} color="#ccc" />
              <N style={{ fontSize: 13, color: "#aaa", marginTop: 8 }}>No slots available for this day</N>
            </View>
          )}
        </View>

        {/* Contact */}
        <View style={{ backgroundColor: "#fff", marginTop: 10, padding: 16 }}>
          <N weight="700" style={{ fontSize: 15, color: "#111", marginBottom: 12 }}>Contact</N>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="call-outline" size={18} color="#2E7D32" />
            </View>
            <N weight="600" style={{ fontSize: 14, color: "#111" }}>{trainer.phone}</N>
          </View>
        </View>

      </ScrollView>

      {/* Book button */}
      <View style={{ backgroundColor: "#fff", padding: 16, borderTopWidth: 1, borderTopColor: "#F0F0F0" }}>
        <TouchableOpacity
          style={{
            backgroundColor: trainer.available && selectedSlot ? "#005b96" : "#B0BEC5",
            borderRadius: 12,
            paddingVertical: 15,
            alignItems: "center",
          }}
          disabled={!trainer.available || !selectedSlot}
        >
          <N weight="800" style={{ fontSize: 16, color: "#fff" }}>
            {!trainer.available ? "Not Available" : !selectedSlot ? "Select a Time Slot" : `Book ${selectedSlot} Session`}
          </N>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── TRAINER CARD ────────────────────────────────────────────────────────────
const TrainerCard = ({ trainer, onPress, onViewRatings }) => {
  const initials = trainer.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[parseInt(trainer.id) % AVATAR_COLORS.length];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(trainer)}
      style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E8ECF0", marginBottom: 14, overflow: "hidden" }}
    >
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", gap: 14 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: color, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#E8ECF0" }}>
            <N weight="800" style={{ color: "#fff", fontSize: 22 }}>{initials}</N>
          </View>
          <View style={{ flex: 1 }}>
            <N weight="700" style={{ fontSize: 17, color: "#111", marginBottom: 2 }}>{trainer.name}</N>
            <N weight="600" style={{ fontSize: 13, color: "#555", marginBottom: 2 }}>{trainer.specialization}</N>
            <N style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{trainer.experience}</N>
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); onViewRatings(trainer); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <StarRating rating={trainer.rating} size={13} />
              <N weight="700" style={{ fontSize: 13, color: "#FFA726" }}>{trainer.rating.toFixed(1)}</N>
              <Ionicons name="chevron-forward" size={14} color="#005b96" />
              <N style={{ fontSize: 12, color: "#005b96", textDecorationLine: "underline" }}>({trainer.totalRatings} reviews)</N>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 }} />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 }}>
          <Ionicons name="location-outline" size={14} color="#888" />
          <N style={{ fontSize: 12, color: "#666" }}>{trainer.location}</N>
          <N style={{ fontSize: 12, color: "#ccc", marginHorizontal: 4 }}>·</N>
          <N style={{ fontSize: 12, color: "#666" }}>{trainer.gym}</N>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 4 }}>
          <MaterialIcons name="currency-rupee" size={13} color="#333" />
          <N weight="700" style={{ fontSize: 14, color: "#111" }}>{trainer.fee}</N>
          <N style={{ fontSize: 12, color: "#888" }}> {trainer.feeLabel}</N>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {trainer.certifications.map((cert) => (
            <View key={cert} style={{ backgroundColor: "#EEF4FF", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
              <N weight="600" style={{ fontSize: 11, color: "#1565C0" }}>{cert}</N>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: trainer.available ? "#4CAF50" : "#9E9E9E" }} />
            <N weight="600" style={{ fontSize: 12, color: trainer.available ? "#2E7D32" : "#9E9E9E" }}>
              {trainer.available ? "Available Today" : "Not Available"}
            </N>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <N weight="600" style={{ fontSize: 12, color: "#005b96" }}>View Profile</N>
            <Ionicons name="chevron-forward" size={14} color="#005b96" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function GymTrainersScreen({ onClose }) {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold });

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [detailTrainer, setDetailTrainer]     = useState(null);
  const [ratingsModalVisible, setRatingsModalVisible] = useState(false);
  const [filter, setFilter] = useState("All");

  const FILTERS = ["All", "Available", "Strength", "Yoga", "Cardio", "Nutrition"];

  const filteredTrainers = TRAINERS.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Available") return t.available;
    if (filter === "Strength") return t.specialization.toLowerCase().includes("strength");
    if (filter === "Yoga") return t.specialization.toLowerCase().includes("yoga");
    if (filter === "Cardio") return t.specialization.toLowerCase().includes("cardio");
    if (filter === "Nutrition") return t.specialization.toLowerCase().includes("nutrition");
    return true;
  });

  if (!fontsLoaded) return null;

  // ── If a trainer is selected, show their detail screen ──
  if (detailTrainer) {
    return (
      <>
        <TrainerDetailScreen
          trainer={detailTrainer}
          onBack={() => setDetailTrainer(null)}
          onViewRatings={(trainer) => { setSelectedTrainer(trainer); setRatingsModalVisible(true); }}
        />
        <RatingsModal
          visible={ratingsModalVisible}
          onClose={() => { setRatingsModalVisible(false); setSelectedTrainer(null); }}
          trainer={selectedTrainer}
        />
      </>
    );
  }

  // ── Trainer list ──
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
            <N weight="800" style={{ fontSize: 20, color: "#fff" }}>Our Trainers</N>
            <N style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
              {TRAINERS.length} trainers at Pulse Fitness
            </N>
          </View>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, flexShrink: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: "center" }}
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
            <N weight="600" style={{ fontSize: 13, color: filter === f ? "#fff" : "#555" }}>{f}</N>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <N style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
          {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? "s" : ""} found
        </N>
        {filteredTrainers.map((trainer) => (
          <TrainerCard
            key={trainer.id}
            trainer={trainer}
            onPress={(t) => setDetailTrainer(t)}
            onViewRatings={(trainer) => { setSelectedTrainer(trainer); setRatingsModalVisible(true); }}
          />
        ))}
      </ScrollView>

      <RatingsModal
        visible={ratingsModalVisible}
        onClose={() => { setRatingsModalVisible(false); setSelectedTrainer(null); }}
        trainer={selectedTrainer}
      />
    </View>
  );
}