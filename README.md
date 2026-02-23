# TESNIM Mobile App

Customer-facing e-commerce app for TESNIM Home & Living.
Built with React Native + Expo. Connects to the TESNIM PHP API.

---

## 📱 Features

- Browse products by category
- Search products
- Product detail with images
- Add to cart / wishlist
- Customer registration & login (English + Macedonian)
- Checkout with cash on delivery
- Order history & tracking with status timeline
- Profile management & language switcher

---

## 🚀 Quick Start (Run on your phone in 5 minutes)

### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version)

### Step 2 — Install Expo CLI
Open terminal and run:
```bash
npm install -g expo-cli
```

### Step 3 — Install app dependencies
Navigate to this folder and run:
```bash
npm install
```

### Step 4 — Install Expo Go on your phone
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iPhone: https://apps.apple.com/app/expo-go/id982107779

### Step 5 — Start the app
```bash
npm start
```

This opens a QR code in your terminal. Scan it with:
- **Android**: The Expo Go app
- **iPhone**: The Camera app

The app will load on your phone instantly! 🎉

---

## ⚙️ Configuration

### Change API URL
If you move to a new hosting provider, open:
```
src/services/api.js
```
And update:
```js
export const API_BASE_URL = 'https://your-new-domain.com/tesnim/api/index.php';
```
That's the only change needed.

---

## 📂 Project Structure

```
tesnim-app/
├── App.js                          ← Entry point
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js           ← Home with featured products & categories
│   │   ├── ShopScreen.js           ← Product catalog with filters & search
│   │   ├── ProductDetailScreen.js  ← Single product view
│   │   ├── CartScreen.js           ← Shopping cart
│   │   ├── CheckoutScreen.js       ← Checkout form (cash on delivery)
│   │   ├── OrderScreens.js         ← Orders list, detail & success screen
│   │   ├── AuthScreen.js           ← Login & Register
│   │   └── ProfileScreen.js        ← Profile, language switcher, logout
│   ├── components/
│   │   ├── UI.js                   ← Reusable components (Button, Input, ProductCard...)
│   │   └── theme.js                ← Colors, Typography, Spacing
│   ├── context/
│   │   └── AppContext.js           ← Global state (cart, auth, language)
│   ├── services/
│   │   └── api.js                  ← All API calls
│   ├── i18n/
│   │   └── translations.js         ← English + Macedonian translations
│   └── navigation/
│       └── AppNavigator.js         ← Screen navigation setup
```

---

## 📦 Publishing to App Stores

When you're ready to publish:

### Android (Google Play)
```bash
npx expo build:android
```

### iOS (App Store) — requires a Mac
```bash
npx expo build:ios
```

Or use Expo's cloud build service (no Mac needed):
```bash
npx eas build --platform all
```

---

## 🔗 API Endpoints Used

| Screen | Endpoint |
|--------|----------|
| Home | GET /products/featured, GET /categories |
| Shop | GET /products (with filters) |
| Product | GET /products/{id} |
| Search | GET /products/search?q= |
| Auth | POST /auth/login, POST /auth/register |
| Cart → Checkout | POST /orders |
| Orders | GET /orders, GET /orders/{id} |
| Cancel | PUT /orders/{id}/cancel |
| Profile | GET /profile, PUT /profile |
