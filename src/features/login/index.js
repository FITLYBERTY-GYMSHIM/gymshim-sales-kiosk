import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Rect,
  Circle,
  Ellipse,
  Line,
  Path,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const GOLD  = '#F5C518';
const DARK  = '#1A1A1A';
const DARK2 = '#242424';
const DARK3 = '#111111';
const WHITE = '#FFFFFF';
const GRAY1 = '#CCCCCC';
const GRAY2 = '#555555';
const GRAY3 = '#333333';
const GRAY4 = '#444444';

// Breakpoints
const TABLET_MIN = 768;
const SMALL_PHONE_MAX = 360;

const BASE_WIDTH = 375;


const clamp = (val, min, max) => Math.min(Math.max(val, min), max);


const GymshimLogoIcon = ({ size = 52 }) => (
  <Svg width={size} height={size} viewBox="0 0 52 52">
    <Rect x="2"  y="19" width="10" height="14" rx="3" fill={GOLD} />
    <Rect x="40" y="19" width="10" height="14" rx="3" fill={GOLD} />
    <Rect x="10" y="23" width="32" height="6"  rx="3" fill={GOLD} />
    <Rect x="20" y="10" width="12" height="32" rx="4" fill={WHITE} />
    <SvgText
      x="26" y="31"
      textAnchor="middle"
      fontSize="13"
      fontWeight="900"
      fill={DARK}
      fontFamily="Nunito"
    >G</SvgText>
  </Svg>
);

const QRCodeImage = ({ size = 360 }) => (
  <Image
    source={require('../../assets/qr.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const PhoneMockup = ({ size = 100 }) => {
  const h = size * 1.8;
  return (
    <Svg width={size} height={h} viewBox="0 0 90 160">
      <Rect x="2" y="2" width="86" height="156" rx="12" fill={DARK} stroke="#444" strokeWidth="2" />
      <Rect x="8" y="10" width="74" height="125" rx="4" fill="#2A2A2A" />
      <Rect x="8" y="10" width="74" height="16" rx="4" fill="#333" />
      <SvgText x="45" y="22" textAnchor="middle" fill={WHITE} fontSize="7" fontFamily="sans-serif" fontWeight="600">Scanner</SvgText>
      <Rect x="20" y="34" width="50" height="50" rx="4" fill={WHITE} stroke={GOLD} strokeWidth="2" />
      <Rect x="23" y="37" width="14" height="14" rx="1" fill={DARK} />
      <Rect x="24" y="38" width="12" height="12" fill={WHITE} />
      <Rect x="25" y="39" width="10" height="10" rx="0.5" fill={DARK} />
      <Rect x="53" y="37" width="14" height="14" rx="1" fill={DARK} />
      <Rect x="54" y="38" width="12" height="12" fill={WHITE} />
      <Rect x="55" y="39" width="10" height="10" rx="0.5" fill={DARK} />
      <Rect x="23" y="67" width="14" height="14" rx="1" fill={DARK} />
      <Rect x="24" y="68" width="12" height="12" fill={WHITE} />
      <Rect x="25" y="69" width="10" height="10" rx="0.5" fill={DARK} />
      <Rect x="39" y="37" width="3" height="3" fill={DARK} />
      <Rect x="44" y="37" width="3" height="3" fill={DARK} />
      <Rect x="39" y="42" width="3" height="3" fill={DARK} />
      <Rect x="44" y="47" width="3" height="3" fill={DARK} />
      <Rect x="39" y="52" width="3" height="3" fill={DARK} />
      <Rect x="44" y="57" width="3" height="3" fill={DARK} />
      <Rect x="39" y="62" width="3" height="3" fill={DARK} />
      <Rect x="39" y="67" width="3" height="3" fill={DARK} />
      <Rect x="44" y="67" width="3" height="3" fill={DARK} />
      <Rect x="53" y="52" width="3" height="3" fill={DARK} />
      <Rect x="58" y="52" width="3" height="3" fill={DARK} />
      <Rect x="53" y="57" width="3" height="3" fill={DARK} />
      <Rect x="58" y="62" width="3" height="3" fill={DARK} />
      <Rect x="53" y="67" width="3" height="3" fill={DARK} />
      <Rect x="58" y="67" width="3" height="3" fill={DARK} />
      <SvgText x="45" y="98"  textAnchor="middle" fill="#AAA" fontSize="6.5" fontFamily="sans-serif">Scan QR Code</SvgText>
      <SvgText x="45" y="108" textAnchor="middle" fill="#AAA" fontSize="6.5" fontFamily="sans-serif">to register your gym</SvgText>
      <Rect x="28" y="118" width="34" height="11" rx="5.5" fill={GOLD} />
      <Rect x="35" y="6" width="20" height="3" rx="1.5" fill="#444" />
      <Circle cx="45" cy="147" r="8" stroke="#555" strokeWidth="1.5" fill="none" />
    </Svg>
  );
};

const HeroBackground = ({ width, height }) => (
  <View style={[StyleSheet.absoluteFill, { width, height, overflow: 'hidden' }]}>
    <Image
      source={require('../../assets/GYM.png')}
      style={{
        position: 'absolute',
        width: width,
        height: height * 2.7,
        top: 0,
        right: 0,
      }}
      resizeMode="cover"
    />
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="overlayG" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%"   stopColor="#000000" stopOpacity="0.82" />
          <Stop offset="55%"  stopColor="#000000" stopOpacity="0.45" />
          <Stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
        </LinearGradient>
        <LinearGradient id="bottomG" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%"   stopColor="#000000" stopOpacity="0" />
          <Stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </LinearGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#overlayG)" />
      <Rect x="0" y={height * 0.6} width={width} height={height * 0.4} fill="url(#bottomG)" />
    </Svg>
  </View>
);

const RegStep = ({ num, iconContent, title, description, showConnector, s }) => (
  <>
    <View style={s.stepRow}>
      <View style={s.stepNum}><Text style={s.stepNumText}>{num}</Text></View>
      <View style={s.stepIcon}>{iconContent}</View>
      <View style={s.stepText}>
        <Text style={s.stepTitle}>{title}</Text>
        <Text style={s.stepDesc}>{description}</Text>
      </View>
    </View>
    {showConnector && <View style={s.stepConnector} />}
  </>
);


const MarqueeRow = ({ children, speed = 50 }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const itemWidth  = useRef(0);
  const running    = useRef(false);
  const mounted    = useRef(true);

  const runOnce = (width) => {
    if (!mounted.current) return;
    translateX.setValue(0);
    Animated.timing(translateX, {
      toValue:         -width,
      duration:        (width / speed) * 1000,
      easing:          Easing.linear,
      useNativeDriver: true,
      isInteraction:   false,
    }).start(({ finished }) => {
      if (finished && mounted.current) runOnce(width);
    });
  };

  const onSetLayout = (e) => {
    const w = e.nativeEvent.layout.width;
    if (!w || w === itemWidth.current) return;
    itemWidth.current = w;
    if (!running.current) {
      running.current = true;
      runOnce(w);
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      translateX.stopAnimation();
    };
  }, []);

  return (
    <View style={{ overflow: 'hidden', width: '100%' }}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        <View style={{ flexDirection: 'row' }} onLayout={onSetLayout}>
          {children}
        </View>
        <View style={{ flexDirection: 'row' }}>{children}</View>
        <View style={{ flexDirection: 'row' }}>{children}</View>
        <View style={{ flexDirection: 'row' }}>{children}</View>
      </Animated.View>
    </View>
  );
};

const GymCard = ({ logo, label, s }) => (
  <View style={s.gymCard}>
    <View style={s.gymLogoBox}>{logo}</View>
    <Text style={s.gymLabel}>{label}</Text>
  </View>
);

// ─── Step icons ───────────────────────────────────────────────────────────────
const IconCRM = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Rect x="1" y="1" width="22" height="22" rx="3" fill={GOLD} />
    <SvgText x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill={DARK} fontFamily="sans-serif">CRM</SvgText>
  </Svg>
);

const IconSkins = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Rect width="24" height="24" rx="5" fill={DARK} />
    <Circle cx="12" cy="10" r="4" stroke={WHITE} strokeWidth="1.5" fill="none" />
    <Path d="M7 19c0-2.8 2.2-4 5-4s5 1.2 5 4" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);

const IconScanner = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Rect width="24" height="24" rx="5" fill={DARK} />
    <Rect x="4"  y="4"  width="6" height="6" rx="1" stroke={WHITE} strokeWidth="1.5" fill="none" />
    <Rect x="14" y="4"  width="6" height="6" rx="1" stroke={WHITE} strokeWidth="1.5" fill="none" />
    <Rect x="4"  y="14" width="6" height="6" rx="1" stroke={WHITE} strokeWidth="1.5" fill="none" />
    <Rect x="14" y="14" width="6" height="6" rx="1" stroke={WHITE} strokeWidth="1.5" fill="none" />
  </Svg>
);

const IconGym = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Rect width="24" height="24" rx="5" fill={DARK} />
    <Rect x="4" y="12" width="16" height="9" rx="2" stroke={WHITE} strokeWidth="1.5" fill="none" />
    <Path d="M8 12V9a4 4 0 018 0v3" stroke={WHITE} strokeWidth="1.5" fill="none" />
    <Circle cx="12" cy="17" r="1.5" fill={WHITE} />
  </Svg>
);

// ─── Gym logos ────────────────────────────────────────────────────────────────
const LogoGoldsGym = () => (
  <Svg width={60} height={50} viewBox="0 0 60 50">
    <Circle cx="30" cy="25" r="22" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
    <Circle cx="30" cy="25" r="18" fill="none" stroke="#8B6914" strokeWidth="1" />
    <SvgText x="30" y="20" textAnchor="middle" fontSize="6"  fontWeight="900" fill="#8B0000" fontFamily="sans-serif">GOLD'S</SvgText>
    <SvgText x="30" y="30" textAnchor="middle" fontSize="9"  fontWeight="900" fill="#8B0000" fontFamily="sans-serif">GYM</SvgText>
    <SvgText x="30" y="38" textAnchor="middle" fontSize="5"  fill="#8B0000"   fontFamily="sans-serif">EST. 1965</SvgText>
  </Svg>
);

const LogoCultFit = () => (
  <Svg width={60} height={50} viewBox="0 0 60 50">
    <SvgText x="30" y="22" textAnchor="middle" fontSize="13" fontWeight="800" fill="#E63946" fontFamily="sans-serif">cult</SvgText>
    <SvgText x="30" y="38" textAnchor="middle" fontSize="13" fontWeight="800" fill="#E63946" fontFamily="sans-serif">.fit</SvgText>
  </Svg>
);

const LogoOneo = () => (
  <Svg width={60} height={50} viewBox="0 0 60 50">
    <SvgText x="8"  y="34" fontSize="30" fontWeight="900" fill="#FF6B35" fontFamily="sans-serif">9</SvgText>
    <SvgText x="28" y="26" fontSize="13" fontWeight="800" fill={DARK}    fontFamily="sans-serif">NEO</SvgText>
    <SvgText x="28" y="40" fontSize="9"  fontWeight="600" fill={DARK}    fontFamily="sans-serif">FITNESS</SvgText>
  </Svg>
);

const LogoToneHouse = () => (
  <Svg width={60} height={50} viewBox="0 0 60 50">
    <SvgText x="30" y="26" textAnchor="middle" fontSize="22" fontWeight="900" fill="#E63946" fontFamily="sans-serif">T</SvgText>
    <SvgText x="30" y="38" textAnchor="middle" fontSize="8"  fontWeight="700" fill={DARK}    fontFamily="sans-serif">toneHouse</SvgText>
    <SvgText x="30" y="47" textAnchor="middle" fontSize="6"  fill="#555"      fontFamily="sans-serif">F I T N E S S</SvgText>
  </Svg>
);

const LogoFlux = () => (
  <Svg width={60} height={50} viewBox="0 0 60 50">
    <Rect x="8" y="10" width="44" height="30" rx="6" fill="#1565C0" opacity="0.12" />
    <SvgText x="30" y="32" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1565C0" fontFamily="sans-serif">FLUX</SvgText>
    <Rect x="14" y="36" width="32" height="2" rx="1" fill="#1565C0" opacity="0.4" />
  </Svg>
);

// ─── Footer icons ─────────────────────────────────────────────────────────────
const IconPhone = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
      fill={DARK}
    />
  </Svg>
);

const IconGlobe = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" stroke={DARK} strokeWidth="2" fill="none" />
    <Ellipse cx="12" cy="12" rx="4" ry="9" stroke={DARK} strokeWidth="1.5" fill="none" />
    <Line x1="3"  y1="9"  x2="21" y2="9"  stroke={DARK} strokeWidth="1.5" />
    <Line x1="3"  y1="15" x2="21" y2="15" stroke={DARK} strokeWidth="1.5" />
  </Svg>
);

const IconMobile = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Rect x="5" y="2" width="14" height="20" rx="3" stroke={WHITE} strokeWidth="2" fill="none" />
    <Rect x="9" y="18" width="6" height="2" rx="1" fill={WHITE} />
  </Svg>
);

const PeopleIcon = ({ size = 56 }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Circle cx="20" cy="18" r="10" fill={GOLD} opacity="0.7" />
    <Circle cx="36" cy="18" r="10" fill={GOLD} opacity="0.8" />
    <Circle cx="28" cy="22" r="12" fill={GOLD} />
    <Ellipse cx="14" cy="42" rx="12" ry="8" fill={GOLD} opacity="0.6" />
    <Ellipse cx="42" cy="42" rx="12" ry="8" fill={GOLD} opacity="0.6" />
    <Ellipse cx="28" cy="44" rx="14" ry="9" fill={GOLD} />
  </Svg>
);

const GymshimPoster = () => {
  const { width, height } = useWindowDimensions();

  const isTablet      = width >= TABLET_MIN;               // iPad mini and up
  const isLargeTablet = width >= 900;                       // iPad Pro / large iPad Air landscape
  const isSmallPhone  = width <= SMALL_PHONE_MAX;


  const scaleFactor = isTablet
    ? clamp(width / 1024, 0.74, 1.05)
    : clamp(width / BASE_WIDTH, 0.82, 1.12);
  const f = (size) => Math.round(size * scaleFactor);

  const HERO_H = isTablet
    ? clamp(height * 0.34, 300, 480)
    : clamp(height * 0.4, 260, 400);


  const qrSize = isTablet
    ? clamp(width * 0.26, 190, 300)
    : clamp(width * 0.55, 170, 260);


  const showPhoneMockup = isLargeTablet;

  const { s, steps, gyms } = useMemo(() => {
    const steps = [
      { num: '1', icon: <IconCRM />,     title: 'Open CRM App',  desc: 'Launch the CRM app on your mobile.',             connector: true  },
      { num: '2', icon: <IconSkins />,   title: 'Go to Skins',   desc: 'Tap on Skins from the bottom menu.',             connector: true  },
      { num: '3', icon: <IconScanner />, title: 'Tap Scanner',   desc: 'Click on the Scanner button.',                   connector: true  },
      { num: '4', icon: <IconGym />,     title: 'Select Gym',    desc: 'After scanning, select your Gym from the list.', connector: false },
    ];

    const gyms = [
      { logo: <LogoGoldsGym />,  label: "GOLD'S GYM"       },
      { logo: <LogoCultFit />,   label: 'CULT.FIT'          },
      { logo: <LogoOneo />,      label: 'ONEO FITNESS'      },
      { logo: <LogoToneHouse />, label: 'TONEHOUSE FITNESS' },
      { logo: <LogoFlux />,      label: 'THE FITNESS HUB'   },
    ];

    const s = StyleSheet.create({
      poster: {
        flex: 1,
        width: '100%',
        backgroundColor: DARK,
      },

      // Hero
      hero: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        paddingHorizontal: isTablet ? clamp(width * 0.05, 32, 52) : clamp(width * 0.06, 18, 32),
        paddingTop: isTablet ? 32 : 24,
        paddingBottom: isTablet ? clamp(width * 0.045, 40, 60) : 36,
        justifyContent: 'flex-start',
        borderBottomLeftRadius: isTablet ? 32 : 20,
        borderBottomRightRadius: isTablet ? 32 : 20,
      },
      logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: isTablet ? clamp(height * 0.06, 28, 56) : 28,
      },
      logoText: {
        fontSize: f(18),
        fontWeight: '800',
        color: WHITE,
        letterSpacing: 3,
      },
      brandName: {
        
        fontSize: isTablet ? clamp(width * 0.068, 42, 70) : clamp(f(38), 30, 46),
        fontWeight: '900',
        color: GOLD,
        letterSpacing: 2,
        lineHeight: isTablet
          ? clamp(width * 0.068, 42, 70) * 1.18
          : clamp(f(38), 30, 46) * 1.15,
      },
      rule: {
        width: 52,
        height: 3,
        backgroundColor: GOLD,
        marginTop: 14,
        marginBottom: 18,
      },
      tagline: {
        fontSize: f(16),
        fontWeight: '600',
        color: WHITE,
        lineHeight: f(24),
      },

      // Body
      body: { flex: 1 },
      bodyContent: {
        paddingHorizontal: isTablet ? 44 : clamp(width * 0.045, 14, 24),
        paddingTop: isTablet ? 29 : 18,
        paddingBottom: 0,
      },

      // Registration card
      regCard: {
        backgroundColor: WHITE,
        borderRadius: isTablet ? 28 : 20,
        flexDirection: isTablet ? 'row' : 'column',
        alignItems: isTablet ? 'center' : 'stretch',
        padding: isTablet ? (isLargeTablet ? 24 : 16) : 18,
        gap: isTablet ? (isLargeTablet ? 20 : 14) : 16,
        zIndex: 10,
        minHeight: isTablet ? 380 : undefined,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
        elevation: 14,
      },

 
      qrSide: {
        width: isTablet ? qrSize + 40 : '100%',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      },
      qrFrame: {
        width: qrSize,
        height: qrSize,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WHITE,
      },

      scanBtn: {
        backgroundColor: DARK,
        borderRadius: 40,
        paddingVertical: 12,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      scanBtnText: {
        fontSize: f(13),
        fontWeight: '700',
        color: WHITE,
      },
      scanBtnGold: {
        color: GOLD,
      },

      // Divider between QR and steps (vertical on tablet, horizontal on phone)
      cardDivider: isTablet
        ? {
            width: 1,
            alignSelf: 'stretch',
            backgroundColor: '#E0E0E0',
            marginVertical: 8,
          }
        : {
            height: 1,
            width: '100%',
            backgroundColor: '#E5E5E5',
          },

      // Steps
      regSide: {
        flex: isTablet ? 1 : undefined,
        flexShrink: isTablet ? 1 : undefined,
        minWidth: 0,
        justifyContent: 'center',
        paddingLeft: isTablet ? 8 : 0,
      },
      regTitle: {
        fontSize: f(17),
        fontWeight: '800',
        color: DARK,
        letterSpacing: 1.5,
        marginBottom: 6,
        textAlign: isTablet ? 'left' : 'center',
      },
      regTitleUnderline: {
        width: isTablet ? '100%' : 48,
        alignSelf: isTablet ? 'stretch' : 'center',
        height: 2,
        backgroundColor: GOLD,
        marginBottom: 18,
      },
      stepsWrap: {
        gap: 0,
      },
      stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 6,
      },
      stepNum: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: DARK,
        alignItems: 'center',
        justifyContent: 'center',
      },
      stepNumText: {
        fontSize: f(12),
        fontWeight: '800',
        color: WHITE,
      },
      stepIcon: {
        width: 36,
        height: 36,
        borderRadius: 11,
        backgroundColor: DARK,
        alignItems: 'center',
        justifyContent: 'center',
      },
      stepText: { flex: 1 },
      stepTitle: {
        fontSize: f(13),
        fontWeight: '700',
        color: DARK,
      },
      stepDesc: {
        fontSize: f(11),
        color: GRAY2,
        lineHeight: f(17),
      },
      stepConnector: {
        width: 2,
        height: 16,
        backgroundColor: '#DDD',
        marginLeft: 13,
        marginVertical: 2,
      },

      // Phone mockup column
      phoneMockup: {
        alignSelf: 'center',
        flexShrink: 0,
      },

      // About
      aboutCard: {
        backgroundColor: DARK2,
        borderRadius: 20,
        padding: isTablet ? 10 : 14,
        flexDirection: isSmallPhone ? 'column' : 'row',
        alignItems: isSmallPhone ? 'center' : 'flex-start',
        gap: isTablet ? 20 : 14,
        marginTop: 24,
      },
      aboutDivider: isSmallPhone
        ? { display: 'none' }
        : {
            width: 2,
            backgroundColor: GOLD,
            alignSelf: 'stretch',
            minHeight: 40,
          },
      aboutContent: { flex: 1 },
      aboutTitle: {
        fontSize: f(14),
        fontWeight: '800',
        color: GOLD,
        letterSpacing: 1.5,
        marginBottom: 10,
        textAlign: isSmallPhone ? 'center' : 'left',
      },
      aboutBody: {
        fontSize: f(12.5),
        color: GRAY1,
        lineHeight: f(20),
        fontWeight: '400',
        textAlign: isSmallPhone ? 'center' : 'left',
      },

      // Gyms
      gymsSection: {
        marginTop: 24,
      },
      gymsTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 18,
      },
      gymsTitleLine: {
        flex: 1,
        height: 1,
        backgroundColor: GRAY4,
      },
      gymsTitleText: {
        fontSize: f(11),
        fontWeight: '700',
        color: '#DDD',
        letterSpacing: 2,
        textAlign: 'center',
      },
      marqueeItem: {
        marginRight: 14,
        width: isTablet ? 140 : 120,
      },
      gymCard: {
        backgroundColor: WHITE,
        borderRadius: 16,
        flex: 1,
        paddingTop: 14,
        paddingBottom: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
        gap: 8,
      },
      gymLogoBox: {
        width: 54,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      },
      gymLabel: {
        fontSize: f(8),
        fontWeight: '700',
        color: GRAY3,
        letterSpacing: 0.5,
        textAlign: 'center',
      },

      // Footer
      footer: {
        backgroundColor: DARK3,
        flexDirection: isSmallPhone ? 'column' : 'row',
        alignItems: 'center',
        borderRadius: 16,
        overflow: 'hidden',
        paddingVertical: isSmallPhone ? 12 : 0,
        height: isSmallPhone ? undefined : 60,
        marginTop: 24,
      },
      footerCell: {
        flex: isSmallPhone ? undefined : 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: isSmallPhone ? undefined : '100%',
        paddingVertical: isSmallPhone ? 8 : 0,
      },
      footerDivider: isSmallPhone
        ? { width: '70%', height: 1, backgroundColor: GRAY4 }
        : { width: 1, height: 34, backgroundColor: GRAY4 },
      footerIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: GOLD,
        alignItems: 'center',
        justifyContent: 'center',
      },
      footerText: {
        fontSize: f(13),
        fontWeight: '700',
        color: WHITE,
      },
    });

    return { s, steps, gyms };
  }, [width, height, isTablet, isLargeTablet, isSmallPhone, qrSize, scaleFactor]);

  return (
    <View style={s.poster}>
      <StatusBar barStyle="light-content" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <View style={[s.hero, { height: HERO_H }]}>
        <HeroBackground width={width} height={HERO_H} />

        <View style={s.logoRow}>
          <GymshimLogoIcon size={isTablet ? 52 : 40} />
          <Text style={s.logoText}>GYMSHIM</Text>
        </View>

        <Text style={s.brandName}>PERSONAL {'\n'}MEMBERSHIP BUDDY</Text>
        <View style={s.rule} />
        <Text style={s.tagline}>Smarter Gym Management.</Text>
        <View style={s.rule} />
        <Text style={s.tagline}>Stronger Connections.</Text>
      </View>

      {/* ── SCROLLABLE BODY ──────────────────────────────────────── */}
      <ScrollView
        style={s.body}
        contentContainerStyle={s.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Registration card */}
        <View style={s.regCard}>

          {/* QR side */}
          <View style={s.qrSide}>
            <View style={s.qrFrame}>
              <QRCodeImage size={qrSize} />
            </View>
            <TouchableOpacity style={s.scanBtn} activeOpacity={0.85}>
              <IconMobile />
              <Text style={s.scanBtnText}>
                Scan to <Text style={s.scanBtnGold}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={s.cardDivider} />

          {/* Steps side */}
          <View style={s.regSide}>
            <Text style={s.regTitle}>GYM REGISTRATION</Text>
            <View style={s.regTitleUnderline} />

            <View style={s.stepsWrap}>
              {steps.map((st) => (
                <RegStep
                  key={st.num}
                  num={st.num}
                  iconContent={st.icon}
                  title={st.title}
                  description={st.desc}
                  showConnector={st.connector}
                  s={s}
                />
              ))}
            </View>
          </View>

          {/* Phone mockup — tablet only, phones stay stacked & compact */}
          {showPhoneMockup && (
            <View style={s.phoneMockup}>
              <PhoneMockup size={100} />
            </View>
          )}
        </View>

        {/* About Us */}
        <View style={s.aboutCard}>
          <PeopleIcon size={isTablet ? 56 : 44} />
          <View style={s.aboutDivider} />
          <View style={s.aboutContent}>
            <Text style={s.aboutTitle}>ABOUT US</Text>
            <Text style={s.aboutBody}>
              Instafit India, Inc. is an American chain of international co-ed
              fitness centers (commonly referred to as gyms) originally started
              by Joe Gold in Venice Beach, California. Each gym offers a variety
              of cardio and strength training equipment as well as group exercise
              programs.
            </Text>
          </View>
        </View>

        {/* Connected gyms */}
        <View style={s.gymsSection}>
          <View style={s.gymsTitleRow}>
            <View style={s.gymsTitleLine} />
            <Text style={s.gymsTitleText}>TOP GYMS WE ARE CONNECTED WITH</Text>
            <View style={s.gymsTitleLine} />
          </View>

          <MarqueeRow speed={35}>
            {gyms.map((g) => (
              <View key={g.label} style={s.marqueeItem}>
                <GymCard logo={g.logo} label={g.label} s={s} />
              </View>
            ))}
          </MarqueeRow>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.footerCell}>
            <View style={s.footerIconCircle}><IconPhone /></View>
            <Text style={s.footerText}>+91 8837329430</Text>
          </View>
          <View style={s.footerDivider} />
          <View style={s.footerCell}>
            <View style={s.footerIconCircle}><IconGlobe /></View>
            <Text style={s.footerText}>www.instafitindia.com</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default GymshimPoster;


// import React, { useState } from 'react';
// import { View, Text, Pressable } from 'react-native';
// import OtpModal from '../../components/otp/index';

// export default function LoginScreen() {
//   const [showOtp, setShowOtp] = useState(false);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6F9' }}>
//       <Text style={{ fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 30 }}>
//         GymShim Kiosk
//       </Text>

//       <Pressable
//         onPress={() => setShowOtp(true)}
//         style={{
//           backgroundColor: '#0A5A7E',
//           paddingVertical: 14,
//           paddingHorizontal: 32,
//           borderRadius: 12,
//         }}
//       >
//         <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
//           Open OTP Login
//         </Text>
//       </Pressable>

//       <OtpModal
//         visible={showOtp}
//         onClose={() => setShowOtp(false)}
//         onSuccess={(token) => {
//           console.log('✅ Token received:', token);
//           alert(`Login successful!\nToken: ${token}`);
//           setShowOtp(false);
//         }}
//       />
//     </View>
//   );
// }
