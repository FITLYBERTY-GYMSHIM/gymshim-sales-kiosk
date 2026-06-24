import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, ImageBackground, Dimensions } from 'react-native';
import styles from '../style-sheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Placeholder banners so the screen renders out of the box.
// Swap `color` for a real `image: { uri: '...' }` or `require('../../../../assets/...')`
// once you have the actual ad creatives from marketing.
const DEFAULT_BANNERS = [
  { id: '1', color: '#0E5A84', title: 'Bring a Friend', subtitle: 'Both get 1 month free' },
  { id: '2', color: '#0D6EA8', title: 'New Year Offer', subtitle: 'Up to 40% off on annual plans' },
  { id: '3', color: '#0B5E93', title: 'Personal Training', subtitle: 'First session free' },
];

export default function BannerAds({ banners = DEFAULT_BANNERS, autoPlayInterval = 4000 }) {
  const listRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!banners.length) return undefined;

    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % banners.length;
      listRef.current?.scrollToOffset({
        offset: indexRef.current * SCREEN_WIDTH,
        animated: true,
      });
      setActiveIndex(indexRef.current);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners, autoPlayInterval]);

  if (!banners.length) return null;

  const onMomentumScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    indexRef.current = newIndex;
    setActiveIndex(newIndex);
  };

  const renderSlide = ({ item }) => {
    const content = (
      <View style={styles.bannerTextBlock}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        {item.subtitle ? <Text style={styles.bannerSubtitle}>{item.subtitle}</Text> : null}
      </View>
    );

    if (item.image) {
      return (
        <ImageBackground source={item.image} style={styles.bannerSlide} resizeMode="cover">
          {content}
        </ImageBackground>
      );
    }

    return <View style={[styles.bannerSlide, { backgroundColor: item.color }]}>{content}</View>;
  };

  return (
    <View style={styles.bannerWrapper}>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderSlide}
      />
      <View style={styles.dotsContainer}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}