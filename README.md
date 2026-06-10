
# CalorAI

A React Native + Expo app for food preference discovery.

## Project Overview

CalorAI lets users swipe through a stack of food cards to discover taste preferences — like for food! Tap ❤️ to like, ❌ to dislike, or swipe left/right. Results show top cuisines and preferences based on swipes.

## Project Structure

```
calorai/
├── assets/
│   ├── icons/
│   │   ├── carrot.svg
│   │   ├── cross.svg
│   │   ├── heart.svg
│   │   ├── home.svg
│   │   ├── question.svg
│   │   ├── search.svg
│   │   └── star.svg
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   ├── android-icon-monochrome.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── components/
│   │   ├── ActionButton.tsx
│   │   ├── BackgroundBlobs.tsx
│   │   ├── BottomNav.tsx
│   │   ├── CardStack.tsx
│   │   ├── FoodCard.tsx
│   │   ├── GlassCard.tsx
│   │   └── ProgressBar.tsx
│   ├── constants/
│   │   └── index.ts
│   ├── data/
│   │   ├── Food.json
│   │   └── index.ts
│   ├── screens/
│   │   ├── FAQScreen.tsx
│   │   ├── IntroScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   └── SwipeScreen.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── declarations.d.ts
├── .gitignore
├── app.json
├── babel.config.js
├── index.ts
├── metro.config.js
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Setup/Installation Instructions

> **Requires [Expo Go](https://expo.dev/client) installed on your physical device (iOS or Android), or a simulator/emulator.**

```bash
# 1. Clone the repo
git clone https://github.com/pankajyadav2006/calorai.git
cd calorai

# 2. Install dependencies
npm install

# 3. Start the Metro bundler
npx expo start
```

Then:
- **iOS** — Press `i` to open in the iOS Simulator, or scan the QR with the **Camera app** on a real device
- **Android** — Press `a` to open in an Android Emulator, or scan the QR with the **Expo Go** app on a real device

## Libraries Used and Why

| Library | Version | Why |
|---|---|---|
| `expo` | ~54.0.35 | Managed workflow foundation — handles native builds, OTA updates, and Expo Go compatibility without ejecting |
| `react-navigation/native` + `native-stack` | ^7.x | Drives the Intro → Swipe → Results → FAQ flow. Native stack chosen specifically to get OS-level screen transitions with zero JS thread overhead |
| `expo-linear-gradient` | ~15.0.8 | Does the heavy lifting for the glassmorphism look — gradient borders create the shimmer/glow effect, dark fills simulate frosted glass. Chosen over BlurView because blur rendering is broken in Expo Go on Android |
| `expo-blur` | ~15.0.8 | Kept as a dormant import for future reference; not actively rendered. All blur-like visuals are handled by LinearGradient for consistent cross-platform output |
| `expo-haptics` | ~15.0.8 | Adds physical weight to swipe decisions — Medium impact on like/superlike, Light on dislike/unsure. Small detail that makes the gesture feel intentional |
| `react-native-svg` | 15.12.1 | All UI icons (home, heart, star, cross, question, carrot, search) are custom SVGs rendered as true vectors — sharp at every DPI, no raster scaling artifacts |
| `react-native-svg-transformer` | ^1.5.3 | Patches Metro's bundler to treat .svg files as React components — lets icons import like import HeartIcon from './heart.svg' instead of managing URI strings |
| `react-native-gesture-handler` | ~2.28.0 | Required by React Navigation for its gesture context. Note: swipe logic uses native PanResponder instead — RNGH's onStartShouldSetPanResponder had conflict issues in this setup |
| `react-native-reanimated` | ~3.16.7 | Peer dep for navigation animations. Pinned to 3.16.7 — Reanimated 4.x drops Expo SDK 54 / Expo Go support, so upgrading here would break the managed workflow |
| `react-native-safe-area-context` | ~5.6.0 | Insets notches, Dynamic Islands, and home indicators into layout calculations — prevents UI from being clipped on modern iOS and Android devices |
| `react-native-screens` | ~4.16.0 | Replaces JS-based screen containers with native UIViewController / Fragment equivalents, reducing memory overhead and improving transition smoothness |
| `TypeScript` | ~5.9.2 | Typed end-to-end — food data shape, navigation param lists, swipe result state, and component props all have explicit interfaces. Catches mismatches at compile time rather than at runtime on device |

## Assumptions and Trade-Offs

| Decision | Reasoning |
|---|---|
| **No `BlurView` on cards** | expo-blur renders correctly on iOS but falls back to a solid dark box on Android within Expo Go — no graceful degradation, just a broken UI. LinearGradient replicates the frosted-glass look with identical output on both platforms |
| **`globalResults` mutable array** | Passing swipe results through React Navigation params would mean carrying state across every screen transition and handling it on both ends. A module-level array lets ResultsScreen read the final profile directly — no param threading, no re-navigation |
| **`PanResponder` instead of Gesture Handler** | react-native-gesture-handler needs a GestureHandlerRootView at the tree root and had silent conflicts in specific Expo Go versions where onStartShouldSetPanResponder would never fire. Switching to React Native's built-in PanResponder removed the wrapper requirement and made gesture detection consistent |
| **Expo SDK 54 (pinned)** | SDK 55+ depends on a newer Expo Go client that isn't universally installed. Pinning to 54 means anyone scanning the QR code gets a working app immediately — no "please update Expo Go" friction |
| **Static food data via JSON** | A taste profile tool doesn't need a backend. Food.json ships with the bundle, loads instantly, and keeps the data layer completely offline — no fetch overhead, no loading states, no failure cases |
| **`forwardRef` on FoodCard** | The action bar buttons (Cross, Heart, Star, Question) live outside the card component but need to trigger a swipe on the top card directly. forwardRef + useImperativeHandle exposes a single triggerSwipe() method — no state lift, no prop drilling |
| **Dynamic card height in ResultsScreen** | The swipeable food category carousel uses `onLayout` to measure each slide's true height, then `scrollX.interpolate()` to animate the container height as you swipe — avoids both a fixed min-height and jarring layout jumps |

## Platform Differences Between iOS and Android

- **Blur effects**: Used `expo-blur` on iOS, `expo-linear-gradient` as a glassmorphism fallback on Android
- **Z-index handling**: Adjusted card stack z-index values to ensure consistent layering across both platforms
- **Swipe behavior**: Verified PanResponder and gesture handler logic works consistently on both OS
- **Safe area insets**: Used `react-native-safe-area-context` to handle notch/edge differences

## Time Breakdown

| Task                                  | Time Spent |
|---------------------------------------|------------|
| Project setup + initial structure     | 1 hour     |
| Card stack component + swipe logic    | 2 hours    |
| Screens (Intro, Swipe, Results)       | 1.5 hours  |
| Animations + glassmorphism styling    | 1.5 hours  |
| Platform fallbacks + QA               | 1 hour     |
| **Total**                             | **7 hours**|

## AI Tools Used

### Tools

| Tool               | Usage Scope                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| TRAE               | Primary development tool (most heavy lifting)                               |
| Cursor / Copilot   | Minor boilerplate (StyleSheet blocks, TypeScript interface stubs)           |

### Where it actually mattered

- Scaffolded components quickly to get the app structure up and running early
- Implemented PanResponder gesture logic for the swipeable card stack
- Set up LinearGradient glassmorphism as a BlurView workaround for Android
- Got scrollX.interpolate() working right for dynamic carousel height in results
- Used forwardRef + useImperativeHandle for programmatic swipes and undo
- Helped debug z-index ordering issues in the card stack

