import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';
import { Button, Input } from '../components/UI';
import { Colors, Spacing, Typography, Radius } from '../components/theme';

export default function AuthScreen({ navigation, route }) {
  const { t, loginUser } = useApp();
  const returnTo = route.params?.returnTo;
  const [mode, setMode] = useState(route.params?.mode || 'login');
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginForm, setLoginForm]     = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  // Register form
  const [regForm, setRegForm]     = useState({ name: '', email: '', password: '', phone: '' });
  const [regErrors, setRegErrors] = useState({});

  const handleLogin = async () => {
    const errors = {};
    if (!loginForm.email.trim())    errors.email    = 'Required';
    if (!loginForm.password.trim()) errors.password = 'Required';
    if (Object.keys(errors).length) { setLoginErrors(errors); return; }

    setLoading(true);
    const res = await authApi.login(loginForm.email, loginForm.password);
    setLoading(false);

    if (res.success) {
      await loginUser(res.token, res.customer);
      if (returnTo) navigation.navigate(returnTo);
      else navigation.goBack();
    } else {
      Alert.alert('Login Failed', res.message || t('error'));
    }
  };

  const handleRegister = async () => {
    const errors = {};
    if (!regForm.name.trim() || regForm.name.split(' ').length < 2)
      errors.name = 'First and last name required';
    if (!/\S+@\S+\.\S+/.test(regForm.email)) errors.email    = 'Valid email required';
    if (regForm.password.length < 6)          errors.password = 'Min 6 characters';
    if (Object.keys(errors).length) { setRegErrors(errors); return; }

    setLoading(true);
    const res = await authApi.register(regForm);
    setLoading(false);

    if (res.success) {
      await loginUser(res.token, res.customer);
      if (returnTo) navigation.navigate(returnTo);
      else navigation.goBack();
    } else {
      Alert.alert('Registration Failed', res.message || t('error'));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Brand */}
          <View style={styles.brand}>
            <Text style={styles.brandLabel}>HOME & LIVING</Text>
            <Text style={styles.brandName}>TESNIM</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, mode === 'login' && styles.tabActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                {t('login')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'register' && styles.tabActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                {t('register')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Form */}
          {mode === 'login' && (
            <View style={styles.form}>
              <Input
                label={t('email')}
                value={loginForm.email}
                onChangeText={v => setLoginForm(f => ({ ...f, email: v }))}
                error={loginErrors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <Input
                label={t('password')}
                value={loginForm.password}
                onChangeText={v => setLoginForm(f => ({ ...f, password: v }))}
                error={loginErrors.password}
                secureTextEntry
              />
              <Button title={t('login')} onPress={handleLogin} loading={loading} />
              <TouchableOpacity style={styles.switchBtn} onPress={() => setMode('register')}>
                <Text style={styles.switchText}>{t('noAccount')} </Text>
                <Text style={[styles.switchText, styles.switchLink]}>{t('register')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <View style={styles.form}>
              <Input
                label={t('fullName')}
                value={regForm.name}
                onChangeText={v => setRegForm(f => ({ ...f, name: v }))}
                error={regErrors.name}
                autoComplete="name"
              />
              <Input
                label={t('email')}
                value={regForm.email}
                onChangeText={v => setRegForm(f => ({ ...f, email: v }))}
                error={regErrors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                label={t('phone')}
                value={regForm.phone}
                onChangeText={v => setRegForm(f => ({ ...f, phone: v }))}
                keyboardType="phone-pad"
              />
              <Input
                label={t('password')}
                value={regForm.password}
                onChangeText={v => setRegForm(f => ({ ...f, password: v }))}
                error={regErrors.password}
                secureTextEntry
              />
              <Button title={t('register')} onPress={handleRegister} loading={loading} />
              <TouchableOpacity style={styles.switchBtn} onPress={() => setMode('login')}>
                <Text style={styles.switchText}>{t('haveAccount')} </Text>
                <Text style={[styles.switchText, styles.switchLink]}>{t('login')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, padding: Spacing.lg },
  header: { alignItems: 'flex-end', marginBottom: Spacing.lg },
  closeBtn:     { padding: 4 },
  closeBtnText: { fontSize: 20, color: Colors.gray500 },

  brand: { alignItems: 'center', marginBottom: Spacing.xl },
  brandLabel: { ...Typography.labelB, letterSpacing: 3, color: Colors.gray400, marginBottom: 4 },
  brandName:  { fontSize: 36, fontWeight: '800', letterSpacing: -1, color: Colors.black },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: Radius.md },
  tabActive:    { backgroundColor: Colors.black },
  tabText:      { fontSize: 14, fontWeight: '600', color: Colors.gray500 },
  tabTextActive:{ color: Colors.white },

  form: { gap: 0 },
  switchBtn: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg, padding: 4 },
  switchText: { fontSize: 14, color: Colors.gray500 },
  switchLink: { color: Colors.black, fontWeight: '600' },
});
