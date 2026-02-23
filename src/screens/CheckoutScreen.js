import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { ordersApi } from '../services/api';
import { Button, Input, Divider } from '../components/UI';
import { Colors, Spacing, Typography, Radius, Shadow } from '../components/theme';

export default function CheckoutScreen({ navigation }) {
  const { t, cart, cartTotal, token, customer, clearCart } = useApp();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name:  customer?.name?.split(' ')[0] || '',
    last_name:   customer?.name?.split(' ').slice(1).join(' ') || '',
    email:       customer?.email || '',
    phone:       customer?.phone || '',
    address:     '',
    city:        '',
    postal_code: '',
    country:     'Macedonia',
    notes:       '',
  });
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.last_name.trim())  e.last_name  = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.address.trim())    e.address    = 'Required';
    if (!form.city.trim())       e.city       = 'Required';
    if (!form.postal_code.trim())e.postal_code= 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    const orderData = {
      ...form,
      items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
    };

    const res = await ordersApi.place(token, orderData);
    setLoading(false);

    if (res.success) {
      clearCart();
      navigation.reset({
        index: 0,
        routes: [{ name: 'OrderSuccess', params: { order: res.order } }],
      });
    } else {
      Alert.alert('Error', res.message || t('error'));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('checkoutTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Delivery Info */}
        <Text style={styles.sectionTitle}>{t('deliveryInfo').toUpperCase()}</Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Input label={t('firstName')} value={form.first_name}
              onChangeText={v => update('first_name', v)} error={errors.first_name} />
          </View>
          <View style={styles.half}>
            <Input label={t('lastName')} value={form.last_name}
              onChangeText={v => update('last_name', v)} error={errors.last_name} />
          </View>
        </View>

        <Input label={t('email')} value={form.email}
          onChangeText={v => update('email', v)} error={errors.email}
          keyboardType="email-address" autoCapitalize="none" />

        <Input label={t('phone')} value={form.phone}
          onChangeText={v => update('phone', v)}
          keyboardType="phone-pad" />

        <Input label={t('address')} value={form.address}
          onChangeText={v => update('address', v)} error={errors.address} />

        <View style={styles.row}>
          <View style={styles.half}>
            <Input label={t('city')} value={form.city}
              onChangeText={v => update('city', v)} error={errors.city} />
          </View>
          <View style={styles.half}>
            <Input label={t('postalCode')} value={form.postal_code}
              onChangeText={v => update('postal_code', v)} error={errors.postal_code}
              keyboardType="numeric" />
          </View>
        </View>

        <Input label={t('country')} value={form.country}
          onChangeText={v => update('country', v)} />

        <Input label={t('orderNotes')} value={form.notes}
          onChangeText={v => update('notes', v)}
          multiline numberOfLines={3}
          style={{ height: 80 }} />

        <Divider />

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>{t('paymentMethod').toUpperCase()}</Text>
        <View style={styles.paymentCard}>
          <View style={styles.paymentDot} />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>{t('cashOnDelivery')}</Text>
            <Text style={styles.paymentDesc}>{t('cashOnDeliveryDesc')}</Text>
          </View>
          <Text style={styles.paymentCheck}>✓</Text>
        </View>

        <Divider />

        {/* Order Summary */}
        <Text style={styles.sectionTitle}>{t('orderSummary').toUpperCase()}</Text>
        {cart.map(item => (
          <View key={item.product_id} style={styles.summaryItem}>
            <Text style={styles.summaryItemName} numberOfLines={1}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.summaryItemPrice}>
              {(item.price * item.quantity).toLocaleString('mk-MK')} ден
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('total')}</Text>
          <Text style={styles.totalValue}>{cartTotal.toLocaleString('mk-MK')} ден</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title={`${t('placeOrder')} · ${cartTotal.toLocaleString('mk-MK')} ден`}
          onPress={handlePlaceOrder}
          loading={loading}
        />
      </View>
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
  backBtn:     { width: 40, height: 40, justifyContent: 'center' },
  backBtnText: { fontSize: 22, color: Colors.black },
  title:       { ...Typography.h3 },
  scroll:      { flex: 1, padding: Spacing.lg },
  sectionTitle:{ ...Typography.labelB, letterSpacing: 1.5, color: Colors.gray400, marginBottom: Spacing.md },

  row:  { flexDirection: 'row', gap: Spacing.md },
  half: { flex: 1 },

  paymentCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray100, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.lg,
    borderWidth: 1.5, borderColor: Colors.black,
  },
  paymentDot:  { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.black, marginRight: Spacing.md },
  paymentInfo: { flex: 1 },
  paymentTitle:{ fontSize: 15, fontWeight: '600', color: Colors.black },
  paymentDesc: { fontSize: 13, color: Colors.gray500, marginTop: 2 },
  paymentCheck:{ fontSize: 18, fontWeight: '700', color: Colors.black },

  summaryItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  summaryItemName:  { flex: 1, fontSize: 14, color: Colors.gray600, marginRight: Spacing.sm },
  summaryItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.black },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
    marginTop: Spacing.md, paddingTop: Spacing.md,
    borderTopWidth: 2, borderTopColor: Colors.black,
  },
  totalLabel: { ...Typography.h4 },
  totalValue: { fontSize: 22, fontWeight: '800', color: Colors.black },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border,
    padding: Spacing.lg, paddingBottom: 28, ...Shadow.lg,
  },
});
