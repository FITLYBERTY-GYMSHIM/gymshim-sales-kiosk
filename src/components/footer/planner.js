import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import { getPlanners, createPlanner } from './api';

const { width: SCREEN_W } = Dimensions.get('window');

const LEVEL_COLORS = {
  Intermediate: '#7A7A12',
  Beginner: '#7A1212',
  Advanced: '#0B3B4A',
  'Lightly Active': '#3F6FB8',
  'Very Active': '#0B6B3A',
  'Moderate Active': '#8A4B0B',
};

const LEVEL_OPTIONS = [
  'Beginner',
  'Intermediate',
  'Lightly Active',
  'Very Active',
  'Moderate Active',
];
const MIN_LEVEL_COUNT = 2;
const MAX_LEVEL_COUNT = 4;


const MIN_DAYS = 1;
const MAX_DAYS = 7;

const TRAINER_TYPES = ['Personal Trainer', 'Private Trainer'];


const DEMO_WORKOUT_DAYS = [
  {
    id: 'day1',
    label: 'Day 1',
    workoutTitle: 'Legs Workout - DP',
    workoutSubtitle: 'Build strength and power in your lower body.',
    exercises: [
      {
        id: 'e1',
        name: 'Wide grip bench press cfc',
        duration: '0 hr 20 min',
        category: 'Main Exercise',
        videoId: 'lTu5YGNA7yY',
        sets: [{ label: 'Set 1', reps: '15 Reps', weight: '6 Kg' }],
        tip: 'Keep your back flat on the bench and control the movement for better results and safety.',
      },
      {
        id: 'e2',
        name: 'Tarps Up Right Row Barbbell Arrow Gym',
        duration: '0 hr 20 min',
        category: 'Main Exercise',
        videoId: 'DgyslsszCQ0',
        sets: [{ label: 'Set 1', reps: '12 Reps', weight: '8 Kg' }],
        tip: 'Keep your core tight and pull with your back, not your arms.',
      },
    ],
  },
  { id: 'day2', label: 'Day 2', workoutTitle: 'Back Workout', workoutSubtitle: 'Strengthen your back muscles.', exercises: [] },
  { id: 'day3', label: 'Day 3', workoutTitle: 'Chest Workout', workoutSubtitle: 'Build a stronger chest.', exercises: [] },
  { id: 'day4', label: 'Day 4', workoutTitle: 'Shoulder Workout', workoutSubtitle: 'Sculpt your shoulders.', exercises: [] },
  { id: 'day5', label: 'Day 5', workoutTitle: 'Arms Workout', workoutSubtitle: 'Build stronger arms.', exercises: [] },
  { id: 'day6', label: 'Day 6', workoutTitle: 'Core Workout', workoutSubtitle: 'Strengthen your core.', exercises: [] },
];


function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function buildDaysFromPlanner(planner) {
  const dayPlans =
    planner.dayPlans && planner.dayPlans.length > 0
      ? planner.dayPlans
      : [
          {
            title: planner.plannerName,
            videoLinks: planner.videoLinks || [],
            sets: planner.sets || 1,
            reps: planner.reps || 10,
            weightKg: planner.weightKg || '-',
          },
        ];

  return dayPlans.map((dayPlan, dayIdx) => {
    const numSets = dayPlan.sets && dayPlan.sets > 0 ? dayPlan.sets : 1;
    const repsLabel = dayPlan.reps ? `${dayPlan.reps} Reps` : '10 Reps';
    const weightLabel =
      dayPlan.weightKg && dayPlan.weightKg !== '-' ? `${dayPlan.weightKg} Kg` : '-';

    const setList = Array.from({ length: numSets }, (_, i) => ({
      label: `Set ${i + 1}`,
      reps: repsLabel,
      weight: weightLabel,
    }));

    const exercises = (dayPlan.videoLinks || [])
      .map((link, index) => {
        const videoId = extractYouTubeId(link);
        if (!videoId) return null;
        return {
          id: `${planner.id}-d${dayIdx}-v${index}`,
          name: `Video ${index + 1}`,
          duration: '0 hr 10 min',
          category: 'Custom Exercise',
          videoId,
          sets: setList,
          tip: 'Follow along with the video and keep your form controlled throughout.',
        };
      })
      .filter(Boolean);

    return {
      id: `day${dayIdx + 1}`,
      label: `Day ${dayIdx + 1}`,
      workoutTitle: dayPlan.title || `${planner.plannerName} - Day ${dayIdx + 1}`,
      workoutSubtitle: `Day ${dayIdx + 1} of ${dayPlans.length} in ${planner.plannerName}.`,
      exercises,
    };
  });
}

function VideoEmbed({ videoId }) {
  const src = `https://www.youtube.com/embed/${videoId}`;

  if (Platform.OS === 'web') {
    return (
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return <WebView style={{ flex: 1 }} source={{ uri: src }} allowsFullscreenVideo />;
}

function PlannerCard({ planner, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      {/* Wavy teal header */}
      <View style={styles.cardHeader}>
        <Svg
          style={StyleSheet.absoluteFill}
          width="100%"
          height="100%"
          viewBox="0 0 372 120"
          preserveAspectRatio="none"
        >
          <Path
            d="M178 69.1616C116.35 70.0476 33 95.2894 -1 110V0H373C361 35.5 398 66 178 69.1616Z"
            fill="#055075"
          />
        </Svg>

        <View style={styles.cardHeaderContent}>
          <View>
            <Text style={styles.plannerName}>{planner.plannerName}</Text>
            <Text style={styles.plannerDays}>{planner.days} Days Workout</Text>
          </View>
          <Ionicons
            name="barbell-outline"
            size={20}
            color="#fff"
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </View>
      </View>

      {/* Level badges */}
      <View style={styles.badgeRow}>
        {planner.levels.map((level) => (
          <View
            key={level}
            style={[
              styles.badge,
              { backgroundColor: LEVEL_COLORS[level] || '#555' },
            ]}
          >
            <Text style={styles.badgeText}>{level}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Trainer row */}
      <View style={styles.trainerRow}>
        <Image source={{ uri: planner.trainerAvatar }} style={styles.trainerAvatar} />
        <View>
          <Text style={styles.trainerName}>{planner.trainerName}</Text>
          <Text style={styles.trainerRole}>{planner.trainerType || 'Personal Trainer'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}


function WorkoutPlannerModal({ visible, onClose, days }) {
  const [dayIndex, setDayIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);

  
  useEffect(() => {
    if (visible) {
      setDayIndex(0);
      setExerciseIndex(0);
      setSetIndex(0);
    }
  }, [visible, days]);

  if (!days || days.length === 0) return null;

  const day = days[dayIndex];
  const exercise = day.exercises[exerciseIndex];
  const activeSet = exercise ? exercise.sets[setIndex] : null;

  const selectDay = (index) => {
    setDayIndex(index);
    setExerciseIndex(0);
    setSetIndex(0);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Day Workout Planner</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseIcon}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Day tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayTabsRow}
          >
            {days.map((d, index) => {
              const active = index === dayIndex;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.dayTab, active && styles.dayTabActive]}
                  onPress={() => selectDay(index)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={active ? '#fff' : '#0B3B4A'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.dayTabText, active && styles.dayTabTextActive]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Body: left exercise list + right details */}
          <View style={styles.modalBody}>
            {/* Left panel */}
            <View style={styles.leftPanel}>
              <View style={styles.workoutHeaderBox}>
                <View style={styles.workoutIconWrap}>
                  <Ionicons name="body-outline" size={24} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.workoutTitle}>{day.workoutTitle}</Text>
                  <Text style={styles.workoutSubtitle}>{day.workoutSubtitle}</Text>
                </View>
              </View>

              <ScrollView style={styles.exerciseList}>
                {day.exercises.length === 0 ? (
                  <Text style={styles.emptyText}>No exercises added for this day yet.</Text>
                ) : (
                  day.exercises.map((ex, index) => {
                    const active = index === exerciseIndex;
                    return (
                      <TouchableOpacity
                        key={ex.id}
                        style={[styles.exerciseRow, active && styles.exerciseRowActive]}
                        activeOpacity={0.8}
                        onPress={() => {
                          setExerciseIndex(index);
                          setSetIndex(0);
                        }}
                      >
                        <View
                          style={[
                            styles.exerciseIconWrap,
                            { backgroundColor: active ? '#0B4A63' : '#E9E9E9' },
                          ]}
                        >
                          <Ionicons
                            name="videocam"
                            size={16}
                            color={active ? '#fff' : '#8A8A8A'}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.exerciseName}>{ex.name}</Text>
                          <View style={styles.exerciseDurationRow}>
                            <Ionicons name="time-outline" size={12} color="#8A8A8A" />
                            <Text style={styles.exerciseDuration}>{ex.duration}</Text>
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>

            {/* Right panel */}
            <ScrollView style={styles.rightPanel} contentContainerStyle={{ paddingBottom: 20 }}>
              {exercise ? (
                <>
                  <View style={styles.videoWrap}>
                    <VideoEmbed videoId={exercise.videoId} />
                  </View>

                  <View style={styles.exerciseTitleRow}>
                    <View>
                      <Text style={styles.exerciseDetailName}>{exercise.name}</Text>
                      <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                    </View>
                    <TouchableOpacity style={styles.bookmarkButton}>
                      <Ionicons name="bookmark-outline" size={18} color="#0B4A63" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.paramsHeaderRow}>
                    <Ionicons name="document-text-outline" size={16} color="#0B4A63" />
                    <Text style={styles.paramsHeaderText}>Exercise Parameters</Text>
                  </View>

                  <View style={styles.pillsRow}>
                    {exercise.sets.map((set, index) => {
                      const active = index === setIndex;
                      return (
                        <TouchableOpacity
                          key={set.label}
                          style={[styles.setPill, active && styles.setPillActive]}
                          onPress={() => setSetIndex(index)}
                        >
                          <Text style={[styles.setPillText, active && styles.setPillTextActive]}>
                            {set.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <View style={styles.infoPill}>
                      <Ionicons name="repeat-outline" size={14} color="#0B4A63" />
                      <Text style={styles.infoPillText}>{activeSet.reps}</Text>
                    </View>
                    <View style={styles.infoPill}>
                      <Ionicons name="barbell-outline" size={14} color="#0B4A63" />
                      <Text style={styles.infoPillText}>{activeSet.weight}</Text>
                    </View>
                  </View>

                  <View style={styles.tipBox}>
                    <View style={styles.tipHeaderRow}>
                      <Ionicons name="bulb-outline" size={16} color="#0B4A63" />
                      <Text style={styles.tipHeaderText}>Tip</Text>
                    </View>
                    <Text style={styles.tipText}>{exercise.tip}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>
                  No video links were added for this planner yet.
                </Text>
              )}
            </ScrollView>
          </View>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Blank day-plan record used to seed/grow the per-day form sections.
function makeEmptyDayPlan() {
  return { title: '', videoLinks: [''], sets: '', reps: '', weightKg: '' };
}


function AddPlannerModal({ visible, onClose, onCreated }) {
  const [trainerName, setTrainerName] = useState('');
  const [trainerType, setTrainerType] = useState('Personal Trainer');
  const [plannerName, setPlannerName] = useState('');
  const [days, setDays] = useState('');
  const [dayPlans, setDayPlans] = useState([makeEmptyDayPlan()]);
  const [photoUri, setPhotoUri] = useState(null);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTrainerName('');
    setTrainerType('Personal Trainer');
    setPlannerName('');
    setDays('');
    setDayPlans([makeEmptyDayPlan()]);
    setPhotoUri(null);
    setSelectedLevels([]);
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission needed', 'Please allow camera access to add a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  
  const updateDaysCount = (text) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    if (digitsOnly === '') {
      setDays('');
      return;
    }
    const parsed = parseInt(digitsOnly, 10);
    const clamped = Math.min(Math.max(parsed, MIN_DAYS), MAX_DAYS);
    setDays(String(clamped));
    setDayPlans((prev) => {
      if (clamped === prev.length) return prev;
      if (clamped < prev.length) return prev.slice(0, clamped);
      return [...prev, ...Array.from({ length: clamped - prev.length }, makeEmptyDayPlan)];
    });
  };

  const updateDayField = (dayIdx, field, value) => {
    setDayPlans((prev) => prev.map((d, i) => (i === dayIdx ? { ...d, [field]: value } : d)));
  };

  const updateDayVideoLink = (dayIdx, linkIdx, text) => {
    setDayPlans((prev) =>
      prev.map((d, i) => {
        if (i !== dayIdx) return d;
        return { ...d, videoLinks: d.videoLinks.map((v, j) => (j === linkIdx ? text : v)) };
      })
    );
  };

  const addDayVideoLink = (dayIdx) => {
    setDayPlans((prev) =>
      prev.map((d, i) => (i === dayIdx ? { ...d, videoLinks: [...d.videoLinks, ''] } : d))
    );
  };

  const removeDayVideoLink = (dayIdx, linkIdx) => {
    setDayPlans((prev) =>
      prev.map((d, i) => {
        if (i !== dayIdx) return d;
        return { ...d, videoLinks: d.videoLinks.filter((_, j) => j !== linkIdx) };
      })
    );
  };

  // Toggle a level chip on/off. Blocks a 5th selection instead of
  // silently bumping the oldest one, so the user notices the max limit.
  const toggleLevel = (level) => {
    setSelectedLevels((prev) => {
      if (prev.includes(level)) {
        return prev.filter((l) => l !== level);
      }
      if (prev.length >= MAX_LEVEL_COUNT) {
        Alert.alert(
          'Maximum reached',
          `You can select up to ${MAX_LEVEL_COUNT} exercise levels. Deselect one first.`
        );
        return prev;
      }
      return [...prev, level];
    });
  };

  const handleSubmit = async () => {
    if (!trainerName.trim() || !plannerName.trim()) {
      Alert.alert('Missing info', 'Please fill in at least Name and Planner Name.');
      return;
    }

    if (selectedLevels.length < MIN_LEVEL_COUNT || selectedLevels.length > MAX_LEVEL_COUNT) {
      Alert.alert(
        'Select exercise level',
        `Please select between ${MIN_LEVEL_COUNT} and ${MAX_LEVEL_COUNT} exercise levels.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const dayPlansPayload = dayPlans.map((d, idx) => ({
        title: d.title.trim() || `Day ${idx + 1}`,
        videoLinks: d.videoLinks.map((v) => v.trim()).filter(Boolean),
        sets: parseInt(d.sets, 10) || 1,
        reps: parseInt(d.reps, 10) || 10,
        weightKg: d.weightKg.trim() || '-',
      }));

      const payload = {
        trainerName: trainerName.trim(),
        trainerType,
        plannerName: plannerName.trim(),
        days: dayPlansPayload.length,
        photoUri,
        levels: selectedLevels,
        dayPlans: dayPlansPayload,
      };
      const created = await createPlanner(payload); // <-- dummy API call
      onCreated(created);
      resetForm();
      onClose();
    } catch (err) {
      Alert.alert('Something went wrong', err.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.formOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderTitle}>Add Workout Planner</Text>
            <TouchableOpacity onPress={handleClose} style={styles.modalCloseIcon}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.formBody}>
            <Text style={styles.formLabel}>Your Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. John Doe"
              value={trainerName}
              onChangeText={setTrainerName}
            />

            <Text style={styles.formLabel}>Trainer Type</Text>
            <View style={styles.trainerTypeRow}>
              {TRAINER_TYPES.map((type) => {
                const active = trainerType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.trainerTypeOption, active && styles.trainerTypeOptionActive]}
                    onPress={() => setTrainerType(type)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.trainerTypeText,
                        active && styles.trainerTypeTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.formLabel}>Planner Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Fat Loss Program"
              value={plannerName}
              onChangeText={setPlannerName}
            />

            <Text style={styles.formLabel}>Workout Days (max {MAX_DAYS})</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. 6"
              keyboardType="numeric"
              value={days}
              onChangeText={updateDaysCount}
            />
            <Text style={styles.daysHintText}>
              {dayPlans.length} day{dayPlans.length > 1 ? 's' : ''} of details requested below.
            </Text>

            <Text style={styles.formLabel}>
              Exercise Level (pick {MIN_LEVEL_COUNT}-{MAX_LEVEL_COUNT}) — {selectedLevels.length}/
              {MAX_LEVEL_COUNT} selected
            </Text>
            <View style={styles.levelOptionsWrap}>
              {LEVEL_OPTIONS.map((level) => {
                const active = selectedLevels.includes(level);
                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelOption,
                      active && {
                        backgroundColor: LEVEL_COLORS[level],
                        borderColor: LEVEL_COLORS[level],
                      },
                    ]}
                    onPress={() => toggleLevel(level)}
                    activeOpacity={0.8}
                  >
                    {active && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#fff"
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text style={[styles.levelOptionText, active && styles.levelOptionTextActive]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.formLabel}>Photo</Text>
            <TouchableOpacity style={styles.photoPicker} onPress={handlePickPhoto}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPickerPlaceholder}>
                  <Ionicons name="camera-outline" size={22} color="#0B4A63" />
                  <Text style={styles.photoPickerText}>Take Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.formLabel}>Day Details</Text>
            {dayPlans.map((dayPlan, dayIdx) => (
              <View key={dayIdx} style={styles.dayPlanCard}>
                <View style={styles.dayPlanHeaderRow}>
                  <View style={styles.dayPlanBadge}>
                    <Text style={styles.dayPlanBadgeText}>{dayIdx + 1}</Text>
                  </View>
                  <Text style={styles.dayPlanHeaderText}>Day {dayIdx + 1} Details</Text>
                </View>

                <Text style={styles.subFieldLabel}>Day Title</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={`e.g. Legs Workout - Day ${dayIdx + 1}`}
                  value={dayPlan.title}
                  onChangeText={(text) => updateDayField(dayIdx, 'title', text)}
                />

                <Text style={styles.subFieldLabel}>Video Links</Text>
                {dayPlan.videoLinks.map((link, linkIdx) => (
                  <View key={linkIdx} style={styles.videoLinkRow}>
                    <TextInput
                      style={[styles.formInput, { flex: 1, marginBottom: 0 }]}
                      placeholder="https://youtube.com/watch?v=..."
                      autoCapitalize="none"
                      value={link}
                      onChangeText={(text) => updateDayVideoLink(dayIdx, linkIdx, text)}
                    />
                    {dayPlan.videoLinks.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeLinkButton}
                        onPress={() => removeDayVideoLink(dayIdx, linkIdx)}
                      >
                        <Ionicons name="close-circle" size={22} color="#B0413E" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addLinkButton}
                  onPress={() => addDayVideoLink(dayIdx)}
                >
                  <Ionicons name="add-circle-outline" size={18} color="#0B4A63" />
                  <Text style={styles.addLinkText}>Add another video link</Text>
                </TouchableOpacity>

                <Text style={styles.subFieldLabel}>Exercise Parameters</Text>
                <View style={styles.paramsRow}>
                  <View style={styles.paramInputWrap}>
                    <Text style={styles.paramInputLabel}>No. of Sets</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g. 3"
                      keyboardType="numeric"
                      value={dayPlan.sets}
                      onChangeText={(text) => updateDayField(dayIdx, 'sets', text)}
                    />
                  </View>
                  <View style={styles.paramInputWrap}>
                    <Text style={styles.paramInputLabel}>No. of Reps</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g. 12"
                      keyboardType="numeric"
                      value={dayPlan.reps}
                      onChangeText={(text) => updateDayField(dayIdx, 'reps', text)}
                    />
                  </View>
                  <View style={styles.paramInputWrap}>
                    <Text style={styles.paramInputLabel}>Weight (Kg)</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g. 10"
                      keyboardType="numeric"
                      value={dayPlan.weightKg}
                      onChangeText={(text) => updateDayField(dayIdx, 'weightKg', text)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.formFooter}>
            <TouchableOpacity
              style={[styles.submitButton, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Save Planner</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function PlannerScreen() {
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [selectedPlanner, setSelectedPlanner] = useState(null);

  // "Test" the dummy API on screen load — fetches the seed planner list
  useEffect(() => {
    (async () => {
      try {
        const data = await getPlanners();
        setPlanners(data);
      } catch (err) {
        Alert.alert('Failed to load planners', err.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCardPress = (planner) => {
    setSelectedPlanner(planner);
    setModalVisible(true);
  };

  const handleCreated = (newPlanner) => {
    setPlanners((prev) => [...prev, newPlanner]);
  };

  const selectedDays = selectedPlanner
    ? selectedPlanner.id === '1'
      ? DEMO_WORKOUT_DAYS
      : buildDaysFromPlanner(selectedPlanner)
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>WELCOME TO OUR</Text>
          <Text style={styles.titleText}>Workout Planner</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color="#0B4A63" />
        ) : (
          <View style={styles.plannerGrid}>
            {planners.map((planner) => (
              <PlannerCard
                key={planner.id}
                planner={planner}
                onPress={() => handleCardPress(planner)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating "+" button to add a new planner */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddFormVisible(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <WorkoutPlannerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        days={selectedDays}
      />

      <AddPlannerModal
        visible={addFormVisible}
        onClose={() => setAddFormVisible(false)}
        onCreated={handleCreated}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: '#3F6FB8',
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 26,
    fontFamily: 'Nunito-ExtraBold',
    color: '#11202B',
  },

  plannerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  card: {
    width: '45%',
    minWidth: 220,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHeader: {
    height: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  plannerName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 2,
  },
  plannerDays: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
  },

  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: -10,
    paddingBottom: 14,
  },
  badge: {
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },

  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  trainerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D9D9D9',
  },
  trainerName: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
    color: '#11202B',
  },
  trainerRole: {
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#7A7A7A',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0B4A63',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  // ---------------- Detail Modal ----------------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  modalContainer: {
    width: Math.min(SCREEN_W - 24, 960),
    maxHeight: '92%',
    backgroundColor: '#F4F6F8',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#0B2A4A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  modalCloseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dayTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayTabActive: {
    backgroundColor: '#0B6FB8',
    borderColor: '#0B6FB8',
  },
  dayTabText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#0B3B4A',
  },
  dayTabTextActive: {
    color: '#fff',
  },

  modalBody: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    flexShrink: 1,
  },
  leftPanel: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  workoutHeaderBox: {
    backgroundColor: '#0B3B5C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  workoutIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginBottom: 2,
  },
  workoutSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
  },
  exerciseList: {
    padding: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  exerciseRowActive: {
    backgroundColor: '#E8F1FB',
    borderLeftWidth: 3,
    borderLeftColor: '#0B6FB8',
  },
  exerciseIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#11202B',
    marginBottom: 2,
  },
  exerciseDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseDuration: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#8A8A8A',
  },
  emptyText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#8A8A8A',
    padding: 14,
    textAlign: 'center',
  },

  rightPanel: {
    flex: 1,
  },
  videoWrap: {
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: 4,
  },
  exerciseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  exerciseDetailName: {
    fontSize: 17,
    fontFamily: 'Nunito-ExtraBold',
    color: '#11202B',
    marginBottom: 2,
  },
  exerciseCategory: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#8A8A8A',
  },
  bookmarkButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8F1FB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paramsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 10,
  },
  paramsHeaderText: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
    color: '#0B3B4A',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  setPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  setPillActive: {
    backgroundColor: '#0B3B5C',
    borderColor: '#0B3B5C',
  },
  setPillText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#0B3B4A',
  },
  setPillTextActive: {
    color: '#fff',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoPillText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#0B3B4A',
  },

  tipBox: {
    marginTop: 16,
    backgroundColor: '#E8F1FB',
    borderRadius: 12,
    padding: 14,
  },
  tipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  tipHeaderText: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
    color: '#0B3B4A',
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#4A5A66',
    lineHeight: 18,
  },

  modalFooter: {
    alignItems: 'flex-end',
    padding: 16,
  },
  closeButton: {
    backgroundColor: '#0B2A4A',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },

  // ---------------- Add Planner form ----------------
  formOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  formHeader: {
    backgroundColor: '#0B2A4A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formHeaderTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  formBody: {
    padding: 20,
  },
  formLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#0B3B4A',
    marginBottom: 6,
    marginTop: 14,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#11202B',
    marginBottom: 4,
  },
  daysHintText: {
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#8A8A8A',
    marginTop: 2,
  },
  levelOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  levelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#fff',
  },
  levelOptionText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#0B3B4A',
  },
  levelOptionTextActive: {
    color: '#fff',
  },
  photoPicker: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    overflow: 'hidden',
  },
  photoPickerPlaceholder: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoPickerText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#0B4A63',
  },
  photoPreview: {
    width: '100%',
    height: 140,
  },

  dayPlanCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
  },
  dayPlanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dayPlanBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0B4A63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPlanBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
  dayPlanHeaderText: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
    color: '#0B3B4A',
  },
  subFieldLabel: {
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
    color: '#7A7A7A',
    marginTop: 10,
    marginBottom: 6,
  },

  videoLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  removeLinkButton: {
    padding: 2,
  },
  addLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  addLinkText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#0B4A63',
  },

  trainerTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  trainerTypeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
    alignItems: 'center',
  },
  trainerTypeOptionActive: {
    backgroundColor: '#0B4A63',
    borderColor: '#0B4A63',
  },
  trainerTypeText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#0B3B4A',
  },
  trainerTypeTextActive: {
    color: '#fff',
  },

  paramsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  paramInputWrap: {
    flex: 1,
  },
  paramInputLabel: {
    fontSize: 10,
    fontFamily: 'Nunito-SemiBold',
    color: '#7A7A7A',
    marginBottom: 4,
  },

  formFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  submitButton: {
    backgroundColor: '#0B4A63',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
});