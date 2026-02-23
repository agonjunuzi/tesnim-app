import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, Modal, ScrollView, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { productsApi, categoriesApi } from '../services/api';
import { ProductCard, LoadingScreen, EmptyState } from '../components/UI';
import { Colors, Spacing, Typography, Radius } from '../components/theme';

export default function ShopScreen({ navigation, route }) {
  const { t, addToCart } = useApp();
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Filters
  const [search, setSearch]           = useState(route.params?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.categoryId || null);
  const [sort, setSort]               = useState('name');
  const [inStockOnly, setInStockOnly] = useState(false);

  const loadProducts = useCallback(async (reset = false) => {
    const currentPage = reset ? 1 : page;
    const params = { page: currentPage, limit: 20, sort };
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (inStockOnly) params.in_stock = 1;

    const res = await productsApi.getAll(params);
    if (res.success) {
      const newProducts = res.data;
      setProducts(prev => reset ? newProducts : [...prev, ...newProducts]);
      setHasMore(res.pagination?.has_more ?? false);
      if (reset) setPage(2); else setPage(p => p + 1);
    }
    setLoading(false);
    setRefreshing(false);
    setLoadingMore(false);
  }, [page, search, selectedCategory, sort, inStockOnly]);

  useEffect(() => {
    categoriesApi.getAll().then(r => { if (r.success) setCategories(r.data); });
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    loadProducts(true);
  }, [search, selectedCategory, sort, inStockOnly]);

  const onRefresh = () => { setRefreshing(true); loadProducts(true); };

  const onEndReached = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    loadProducts(false);
  };

  const sortOptions = [
    { key: 'name',       label: t('sortName') },
    { key: 'price_asc',  label: t('sortPriceLow') },
    { key: 'price_desc', label: t('sortPriceHigh') },
    { key: 'newest',     label: t('sortNewest') },
  ];

  const activeFiltersCount = [
    selectedCategory && 1,
    inStockOnly && 1,
    sort !== 'name' && 1,
  ].filter(Boolean).length;

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('shop')}</Text>
        {selectedCategory && (
          <Text style={styles.subtitle}>
            {categories.find(c => c.id === selectedCategory)?.name}
          </Text>
        )}
      </View>

      {/* Search + Filter bar */}
      <View style={styles.toolbar}>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('search') + '...'}
            placeholderTextColor={Colors.gray400}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: Colors.gray400, fontSize: 16, padding: 4 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, activeFiltersCount > 0 && styles.filterBtnActive]}
          onPress={() => setShowFilter(true)}
        >
          <Text style={[styles.filterBtnText, activeFiltersCount > 0 && styles.filterBtnTextActive]}>
            {t('filterBy')} {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={i => i.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title={t('noResults')}
            actionLabel={t('retry')}
            onAction={() => { setSearch(''); setSelectedCategory(null); }}
          />
        }
        ListFooterComponent={
          loadingMore
            ? <Text style={styles.loadingMore}>{t('loading')}</Text>
            : null
        }
        renderItem={({ item }) => (
          <View style={styles.productWrap}>
            <ProductCard
              product={item}
              t={t}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              onAddToCart={() => addToCart(item)}
            />
          </View>
        )}
      />

      {/* Filter Modal */}
      <Modal visible={showFilter} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('filterBy')} & {t('sortBy')}</Text>
            <TouchableOpacity onPress={() => setShowFilter(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>

            {/* Sort */}
            <Text style={styles.filterSection}>{t('sortBy').toUpperCase()}</Text>
            {sortOptions.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={styles.filterOption}
                onPress={() => setSort(opt.key)}
              >
                <Text style={styles.filterOptionText}>{opt.label}</Text>
                {sort === opt.key && <Text style={styles.filterCheck}>✓</Text>}
              </TouchableOpacity>
            ))}

            {/* Categories */}
            <Text style={[styles.filterSection, { marginTop: Spacing.lg }]}>
              {t('category').toUpperCase()}
            </Text>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.filterOptionText}>{t('allProducts')}</Text>
              {!selectedCategory && <Text style={styles.filterCheck}>✓</Text>}
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.filterOption}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.filterOptionText}>{cat.name} ({cat.product_count})</Text>
                {selectedCategory === cat.id && <Text style={styles.filterCheck}>✓</Text>}
              </TouchableOpacity>
            ))}

            {/* Stock */}
            <Text style={[styles.filterSection, { marginTop: Spacing.lg }]}>
              {t('inStock').toUpperCase()}
            </Text>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setInStockOnly(v => !v)}
            >
              <Text style={styles.filterOptionText}>{t('inStock')} only</Text>
              {inStockOnly && <Text style={styles.filterCheck}>✓</Text>}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Apply */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.applyBtnText}>
                {t('confirm')} ({products.length} {t('products').toLowerCase()})
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: Colors.white },
  header:   { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title:    { ...Typography.h2 },
  subtitle: { ...Typography.body, marginTop: 2, color: Colors.gray400 },

  toolbar: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md, gap: Spacing.sm,
  },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray100, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
  },
  searchIcon:  { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.black, paddingVertical: 9 },
  filterBtn: {
    backgroundColor: Colors.gray100, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  filterBtnActive:     { backgroundColor: Colors.black, borderColor: Colors.black },
  filterBtnText:       { fontSize: 13, fontWeight: '600', color: Colors.gray600 },
  filterBtnTextActive: { color: Colors.white },

  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
  row:  { justifyContent: 'space-between', marginBottom: Spacing.md },
  productWrap: { width: '48.5%' },
  loadingMore: { textAlign: 'center', padding: Spacing.lg, color: Colors.gray400 },

  // Modal
  modalSafe:   { flex: 1, backgroundColor: Colors.white },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalTitle: { ...Typography.h3 },
  modalClose: { fontSize: 20, color: Colors.gray500, padding: 4 },
  modalBody:  { flex: 1, padding: Spacing.lg },
  filterSection: {
    ...Typography.labelB, letterSpacing: 1.5,
    color: Colors.gray400, marginBottom: Spacing.sm,
  },
  filterOption: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  filterOptionText: { fontSize: 15, color: Colors.black },
  filterCheck:      { fontSize: 16, color: Colors.black, fontWeight: '700' },
  modalFooter: { padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border },
  applyBtn: {
    backgroundColor: Colors.black, borderRadius: Radius.md,
    paddingVertical: 15, alignItems: 'center',
  },
  applyBtnText: { color: Colors.white, fontSize: 15, fontWeight: '600' },
});
