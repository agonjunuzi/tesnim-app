import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen        from '../screens/HomeScreen';
import ShopScreen        from '../screens/ShopScreen';
import CartScreen        from '../screens/CartScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen    from '../screens/CheckoutScreen';
import AuthScreen        from '../screens/AuthScreen';
import ProfileScreen     from '../screens/ProfileScreen';
import {
  OrdersScreen, OrderDetailScreen, OrderSuccessScreen,
} from '../screens/OrderScreens';

import { useApp } from '../context/AppContext';
import { Colors, Typography } from '../components/theme';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ---- Tab Icon ----
function TabIcon({ emoji, label, focused, badge }) {
  return (
    <View style={tabStyles.wrap}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
      {badge > 0 && (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrap:  { alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  label: { fontSize: 10, color: Colors.gray400, marginTop: 2, fontWeight: '500' },
  labelActive: { color: Colors.black, fontWeight: '700' },
  badge: {
    position: 'absolute', top: -2, right: -8,
    backgroundColor: Colors.black, borderRadius: 8,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  badgeText: { color: Colors.white, fontSize: 9, fontWeight: '700' },
});

// ---- Bottom Tabs ----
function TabNavigator() {
  const { t, cartCount } = useApp();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label={t('home')} focused={focused} /> }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label={t('shop')} focused={focused} /> }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛒" label={t('cart')} focused={focused} badge={cartCount} /> }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📦" label={t('orders')} focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label={t('profile')} focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

// ---- Root Stack ----
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main"          component={TabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Checkout"      component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess"  component={OrderSuccessScreen} />
        <Stack.Screen name="OrderDetail"   component={OrderDetailScreen} />
        <Stack.Screen name="Auth"          component={AuthScreen}
          options={{ presentation: 'modal' }} />
        <Stack.Screen name="Wishlist"      component={WishlistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ---- Simple Wishlist Screen ----
function WishlistScreen({ navigation }) {
  const { t, wishlist, toggleWishlist, addToCart } = useApp();
  const { FlatList, TouchableOpacity, Image } = require('react-native');
  const { ProductCard, EmptyState } = require('../components/UI');
  const { Spacing } = require('../components/theme');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={{
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: Colors.border,
        flexDirection: 'row', alignItems: 'center',
      }}>
        <Text onPress={() => navigation.goBack()} style={{ fontSize: 22, marginRight: 16 }}>←</Text>
        <Text style={Typography.h3}>{t('myWishlist')}</Text>
      </View>

      {wishlist.length === 0
        ? <EmptyState icon="❤️" title={t('emptyWishlist')} subtitle={t('emptyWishlistSub')} />
        : (
          <FlatList
            data={wishlist}
            keyExtractor={i => i.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: Spacing.md }}
            contentContainerStyle={{ padding: Spacing.md }}
            renderItem={({ item }) => (
              <View style={{ width: '48.5%', marginBottom: Spacing.md }}>
                <ProductCard
                  product={item}
                  t={t}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                  onAddToCart={() => addToCart(item)}
                />
              </View>
            )}
          />
        )
      }
    </View>
  );
}
