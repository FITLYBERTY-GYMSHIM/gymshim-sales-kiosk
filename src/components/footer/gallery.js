import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  SafeAreaView,
  Dimensions,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ----------------------------------------------------------------
// Sample gallery data — swap image URIs / titles / subtitles as needed.
// Each item has its own explicit width & height for the card image,
// plus a `photos` array that will hold that album's individual photos.
// ----------------------------------------------------------------
const GALLERY_ITEMS = [
  {
    id: '1',
    title: 'Part1',
    subtitle: 'We got the top class amenities, click to check out',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
    width: 550,
    height: 566,
    // Photos belonging to this album. Empty for now — add objects like
    // { id: 'p1', uri: 'https://...' } here as photos get uploaded, and
    // the album screen will render them automatically instead of
    // placeholders.
    photos: [],
  },
  {
    id: '2',
    title: 'Part2',
    subtitle: 'We got the top class amenities',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7',
    width: 395,
    height: 566,
    photos: [],
  },
  {
    id: '3',
    title: 'Part3',
    subtitle: 'pp',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    width: 374,
    height: 528,
    photos: [],
  },
  {
    id: '4',
    title: 'Part4',
    subtitle: 'We got the top class amenities',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
    width: 570,
    height: 528,
    photos: [],
  },
];

// Dropdown menu options shown when the + button is opened.
// id matches the GALLERY_ITEMS id so we know which part's photos array
// to push the captured photo into.
const FAB_OPTIONS = [
  { id: '1', label: 'Part1' },
  { id: '2', label: 'Part2' },
  { id: '3', label: 'Part3' },
  { id: '4', label: 'Part4' },
];

// ==================================================================
// SCREEN 1 — Grid of parts/albums
// ==================================================================
function GalleryGrid({ items, onSelectItem, onCapturePhoto }) {
  const [fabOpen, setFabOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const toggleFab = () => {
    const toValue = fabOpen ? 0 : 1;
    Animated.parallel([
      Animated.timing(rotateAnim, { toValue, duration: 250, useNativeDriver: true }),
      Animated.timing(colorAnim, { toValue, duration: 250, useNativeDriver: false }),
    ]).start();
    setFabOpen(!fabOpen);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const backgroundColorInterpolate = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#5B5B5B', '#E63946'],
  });

  const handlePhotoPress = (item) => {
    onSelectItem(item);
  };

  const closeFab = () => {
    setFabOpen(false);
    Animated.parallel([
      Animated.timing(rotateAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(colorAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  // Tapping a part in the dropdown (e.g. "Part1") opens the camera.
  // Whatever gets captured is pushed straight into that part's photo grid.
  const handleOptionPress = async (option) => {
    closeFab();

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Camera permission needed',
        'Please allow camera access to take a photo for this part.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      onCapturePhoto(option.id, uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Svg
        width={SCREEN_W}
        height={SCREEN_H}
        viewBox="0 0 834 1119"
        style={styles.bgSvg}
        preserveAspectRatio="xMidYMid slice"
      >
        <Path
          d="M397 680.634C244.982 756.027 39.4267 727.909 0 882.839V1126H834V0C821.585 33.4369 742.338 100.627 736.356 183.29C722 381.669 653.552 553.398 397 680.634Z"
          fill="#003609"
        />
      </Svg>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>WELCOME TO OUR</Text>
            <Text style={styles.titleText}>Image Gallery</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { width: item.width, height: item.height }]}
              activeOpacity={0.85}
              onPress={() => handlePhotoPress(item)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.fabContainer} pointerEvents="box-none">
        {fabOpen && (
          <View style={styles.dropdown}>
            {FAB_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.dropdownItem}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.dropdownText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity activeOpacity={0.8} onPress={toggleFab}>
          <Animated.View
            style={[
              styles.fab,
              {
                backgroundColor: backgroundColorInterpolate,
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          >
            <Text style={styles.fabIcon}>+</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==================================================================
// SCREEN 2 — Album view (hero image + grid of that part's photos)
// ==================================================================
const COLUMNS = 5;
const GRID_PADDING = 16;
const GRID_GAP = 8;
const CELL_SIZE = (SCREEN_W - GRID_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS;
const PLACEHOLDER_COUNT = 20; // visual placeholders until real photos exist

function AlbumGallery({ item, onBack, onGoHome, onSelectPhoto }) {
  const photos = item.photos || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={onBack}>
          <Ionicons name="arrow-back" size={16} color="#0B3B4A" style={{ marginRight: 6 }} />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} activeOpacity={0.8} onPress={onGoHome}>
          <Ionicons name="home" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Image source={{ uri: item.image }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <Text style={styles.heroTitle}>{item.title}</Text>
        </View>

        <View style={styles.albumGrid}>
          {photos.length > 0
            ? photos.map((photo, index) => (
                <TouchableOpacity
                  key={photo.id || index}
                  style={styles.cell}
                  activeOpacity={0.8}
                  onPress={() => onSelectPhoto(photos, index)}
                >
                  <Image source={{ uri: photo.uri }} style={styles.cellImage} />
                </TouchableOpacity>
              ))
            : Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
                <View key={`placeholder-${index}`} style={styles.cellPlaceholder} />
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================================================================
// SCREEN 3 — Full-screen photo viewer
// ==================================================================
function PhotoViewer({ photos, initialIndex, title, onClose }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const onScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setActiveIndex(index);
  };

  return (
    <View style={styles.viewerContainer}>
      <StatusBar hidden />

      <FlatList
        data={photos}
        keyExtractor={(p, index) => p.id || String(index)}
        horizontal
        pagingEnabled
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={styles.viewerPage}>
            <Image source={{ uri: item.uri }} style={styles.fullImage} resizeMode="contain" />
          </View>
        )}
      />

      <TouchableOpacity style={styles.closeButton} activeOpacity={0.8} onPress={onClose}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.viewerFooter}>
        {title ? <Text style={styles.viewerFooterTitle}>{title}</Text> : null}
        <Text style={styles.viewerFooterCounter}>
          {activeIndex + 1} / {photos.length}
        </Text>
      </View>
    </View>
  );
}

// ==================================================================
// CONTAINER — decides which of the 3 screens above to show
// ==================================================================
export default function GalleryScreen() {
  // screen: 'grid' | 'album' | 'viewer'
  const [screen, setScreen] = useState('grid');
  // GALLERY_ITEMS lives in state now (not a plain constant) so that
  // captured photos actually persist and re-render the grid/album.
  const [items, setItems] = useState(GALLERY_ITEMS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewerPhotos, setViewerPhotos] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Called after a camera capture — pushes the new photo into the
  // matching part's `photos` array, then opens that part's album page
  // so the user immediately sees the photo they just added.
  const handleCapturePhoto = (partId, uri) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === partId
          ? {
              ...item,
              photos: [...item.photos, { id: Date.now().toString(), uri }],
            }
          : item
      );

      const updatedItem = updatedItems.find((item) => item.id === partId);
      if (updatedItem) {
        setSelectedItem(updatedItem);
        setScreen('album');
      }

      return updatedItems;
    });
  };

  if (screen === 'album' && selectedItem) {
    return (
      <AlbumGallery
        item={selectedItem}
        onBack={() => setScreen('grid')}
        onGoHome={() => setScreen('grid')}
        onSelectPhoto={(photos, index) => {
          setViewerPhotos(photos);
          setViewerIndex(index);
          setScreen('viewer');
        }}
      />
    );
  }

  if (screen === 'viewer') {
    return (
      <PhotoViewer
        photos={viewerPhotos}
        initialIndex={viewerIndex}
        title={selectedItem ? selectedItem.title : ''}
        onClose={() => setScreen('album')}
      />
    );
  }

  return (
    <GalleryGrid
      items={items}
      onSelectItem={(item) => {
        setSelectedItem(item);
        setScreen('album');
      }}
      onCapturePhoto={handleCapturePhoto}
    />
  );
}

const styles = StyleSheet.create({
  // ---------- shared / grid screen ----------
  safeArea: {
    flex: 1,
    backgroundColor: '#E4FFE8',
  },
  bgSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: 'transparent',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
    padding: 8,
  },
  card: {
    margin: '1.5%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cardTextWrap: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 35,
    fontFamily: 'Nunito-ExtraBold',
  },
  cardSubtitle: {
    color: '#eee',
    fontSize: 15,
    marginTop: 2,
    fontFamily: 'Nunito-Regular',
  },
  fabContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 28,
  },
  dropdown: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    width: 170,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 14,
    color: '#11202B',
    fontFamily: 'Nunito-SemiBold',
  },

  // ---------- album screen ----------
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CFE3D8',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backText: {
    color: '#0B3B4A',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    letterSpacing: 0.5,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0B3B4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 34,
    fontFamily: 'Nunito-ExtraBold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  albumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    paddingTop: 20,
    gap: GRID_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#D9D9D9',
  },
  cellImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cellPlaceholder: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
    backgroundColor: '#D9D9D9',
  },

  // ---------- full-screen viewer ----------
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewerPage: {
    width: SCREEN_W,
    height: SCREEN_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerFooter: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  viewerFooterTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-ExtraBold',
    marginBottom: 4,
  },
  viewerFooterCounter: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
  },
});