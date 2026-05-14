import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import { RootStackParams } from './types';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ScannerScreen from '../screens/ScannerScreen';

const Stack = createNativeStackNavigator<RootStackParams>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        <Stack.Screen name='Scanner' component={ScannerScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
