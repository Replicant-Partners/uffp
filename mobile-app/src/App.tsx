import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './screens/HomeScreen';
import { ForecastDetailScreen } from './screens/ForecastDetailScreen';
import { ForecastConfig } from './types';

export type RootStackParamList = {
  Home: undefined;
  ForecastDetail: { config: ForecastConfig };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f3460',
          },
          headerTintColor: '#1aff92',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForecastDetail"
          component={ForecastDetailScreen}
          options={{ title: 'Forecast Analysis' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
