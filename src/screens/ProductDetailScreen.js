import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, Dimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { productsApi } from '../services/api';
import { Button, StockBadge, LoadingScreen, Price } from '../components/UI';
import { Colors, Spacing, Typography, Radius, Shadow } from '../components/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const { productId } = route.params;
  const { t, addToCart, toggleWishlist, isInWishlist } = useApp();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);

  useEffect(() => {
    productsApi.getById(productId).then(res => {
      if (res.success) setProduct(res.data);
      setLoading(false);
    });
  }, [productId]);

  if (loading) return <LoadingScreen />;
  if (!product) return (
    <SafeAreaView style={styles.safe}>
      <Text style={{ padding: 20 }}>Product not found</Text>
    </SafeAreaView>
  );

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {product.image
            ? <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
            : <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>TESNIM</Text>
              </View>
          }
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          {/* Wishlist button */}
          <TouchableOpacity
            style={styles.wishBtn}
            onPress={() => toggleWishlist(product)}
          >
            <Text style={styles.wishBtnText}>{inWishlist ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Category & Name */}
          {product.category_name && (
            <Text style={styles.category}>{product.category_name.toUpperCase()}</Text>
          )}
          <Text style={styles.name}>{product.name}</Text>

          {/* Price & Stock */}
          <View style={styles.priceRow}>
            <Price value={product.price} original={product.original_price} />
            <StockBadge status={product.stock_status} t={t} />
          </View>

          {/* SKU */}
          {product.sku && (
            <Text style={styles.sku}>{t('sku')}: {product.sku}</Text>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          {product.description && (
            <>
              <Text style={styles.sectionLabel}>{t('description').toUpperCase()}</Text>
              <Text style={styles.description}>{product.description}</Text>
              <View style={styles.divider} />
            </>
          )}

          {/* Quantity Selector */}
          {product.in_stock && (
            <View style={styles.qtySection}>
              <Text style={styles.sectionLabel}>{t('quantity').toUpperCase()}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(q => Math.min(product.stock_qty, q + 1))}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.totalMini}>
          <Text style={styles.totalMiniLabel}>Total</Text>
          <Text style={styles.totalMiniValue}>
            {(product.price * quantity).toLocaleString('mk-MK')} ден
          </Text>
        </View>
        <Button
          title={added ? '✓ ' + t('addedToCart') : t('addToCart')}
          onPress={handleAddToCart}
          disabled={!product.in_stock}
          style={styles.addBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },

  imageContainer: { width, height: width, backgroundColor: Colors.gray100 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  imagePlaceholderText: { fontSize: 24, fontWeight: '800', letterSpacing: 4, color: Colors.gray300 },

  backBtn: {
    position: 'absolute', top: 48, left: Spacing.lg,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
  },
  backBtnText: { fontSize: 20, color: Colors.black, fontWeight: '300' },
  wishBtn: {
    position: 'absolute', top: 48, right: Spacing.lg,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
  },
  wishBtnText: { fontSize: 18 },

  content:  { padding: Spacing.lg },
  category: { ...Typography.labelB, letterSpacing: 2, color: Colors.gray400, marginBottom: Spacing.xs },
  name:     { fontSize: 24, fontWeight: '700', color: Colors.black, marginBottom: Spacing.md, lineHeight: 30 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sku:      { ...Typography.bodyS, marginBottom: Spacing.sm },
  divider:  { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },

  sectionLabel: { ...Typography.labelB, letterSpacing: 1.5, color: Colors.gray400, marginBottom: Spacing.sm },
  description:  { ...Typography.body, lineHeight: 24 },

  qtySection: { marginTop: Spacing.sm },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  qtyBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 20, color: Colors.black, fontWeight: '300' },
  qtyValue:   { fontSize: 18, fontWeight: '600', color: Colors.black, minWidth: 30, textAlign: 'center' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    paddingBottom: 28,
    ...Shadow.lg,
  },
  totalMini: { marginRight: Spacing.lg },
  totalMiniLabel: { ...Typography.labelB, color: Colors.gray400 },
  totalMiniValue: { fontSize: 18, fontWeight: '700', color: Colors.black },
  addBtn: { flex: 1 },
});
