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
  useWindowDimensions,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const GALLERY_ITEMS = [
  {
    id: '1',
    title: 'Part1',
    subtitle: 'We got the top class amenities, click to check out',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
    row: 0,
    flex: 550,
    aspect: 566 / 550,
    photos: [],
  },
  {
    id: '2',
    title: 'Part2',
    subtitle: 'We got the top class amenities',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7',
    row: 0,
    flex: 395,
    aspect: 566 / 395,
    photos: [],
  },
  {
    id: '3',
    title: 'Part3',
    subtitle: 'pp',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    row: 1,
    flex: 374,
    aspect: 528 / 374,
    photos: [],
  },
  {
    id: '4',
    title: 'Part4',
    subtitle: 'We got the top class amenities',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
    row: 1,
    flex: 570,
    aspect: 528 / 570,
    photos: [],
  },
];

const FAB_OPTIONS = [
  { id: '1', label: 'Part1' },
  { id: '2', label: 'Part2' },
  { id: '3', label: 'Part3' },
  { id: '4', label: 'Part4' },
];

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);


const TABLET_MIN = 768;
const LARGE_TABLET_MIN = 900;

const GRID_H_PADDING = 16;
const GRID_GAP = 10;

function groupIntoRows(items) {
  const rows = [];
  items.forEach((item) => {
    if (!rows[item.row]) rows[item.row] = [];
    rows[item.row].push(item);
  });
  return rows;
}

function GalleryGrid({ items, onSelectItem, onCapturePhoto }) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const isTablet = SCREEN_W >= TABLET_MIN;
  const isLargeTablet = SCREEN_W >= LARGE_TABLET_MIN;
  const scaleFactor = isTablet
    ? clamp(SCREEN_W / 1024, 0.78, 1.05)
    : clamp(SCREEN_W / 375, 0.85, 1.12);
  const f = (size) => Math.round(size * scaleFactor);

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


  const gridContentWidth = SCREEN_W - GRID_H_PADDING * 2;
  const rows = groupIntoRows(items);

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
        <View style={[styles.header, { paddingHorizontal: isTablet ? 28 : 20 }]}>
          <View>
            <Text style={[styles.welcomeText, { fontSize: f(12) }]}>WELCOME TO OUR</Text>
            <Text style={[styles.titleText, { fontSize: f(26) }]}>Image Gallery</Text>
          </View>
        </View>

        <View style={[styles.grid, { paddingHorizontal: GRID_H_PADDING - 8 }]}>
          {rows.map((rowItems, rowIndex) => {
            const rowTotalFlex = rowItems.reduce((sum, it) => sum + it.flex, 0);
            const availableRowWidth = gridContentWidth - GRID_GAP * (rowItems.length - 1);

            return (
              <View key={rowIndex} style={styles.gridRow}>
                {rowItems.map((item, idx) => {
                  const cardWidth = availableRowWidth * (item.flex / rowTotalFlex);
                  const cardHeight = clamp(cardWidth * item.aspect, 140, SCREEN_H * 0.55);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.card,
                        {
                          width: cardWidth,
                          height: cardHeight,
                          marginRight: idx < rowItems.length - 1 ? GRID_GAP : 0,
                        },
                      ]}
                      activeOpacity={0.85}
                      onPress={() => handlePhotoPress(item)}
                    >
                      <Image source={{ uri: item.image }} style={styles.cardImage} />
                      <View style={styles.cardOverlay} />
                      <View style={styles.cardTextWrap}>
                        <Text style={[styles.cardTitle, { fontSize: f(28) }]}>{item.title}</Text>
                        <Text
                          style={[styles.cardSubtitle, { fontSize: f(13) }]}
                          numberOfLines={2}
                        >
                          {item.subtitle}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
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


const PLACEHOLDER_COUNT = 20; 


function getColumns(width) {
  if (width >= LARGE_TABLET_MIN) return 8;
  if (width >= TABLET_MIN) return 6;
  if (width >= 480) return 5;
  return 4;
}

function AlbumGallery({ item, onBack, onGoHome, onSelectPhoto }) {
  const { width: SCREEN_W } = useWindowDimensions();
  const isTablet = SCREEN_W >= TABLET_MIN;

  const columns = getColumns(SCREEN_W);
  const gridPadding = 16;
  const gridGap = 8;
  const cellSize = (SCREEN_W - gridPadding * 2 - gridGap * (columns - 1)) / columns;

  const heroHeight = clamp(SCREEN_W * (isTablet ? 0.22 : 0.32), 180, 320);

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
        <View style={[styles.hero, { height: heroHeight }]}>
          <Image source={{ uri: item.image }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <Text style={styles.heroTitle}>{item.title}</Text>
        </View>

        <View
          style={[
            styles.albumGrid,
            { paddingHorizontal: gridPadding, gap: gridGap },
          ]}
        >
          {photos.length > 0
            ? photos.map((photo, index) => (
                <TouchableOpacity
                  key={photo.id || index}
                  style={[styles.cell, { width: cellSize, height: cellSize }]}
                  activeOpacity={0.8}
                  onPress={() => onSelectPhoto(photos, index)}
                >
                  <Image source={{ uri: photo.uri }} style={styles.cellImage} />
                </TouchableOpacity>
              ))
            : Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
                <View
                  key={`placeholder-${index}`}
                  style={[styles.cellPlaceholder, { width: cellSize, height: cellSize }]}
                />
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


function PhotoViewer({ photos, initialIndex, title, onClose }) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
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
          <View style={{ width: SCREEN_W, height: SCREEN_H, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: SCREEN_W, height: SCREEN_H }}
              resizeMode="contain"
            />
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


export default function GalleryScreen() {
  const [screen, setScreen] = useState('grid');
  const [items, setItems] = useState(GALLERY_ITEMS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewerPhotos, setViewerPhotos] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

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
  },
  welcomeText: {
    color: '#3F6FB8',
    fontFamily: 'Nunito-Bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  titleText: {
    fontFamily: 'Nunito-ExtraBold',
    color: '#11202B',
  },
  grid: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  card: {
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
    fontFamily: 'Nunito-ExtraBold',
  },
  cardSubtitle: {
    color: '#eee',
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
    paddingTop: 20,
  },
  cell: {
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
    borderRadius: 6,
    backgroundColor: '#D9D9D9',
  },

  // ---------- full-screen viewer ----------
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000',
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