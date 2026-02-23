import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { profileApi } from '../services/api';
import { Button, Input, Divider } from '../components/UI';
import { Colors, Spacing, Typography, Radius } from '../components/theme';

export default function ProfileScreen({ navigation }) {
  const { t, customer, token, isLoggedIn, logoutUser, language, switchLanguage } = useApp();
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState(customer?.name || '');
  const [phone, setPhone]       = useState(customer?.phone || '');
  const [loading, setLoading]   = useState(false);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}><Text style={styles.title}>{t('profile')}</Text></View>
        <View style={styles.guestWrap}>
          <Text style={styles.guestIcon}>👤</Text>
          <Text style={styles.guestTitle}>Hello!</Text>
          <Text style={styles.guestSub}>Login to access your profile, orders and wishlist</Text>
          <Button title={t('login')} onPress={() => navigation.navigate('Auth')} style={{ marginBottom: Spacing.md }} />
          <Button title={t('register')} onPress={() => navigation.navigate('Auth', { mode: 'register' })} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    const res = await profileApi.update(token, { name, phone });
    setLoading(false);
    if (res.success) { setEditing(false); Alert.alert('', t('profileUpdated')); }
    else Alert.alert('Error', res.message);
  };

  const handleLogout = () => {
    Alert.alert(t('logout'), 'Are you sure?', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('logout'), style: 'destructive', onPress: logoutUser },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('myProfile')}</Text>
        {!editing && (
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Text style={styles.editBtn}>{t('editProfile')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(customer?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          {editing ? (
            <View style={styles.editForm}>
              <Input label={t('fullName')} value={name} onChangeText={setName} />
              <Input label={t('phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <View style={styles.editBtns}>
                <Button title={t('save')} onPress={handleSave} loading={loading} style={{ flex: 1 }} />
                <Button title={t('cancel')} onPress={() => setEditing(false)} variant="outline" style={{ flex: 1 }} />
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.profileName}>{customer?.name}</Text>
              <Text style={styles.profileEmail}>{customer?.email}</Text>
              {customer?.phone && <Text style={styles.profilePhone}>{customer.phone}</Text>}
            </>
          )}
        </View>

        <Divider style={{ marginHorizontal: Spacing.lg }} />

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('accountSettings').toUpperCase()}</Text>
          <MenuItem icon="📦" label={t('myOrders')} onPress={() => navigation.navigate('Orders')} />
          <MenuItem icon="❤️" label={t('myWishlist')} onPress={() => navigation.navigate('Wishlist')} />
        </View>

        <Divider style={{ marginHorizontal: Spacing.lg }} />

        {/* Language */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('appLanguage').toUpperCase()}</Text>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
              onPress={() => switchLanguage('en')}
            >
              <Text style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}>
                🇬🇧 English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'mk' && styles.langBtnActive]}
              onPress={() => switchLanguage('mk')}
            >
              <Text style={[styles.langBtnText, language === 'mk' && styles.langBtnTextActive]}>
                🇲🇰 Македонски
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Divider style={{ marginHorizontal: Spacing.lg }} />

        <View style={[styles.menuSection, { paddingBottom: Spacing.xxl }]}>
          <MenuItem icon="🚪" label={t('logout')} onPress={handleLogout} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  title:   { ...Typography.h2 },
  editBtn: { fontSize: 14, fontWeight: '600', color: Colors.accent },

  profileCard: { alignItems: 'center', padding: Spacing.xl },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText:    { fontSize: 30, fontWeight: '700', color: Colors.white },
  profileName:   { ...Typography.h3, marginBottom: 4 },
  profileEmail:  { ...Typography.body, color: Colors.gray400 },
  profilePhone:  { ...Typography.bodyS, color: Colors.gray400, marginTop: 2 },
  editForm:      { width: '100%', gap: 0 },
  editBtns:      { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },

  menuSection:      { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  menuSectionTitle: { ...Typography.labelB, letterSpacing: 1.5, color: Colors.gray400, marginBottom: Spacing.sm },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  menuIcon:  { fontSize: 18, marginRight: Spacing.md, width: 26 },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.black },
  menuArrow: { fontSize: 20, color: Colors.gray300 },

  langRow: { flexDirection: 'row', gap: Spacing.sm },
  langBtn: {
    flex: 1, paddingVertical: 12, borderRadius: Radius.md,
    alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border,
  },
  langBtnActive:    { borderColor: Colors.black, backgroundColor: Colors.black },
  langBtnText:      { fontSize: 14, fontWeight: '500', color: Colors.gray600 },
  langBtnTextActive:{ color: Colors.white, fontWeight: '600' },

  guestWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  guestIcon:  { fontSize: 52, marginBottom: Spacing.lg },
  guestTitle: { ...Typography.h2, marginBottom: Spacing.sm },
  guestSub:   { ...Typography.body, textAlign: 'center', color: Colors.gray400, marginBottom: Spacing.xl },
});
