# DealFinder

DealFinder is a **data-driven React Native application** built with **Expo** and **TypeScript**.

The application demonstrates how a React Native client can retrieve data from a REST API, manage state, perform search, navigate between list and detail screens, support light/dark themes, handle safe areas, display a swipeable image gallery, and open external URLs.

## Features

- Deal list loaded from a REST API
- Search with debounce
- Reusable `DealCard` and `SearchBar` components
- Dynamic detail routes with Expo Router
- Light and dark theme support
- Safe-area aware screens
- Responsive layouts with `useWindowDimensions()`
- Swipeable deal image gallery
- Gesture handling with `PanResponder`
- React Native `Animated` API
- External links with `Linking`
- Web, Android, and iOS-oriented structure

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- React Hooks
- React Native Animated API
- PanResponder
- `react-native-safe-area-context`
- Fetch API

## Project Structure

```text
DealFinder/
│
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── deal/
│   │       └── [id].tsx
│   │
│   ├── components/
│   │   ├── deal/
│   │   │   ├── DealCard.tsx
│   │   │   └── ImageGallery.tsx
│   │   ├── ui/
│   │   │   └── SearchBar.tsx
│   │   ├── themed-text.tsx
│   │   └── themed-view.tsx
│   │
│   ├── constants/
│   │   └── theme.ts
│   │
│   ├── hooks/
│   │   └── use-theme-colors.ts
│   │
│   ├── services/
│   │   └── dealsApi.ts
│   │
│   ├── types/
│   │   └── deal.ts
│   │
│   └── utils/
│       └── price.ts
│
├── .env
├── app.json
├── package.json
└── tsconfig.json
```

# Getting Started After Cloning

Follow the steps below after downloading or cloning the repository.

## 1. Clone the repository

```bash
git clone https://github.com/BarkinAlper/DealFinder.git
```

Move into the project directory:

```bash
cd DealFinder
```

## 2. Install dependencies

Install the dependencies defined in `package.json`:

```bash
npm install
```

You do **not** need to reinstall Expo, Expo Router, React Native, or the other packages individually.

`npm install` installs the required packages automatically from `package.json` and `package-lock.json`.

## 3. Prepare the REST API

DealFinder requires the separate **DealFinderApi** project.

Clone the API repository in another directory:

```bash
git clone https://github.com/BarkinAlper/DealFinderApi.git
```

Then:

```bash
cd DealFinderApi
npm install
npm run dev
```

The API is expected to run on port `3000`.

Verify it in a browser:

```text
http://localhost:3000/api/deals
```

You should receive a JSON response containing the deal list.

The API supports:

```text
GET /api/deals
GET /api/deals?searchTerm=<term>
GET /api/deals/:id
```

## 4. Create the `.env` file

Create a file named:

```text
.env
```

in the DealFinder project root.

### Web browser on the same computer

If DealFinder and DealFinderApi are running on the same computer:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Physical Android or iOS device

When testing on a physical phone, do **not** use `localhost`.

Find the local IPv4 address of the computer running DealFinderApi.

On Windows:

```powershell
ipconfig
```

Look for the IPv4 address of the active Wi-Fi or Ethernet adapter.

Example:

```text
192.168.1.20
```

Then set:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.20:3000
```

The computer and mobile device should normally be connected to the same local network.

> Do not commit `.env` to Git.

A repository-friendly `.env.example` can contain:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000
```

## 5. Verify the API from a physical device

Before starting DealFinder on a phone, open the following address in the phone's browser:

```text
http://YOUR_LOCAL_IP:3000/api/deals
```

Example:

```text
http://192.168.1.20:3000/api/deals
```

If JSON data is displayed, the phone can reach the API.

If it does not work, check:

- DealFinderApi is running
- the phone and computer are on the same network
- the correct IPv4 address is being used
- port `3000` is not blocked by Windows Firewall
- DealFinderApi listens on `0.0.0.0`

The API server should use:

```ts
app.listen(PORT, "0.0.0.0", () => {
  console.log(`DealFinder API running on port ${PORT}`);
});
```

## 6. Start DealFinder

Return to the DealFinder directory:

```bash
cd DealFinder
```

Start Expo:

```bash
npx expo start
```

If you changed `.env`, upgraded Expo packages, or encounter a stale-cache issue, start with a clean Metro cache:

```bash
npx expo start --clear
```

## 7. Run on Web

From the Expo development terminal, open the web version.

The browser client should use:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

when the API runs on the same computer.

## 8. Run on Android or iOS

For a physical device:

1. Make sure DealFinderApi is running.
2. Make sure the phone can open `http://YOUR_LOCAL_IP:3000/api/deals`.
3. Make sure `.env` uses the computer's local IP address.
4. Start Expo.
5. Open the project on the device using the appropriate Expo development workflow.

Example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.20:3000
```

## 9. Test the Main Application Flow

After both projects are running, verify the following flow:

```text
DealFinderApi
     ↓
GET /api/deals
     ↓
DealFinder
     ↓
Deals list
     ↓
Search
     ↓
Select a deal
     ↓
/deal/[id]
     ↓
GET /api/deals/:id
     ↓
Deal Detail
```

Then test:

- deal cards are displayed
- search returns filtered results
- selecting a deal opens the detail screen
- multiple images can be swiped
- light/dark theme works
- the detail screen respects safe areas
- the external deal button opens the configured URL

## 10. Troubleshooting

### API request fails on a physical device

Do not use:

```text
http://localhost:3000
```

Use the computer's local IPv4 address:

```text
http://192.168.x.x:3000
```

### API works on the computer but not on the phone

Check Windows Firewall.

Example rule:

```powershell
netsh advfirewall firewall add rule name="DealFinder API 3000" dir=in action=allow protocol=TCP localport=3000
```

Verify that the API is listening:

```powershell
netstat -ano | findstr :3000
```

A working server should normally show:

```text
0.0.0.0:3000    LISTENING
```

### Environment variable changes are not applied

Restart Expo:

```bash
npx expo start --clear
```

### Web animation warning about `useNativeDriver`

React Native Web does not use the native animation driver.

The project should use platform-aware animation configuration, for example:

```ts
const useNativeDriver = Platform.OS !== "web";
```

### Web shows a multiple-renderers context warning

Do not manually add an extra `SafeAreaProvider` in the Expo Router root layout for this project.

The root layout should use the navigation/theme structure only, while screens can continue to use:

```ts
SafeAreaView;
```

from:

```text
react-native-safe-area-context
```

## Quick Setup

If Node.js is already installed, the basic setup is:

### Terminal 1 — API

```bash
git clone https://github.com/BarkinAlper/DealFinderApi.git
cd DealFinderApi
npm install
npm run dev
```

### Terminal 2 — React Native application

```bash
git clone https://github.com/BarkinAlper/DealFinder.git
cd DealFinder
npm install
```

Create:

```text
.env
```

with:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

for web development on the same computer, or:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000
```

for physical-device testing.

Then start Expo:

```bash
npx expo start
```

## Application Flow

```text
REST API
   ↓
dealsApi.ts
   ↓
React State
   ↓
Deal List
   ↓
Search / Selection
   ↓
Expo Router
   ↓
Deal Detail
   ↓
Image Gallery / External Link
```

## Navigation

Expo Router provides file-based navigation.

```text
src/app/index.tsx
        ↓
        /

src/app/deal/[id].tsx
        ↓
    /deal/:id
```

A deal is opened using a dynamic route:

```ts
router.push({
  pathname: "/deal/[id]",
  params: { id },
});
```

The detail screen reads the route parameter with:

```ts
const { id } = useLocalSearchParams<{ id: string }>();
```

## Theme Support

DealFinder supports light and dark themes using:

- `useColorScheme()`
- centralized theme colors
- `ThemeProvider`
- reusable themed components

## Safe Area

Screens use:

```ts
SafeAreaView;
```

from:

```text
react-native-safe-area-context
```

An additional manually-added `SafeAreaProvider` is not required in the current Expo Router root layout used by this project.

## Image Gallery

The detail screen contains a swipeable image gallery implemented with:

- `PanResponder`
- `Animated.Value`
- `translateX`
- swipe threshold logic
- boundary checks
- responsive width calculation
- platform-aware native-driver behavior

The gallery separates logical state from animation state:

```text
imageIndex
→ Which image is displayed?

imageXPosition
→ Where is the image currently positioned?
```

## External Links

External deal URLs are opened with React Native `Linking`:

```ts
await Linking.openURL(deal.url);
```

Expo Router is used for internal navigation, while `Linking` is used for external URLs.

## License

No license has been specified for this repository yet.
