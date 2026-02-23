import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  FlatList, RefreshControl, TextInput, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { productsApi, categoriesApi } from '../services/api';
import { ProductCard, SectionHeader, LoadingScreen } from '../components/UI';
import { Colors, Spacing, Typography, Radius, Shadow } from '../components/theme';

export default function HomeScreen({ navigation }) {
  const { t, addToCart, cartCount } = useApp();
  const [featured, setFeatured]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    const [featRes, catRes] = await Promise.all([
      productsApi.getFeatured(),
      categoriesApi.getAll(),
    ]);
    if (featRes.success)  setFeatured(featRes.data);
    if (catRes.success)   setCategories(catRes.data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { loadData(); }, []);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Shop', { search: searchQuery.trim() });
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandLabel}>HOME & LIVING</Text>
            <Text style={styles.brandName}>TESNIM</Text>
          </View>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('search') + '...'}
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {/* Hero Banner */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>NEW COLLECTION</Text>
          <Text style={styles.heroTitle}>Designed for{'\n'}your home.</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.85}
          >
            <Text style={styles.heroBtnText}>{t('allProducts')} →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <SectionHeader
            title={t('categories')}
            onSeeAll={() => navigation.navigate('Shop')}
            t={t}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catChip}
                onPress={() => navigation.navigate('Shop', { categoryId: cat.id, categoryName: cat.name })}
                activeOpacity={0.8}
              >
                <Text style={styles.catChipName}>{cat.name}</Text>
                <Text style={styles.catChipCount}>{cat.product_count}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <SectionHeader
            title={t('featured')}
            onSeeAll={() => navigation.navigate('Shop')}
            t={t}
          />
          <FlatList
            data={featured}
            keyExtractor={i => i.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => (
              <View style={styles.featuredItem}>
                <ProductCard
                  product={item}
                  t={t}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                  onAddToCart={() => addToCart(item)}
                />
              </View>
            )}
          />
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  brandLabel: { ...Typography.labelB, letterSpacing: 2, color: Colors.gray400, marginBottom: 2 },
  brandName:  { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: Colors.black },
  cartBtn:    { position: 'relative', padding: Spacing.sm },
  cartIcon:   { fontSize: 24 },
  cartBadge:  {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: Colors.black, borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  cartBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
    backgroundColor: Colors.gray100, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 2,
  },
  searchIcon:  { fontSize: 16, marginRight: Spacing.sm },
  searchInput: { flex: 1, fontSize: 14, color: Colors.black, paddingVertical: 10 },

  hero: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    backgroundColor: Colors.black, borderRadius: Radius.xl,
    padding: Spacing.xl, paddingBottom: Spacing.lg,
  },
  heroLabel: { ...Typography.labelB, color: Colors.gray400, letterSpacing: 3, marginBottom: Spacing.sm },
  heroTitle: { fontSize: 30, fontWeight: '800', color: Colors.white, lineHeight: 36, marginBottom: Spacing.lg },
  heroBtn:   {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  heroBtnText: { fontSize: 14, fontWeight: '600', color: Colors.black },

  section:      { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  catScroll:    { marginHorizontal: -Spacing.lg, paddingHorizontal: Spacing.lg },
  catChip: {
    backgroundColor: Colors.gray100, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    marginRight: Spacing.sm, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  catChipName:  { fontSize: 13, fontWeight: '600', color: Colors.black },
  catChipCount: { fontSize: 11, color: Colors.gray400, marginTop: 1 },

  featuredList: { paddingRight: Spacing.lg },
  featuredItem: { width: 180, marginRight: Spacing.md },
});
