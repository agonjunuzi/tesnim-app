import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { ordersApi } from '../services/api';
import { Button, EmptyState, LoadingScreen, Divider } from '../components/UI';
import { Colors, Spacing, Typography, Radius, Shadow } from '../components/theme';

// ============================================================
//  Order Success Screen
// ============================================================
export function OrderSuccessScreen({ navigation, route }) {
  const { t } = useApp();
  const { order } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>✓</Text>
        </View>
        <Text style={styles.successTitle}>{t('orderPlaced')}</Text>
        <Text style={styles.successSub}>{t('orderPlacedSub')}</Text>

        <View style={styles.orderCard}>
          <Text style={styles.orderCardLabel}>ORDER NUMBER</Text>
          <Text style={styles.orderCardNumber}>{order.order_number}</Text>
          <View style={styles.orderCardRow}>
            <Text style={styles.orderCardKey}>{t('total')}</Text>
            <Text style={styles.orderCardValue}>{order.total?.toLocaleString('mk-MK')} ден</Text>
          </View>
          <View style={styles.orderCardRow}>
            <Text style={styles.orderCardKey}>{t('paymentMethod')}</Text>
            <Text style={styles.orderCardValue}>{t('cashOnDelivery')}</Text>
          </View>
        </View>

        <Button
          title={t('myOrders')}
          onPress={() => navigation.navigate('Orders')}
          style={{ marginBottom: Spacing.md }}
        />
        <Button
          title={t('startShopping')}
          onPress={() => navigation.navigate('Home')}
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
}

// ============================================================
//  Orders List Screen
// ============================================================
export function OrdersScreen({ navigation }) {
  const { t, token, isLoggedIn } = useApp();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    ordersApi.getAll(token).then(res => {
      if (res.success) setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}><Text style={styles.title}>{t('myOrders')}</Text></View>
        <EmptyState
          icon="📦"
          title="Login to view your orders"
          subtitle="Track and manage your purchases"
          actionLabel={t('login')}
          onAction={() => navigation.navigate('Auth')}
        />
      </SafeAreaView>
    );
  }

  if (loading) return <LoadingScreen />;

  const statusColors = {
    pending:    Colors.warning,
    confirmed:  Colors.info,
    processing: Colors.info,
    shipped:    Colors.accent,
    delivered:  Colors.success,
    cancelled:  Colors.error,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('myOrders')}</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="📦" title={t('noOrders')} subtitle={t('noOrdersSub')} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard2}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            activeOpacity={0.8}
          >
            <View style={styles.orderCardTop}>
              <Text style={styles.orderNumber}>#{item.order_number}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
                <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
                  {t(item.status)}
                </Text>
              </View>
            </View>
            <View style={styles.orderCardMid}>
              <Text style={styles.orderDate}>
                {new Date(item.created_at).toLocaleDateString('mk-MK')}
              </Text>
              <Text style={styles.orderItems}>{item.items_count} {t('items').toLowerCase()}</Text>
            </View>
            <View style={styles.orderCardBot}>
              <Text style={styles.orderTotal}>{item.total?.toLocaleString('mk-MK')} ден</Text>
              <Text style={styles.orderArrow}>→</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// ============================================================
//  Order Detail Screen
// ============================================================
export function OrderDetailScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { t, token } = useApp();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const loadOrder = () => {
    ordersApi.getById(token, orderId).then(res => {
      if (res.success) setOrder(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { loadOrder(); }, []);

  const handleCancel = async () => {
    setCancelling(true);
    const res = await ordersApi.cancel(token, orderId);
    if (res.success) loadOrder();
    setCancelling(false);
  };

  if (loading) return <LoadingScreen />;
  if (!order)  return <View style={styles.safe}><Text>Order not found</Text></View>;

  const statusColors = {
    pending: Colors.warning, confirmed: Colors.info,
    processing: Colors.info, shipped: Colors.accent,
    delivered: Colors.success, cancelled: Colors.error,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('orderDetails')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.detailScroll}>
        {/* Status */}
        <View style={styles.detailStatusWrap}>
          <Text style={styles.detailOrderNum}>#{order.order_number}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] + '20' }]}>
            <Text style={[styles.statusText, { color: statusColors[order.status] }]}>
              {t(order.status)}
            </Text>
          </View>
        </View>

        {/* Items */}
        <Text style={styles.detailSection}>{t('items').toUpperCase()}</Text>
        {order.items?.map((item, idx) => (
          <View key={idx} style={styles.detailItem}>
            <Text style={styles.detailItemName} numberOfLines={2}>{item.product_name}</Text>
            <Text style={styles.detailItemQty}>× {item.quantity}</Text>
            <Text style={styles.detailItemPrice}>{item.subtotal?.toLocaleString('mk-MK')} ден</Text>
          </View>
        ))}
        <Divider />

        {/* Totals */}
        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow2}>
            <Text style={styles.summaryLabel2}>{t('subtotal')}</Text>
            <Text style={styles.summaryValue2}>{order.subtotal?.toLocaleString('mk-MK')} ден</Text>
          </View>
          <View style={styles.summaryRow2}>
            <Text style={styles.summaryLabel2}>{t('shipping')}</Text>
            <Text style={[styles.summaryValue2, { color: Colors.success }]}>{t('freeShipping')}</Text>
          </View>
          <View style={[styles.summaryRow2, { marginTop: Spacing.sm }]}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.black }}>{t('total')}</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.black }}>
              {order.total?.toLocaleString('mk-MK')} ден
            </Text>
          </View>
        </View>

        {/* Delivery */}
        <Text style={styles.detailSection}>{t('deliveryAddress').toUpperCase()}</Text>
        <View style={styles.addressBlock}>
          <Text style={styles.addressText}>{order.shipping?.name}</Text>
          <Text style={styles.addressText}>{order.shipping?.address}</Text>
          <Text style={styles.addressText}>{order.shipping?.city}, {order.shipping?.postal_code}</Text>
          <Text style={styles.addressText}>{order.shipping?.country}</Text>
          {order.shipping?.phone && <Text style={styles.addressText}>{order.shipping.phone}</Text>}
        </View>

        {/* Status Timeline */}
        {order.status_history?.length > 0 && (
          <>
            <Text style={styles.detailSection}>{t('statusHistory').toUpperCase()}</Text>
            {order.status_history.map((h, i) => (
              <View key={i} style={styles.historyItem}>
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyStatus}>{t(h.status)}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(h.date).toLocaleString('mk-MK')}
                  </Text>
                  {h.notes && <Text style={styles.historyNotes}>{h.notes}</Text>}
                </View>
              </View>
            ))}
          </>
        )}

        {/* Cancel */}
        {order.can_cancel && (
          <Button
            title={t('cancelOrder')}
            onPress={handleCancel}
            loading={cancelling}
            variant="outline"
            style={{ marginTop: Spacing.lg, borderColor: Colors.error }}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { ...Typography.h3 },
  list:  { padding: Spacing.lg },

  // Success
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  successIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.black,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  successEmoji: { fontSize: 36, color: Colors.white },
  successTitle: { ...Typography.h2, textAlign: 'center', marginBottom: Spacing.sm },
  successSub:   { ...Typography.body, textAlign: 'center', color: Colors.gray400, marginBottom: Spacing.xl },
  orderCard: {
    backgroundColor: Colors.gray100, borderRadius: Radius.lg,
    padding: Spacing.lg, width: '100%', marginBottom: Spacing.xl,
  },
  orderCardLabel:  { ...Typography.labelB, letterSpacing: 2, color: Colors.gray400, marginBottom: 4 },
  orderCardNumber: { fontSize: 20, fontWeight: '800', color: Colors.black, marginBottom: Spacing.md },
  orderCardRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderCardKey:    { ...Typography.body, color: Colors.gray500 },
  orderCardValue:  { fontSize: 14, fontWeight: '600', color: Colors.black },

  // Orders list
  orderCard2: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  orderCardTop:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderNumber:   { fontSize: 14, fontWeight: '700', color: Colors.black },
  statusBadge:   { paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full },
  statusText:    { fontSize: 12, fontWeight: '600' },
  orderCardMid:  { flexDirection: 'row', gap: Spacing.md, marginBottom: 8 },
  orderDate:     { ...Typography.bodyS, color: Colors.gray400 },
  orderItems:    { ...Typography.bodyS, color: Colors.gray400 },
  orderCardBot:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotal:    { fontSize: 16, fontWeight: '700', color: Colors.black },
  orderArrow:    { color: Colors.gray400 },

  // Detail
  detailScroll: { padding: Spacing.lg },
  detailStatusWrap: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  detailOrderNum: { fontSize: 18, fontWeight: '800', color: Colors.black },
  detailSection:  { ...Typography.labelB, letterSpacing: 1.5, color: Colors.gray400, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  detailItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  detailItemName:  { flex: 1, fontSize: 14, color: Colors.black },
  detailItemQty:   { fontSize: 13, color: Colors.gray500, marginHorizontal: Spacing.sm },
  detailItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.black },

  summaryBlock: { backgroundColor: Colors.gray100, borderRadius: Radius.md, padding: Spacing.md, marginTop: Spacing.sm },
  summaryRow2:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel2:{ ...Typography.body, color: Colors.gray500 },
  summaryValue2:{ fontSize: 14, fontWeight: '500', color: Colors.black },

  addressBlock: { backgroundColor: Colors.gray100, borderRadius: Radius.md, padding: Spacing.md },
  addressText:  { fontSize: 14, color: Colors.black, marginBottom: 2 },

  historyItem: { flexDirection: 'row', marginBottom: Spacing.md },
  historyDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.black,
    marginRight: Spacing.md, marginTop: 4,
  },
  historyContent: { flex: 1 },
  historyStatus:  { fontSize: 14, fontWeight: '600', color: Colors.black },
  historyDate:    { fontSize: 12, color: Colors.gray400, marginTop: 2 },
  historyNotes:   { fontSize: 12, color: Colors.gray500, marginTop: 2 },
});
