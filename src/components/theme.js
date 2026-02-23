// ============================================================
//  TESNIM App — Design System
//  Clean & modern: white, black, minimal
// ============================================================

export const Colors = {
  // Core
  black:      '#0A0A0A',
  white:      '#FFFFFF',
  offWhite:   '#F7F7F7',

  // Grays
  gray100:    '#F5F5F5',
  gray200:    '#EBEBEB',
  gray300:    '#D4D4D4',
  gray400:    '#A3A3A3',
  gray500:    '#737373',
  gray600:    '#525252',
  gray700:    '#404040',

  // Accent
  accent:     '#C8A96E',   // warm gold — subtle luxury touch
  accentLight:'#F5EDD8',

  // Status
  success:    '#22C55E',
  warning:    '#F59E0B',
  error:      '#EF4444',
  info:       '#3B82F6',

  // Stock
  inStock:    '#22C55E',
  lowStock:   '#F59E0B',
  outOfStock: '#EF4444',

  // UI
  border:     '#E5E5E5',
  shadow:     'rgba(0,0,0,0.08)',
  overlay:    'rgba(0,0,0,0.5)',
  background: '#FFFFFF',
  surface:    '#F7F7F7',
};

export const Typography = {
  // Display
  display: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: Colors.black,
  },
  // Heading
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.3, color: Colors.black },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.2, color: Colors.black },
  h3: { fontSize: 18, fontWeight: '600', letterSpacing: -0.1, color: Colors.black },
  h4: { fontSize: 16, fontWeight: '600', color: Colors.black },
  // Body
  body:  { fontSize: 15, fontWeight: '400', color: Colors.gray600, lineHeight: 22 },
  bodyS: { fontSize: 13, fontWeight: '400', color: Colors.gray500, lineHeight: 19 },
  // Label
  label:  { fontSize: 12, fontWeight: '600', letterSpacing: 0.8, color: Colors.gray500 },
  labelB: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: Colors.gray400 },
  // Price
  price:  { fontSize: 18, fontWeight: '700', color: Colors.black },
  priceS: { fontSize: 15, fontWeight: '600', color: Colors.black },
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const Radius = {
  sm:   4,
  md:   8,
  lg:   16,
  xl:   24,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};
