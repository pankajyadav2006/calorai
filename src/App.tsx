import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import IntroScreen from './screens/IntroScreen';
import SwipeScreen from './screens/SwipeScreen';
import ResultsScreen from './screens/ResultsScreen';
import FAQScreen from './screens/FAQScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Intro"
          screenOptions={{ headerShown: false, animation: 'none' }}
        >
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Swipe" component={SwipeScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
