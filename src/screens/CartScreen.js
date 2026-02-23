import React from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Button, EmptyState, Divider } from '../components/UI';
import { Colors, Spacing, Typography, Radius, Shadow } from '../components/theme';

export default function CartScreen({ navigation }) {
  const { t, cart, cartTotal, removeFromCart, updateQuantity, isLoggedIn } = useApp();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigation.navigate('Auth', { screen: 'Login', params: { returnTo: 'Checkout' } });
    } else {
      navigation.navigate('Checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('myCart')}</Text>
        </View>
        <EmptyState
          icon="🛒"
          title={t('emptyCart')}
          subtitle={t('emptyCartSub')}
          actionLabel={t('startShopping')}
          onAction={() => navigation.navigate('Shop')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('myCart')}</Text>
        <Text style={styles.count}>{cart.length} {t('items').toLowerCase()}</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={i => i.product_id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {item.image
              ? <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
              : <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
                  <Text style={{ fontSize: 10, color: Colors.gray300, fontWeight: '700', letterSpacing: 1 }}>IMG</Text>
                </View>
            }
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price.toLocaleString('mk-MK')} ден</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemTotal}>
                {(item.price * item.quantity).toLocaleString('mk-MK')} ден
              </Text>
              <TouchableOpacity
                onPress={() => removeFromCart(item.product_id)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
              <Text style={styles.summaryValue}>{cartTotal.toLocaleString('mk-MK')} ден</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('shipping')}</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>{t('freeShipping')}</Text>
            </View>
            <Divider />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>{t('total')}</Text>
              <Text style={styles.totalValue}>{cartTotal.toLocaleString('mk-MK')} ден</Text>
            </View>
          </View>
        }
      />

      <View style={styles.bottomBar}>
        <Button
          title={`${t('checkout')} · ${cartTotal.toLocaleString('mk-MK')} ден`}
          onPress={handleCheckout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  title: { ...Typography.h2 },
  count: { ...Typography.body, color: Colors.gray400 },
  list:  { padding: Spacing.lg, paddingBottom: 120 },

  cartItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  itemImage: {
    width: 80, height: 80, borderRadius: Radius.md,
    backgroundColor: Colors.gray100, marginRight: Spacing.md,
  },
  itemImagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  itemName:  { fontSize: 14, fontWeight: '500', color: Colors.black, lineHeight: 19, marginBottom: 4 },
  itemPrice: { ...Typography.bodyS, color: Colors.gray500, marginBottom: Spacing.sm },
  qtyRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  qtyBtn: {
    width: 28, height: 28, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, color: Colors.black, fontWeight: '300' },
  qtyValue:   { fontSize: 15, fontWeight: '600', color: Colors.black, minWidth: 20, textAlign: 'center' },

  itemRight:   { alignItems: 'flex-end', justifyContent: 'space-between', height: 80 },
  itemTotal:   { fontSize: 15, fontWeight: '700', color: Colors.black },
  removeBtn:   { padding: 4 },
  removeBtnText: { fontSize: 14, color: Colors.gray400 },

  summary: {
    backgroundColor: Colors.gray100, borderRadius: Radius.lg,
    padding: Spacing.lg, marginTop: Spacing.lg,
  },
  summaryRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  summaryLabel:{ ...Typography.body, color: Colors.gray500 },
  summaryValue:{ fontSize: 15, fontWeight: '500', color: Colors.black },
  totalLabel:  { ...Typography.h4 },
  totalValue:  { fontSize: 20, fontWeight: '800', color: Colors.black },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border,
    padding: Spacing.lg, paddingBottom: 28, ...Shadow.lg,
  },
});
