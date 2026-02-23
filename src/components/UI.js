import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, Image, TextInput,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from './theme';

// ---- Button ----
export function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const isOutline   = variant === 'outline';
  const isGhost     = variant === 'ghost';
  const isDanger    = variant === 'danger';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.btn,
        isOutline && styles.btnOutline,
        isGhost   && styles.btnGhost,
        isDanger  && styles.btnDanger,
        (disabled || loading) && styles.btnDisabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={isOutline || isGhost ? Colors.black : Colors.white} size="small" />
        : <Text style={[
            styles.btnText,
            isOutline && styles.btnTextOutline,
            isGhost   && styles.btnTextGhost,
            isDanger  && styles.btnTextDanger,
          ]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

// ---- Input ----
export function Input({ label, error, style, ...props }) {
  return (
    <View style={[styles.inputWrap, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={Colors.gray400}
        {...props}
      />
      {error && <Text style={styles.inputErrorText}>{error}</Text>}
    </View>
  );
}

// ---- Badge ----
export function Badge({ label, color = Colors.black, textColor = Colors.white, style }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, style]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

// ---- Stock Badge ----
export function StockBadge({ status, t }) {
  const config = {
    in_stock:    { color: Colors.inStock,    label: t('inStock') },
    low_stock:   { color: Colors.lowStock,   label: t('lowStock') },
    out_of_stock:{ color: Colors.outOfStock, label: t('outOfStock') },
  };
  const c = config[status] || config.out_of_stock;
  return <Badge label={c.label} color={c.color} />;
}

// ---- Section Header ----
export function SectionHeader({ title, onSeeAll, t }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>{t ? t('seeAll') : 'See All'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---- Empty State ----
export function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon || '📦'}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
      {onAction && (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: Spacing.lg, paddingHorizontal: Spacing.xl }} />
      )}
    </View>
  );
}

// ---- Loading Screen ----
export function LoadingScreen() {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={Colors.black} />
    </View>
  );
}

// ---- Divider ----
export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

// ---- Price ----
export function Price({ value, original, size = 'normal' }) {
  const isSmall = size === 'small';
  const hasDiscount = original && original > value;
  return (
    <View style={styles.priceRow}>
      <Text style={isSmall ? styles.priceSm : styles.priceLg}>
        {value.toLocaleString('mk-MK')} ден
      </Text>
      {hasDiscount && (
        <Text style={styles.priceOriginal}>
          {original.toLocaleString('mk-MK')} ден
        </Text>
      )}
    </View>
  );
}

// ---- Product Card ----
export function ProductCard({ product, onPress, onAddToCart, t }) {
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.productImageWrap}>
        {product.image
          ? <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
          : <View style={styles.productImagePlaceholder}>
              <Text style={styles.productImagePlaceholderText}>TESNIM</Text>
            </View>
        }
        {!product.in_stock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>{t ? t('outOfStock') : 'Out of Stock'}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory} numberOfLines={1}>
          {product.category_name || ''}
        </Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <View style={styles.productFooter}>
          <Price value={product.price} original={product.original_price} size="small" />
          {product.in_stock && onAddToCart && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => onAddToCart(product)}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Button
  btn: {
    backgroundColor: Colors.black,
    borderRadius: Radius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDanger: {
    backgroundColor: Colors.error,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  btnTextOutline: { color: Colors.black },
  btnTextGhost:   { color: Colors.gray600 },
  btnTextDanger:  { color: Colors.white },

  // Input
  inputWrap: { marginBottom: Spacing.md },
  inputLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  inputError: { borderColor: Colors.error },
  inputErrorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },

  // Badge
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { ...Typography.h3 },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
    letterSpacing: 0.3,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  emptyIcon:     { fontSize: 52, marginBottom: Spacing.lg },
  emptyTitle:    { ...Typography.h3, textAlign: 'center', marginBottom: Spacing.sm },
  emptySubtitle: { ...Typography.body, textAlign: 'center', color: Colors.gray400 },

  // Loading
  loadingScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white,
  },

  // Divider
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },

  // Price
  priceRow:      { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  priceLg:       { ...Typography.price },
  priceSm:       { ...Typography.priceS },
  priceOriginal: {
    fontSize: 12,
    color: Colors.gray400,
    textDecorationLine: 'line-through',
  },

  // Product card
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productImageWrap: { aspectRatio: 1, backgroundColor: Colors.gray100 },
  productImage:     { width: '100%', height: '100%' },
  productImagePlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gray100,
  },
  productImagePlaceholderText: {
    fontSize: 11, fontWeight: '700', letterSpacing: 2, color: Colors.gray300,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
  },
  outOfStockText: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: Colors.gray500,
  },
  productInfo:     { padding: Spacing.sm },
  productCategory: { ...Typography.labelB, marginBottom: 2 },
  productName:     { fontSize: 13, fontWeight: '500', color: Colors.black, marginBottom: Spacing.xs, lineHeight: 18 },
  productFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: {
    width: 28, height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.black,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: Colors.white, fontSize: 18, fontWeight: '300', lineHeight: 22 },
});
