import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import RouteDetailScreen from '../screens/RouteDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DestinationScreen from '../screens/DestinationScreen';
import AddRouteScreen from '../screens/AddRouteScreen';
import ItineraryScreen from '../screens/ItineraryScreen';

type RootStackParamList = {
  HomeTab: undefined;
  RouteDetail: { routeId: string };
};

type TabParamList = {
  Home: undefined;
  Itinerary: undefined;
  Add: undefined;
  Destination: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2D63FF',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            // @ts-ignore
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Itinerary"
        component={ItineraryScreen}
        options={{
          tabBarLabel: 'Rotalarım',
          tabBarIcon: ({ color, size }) => (
            // @ts-ignore
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddRouteScreen}
        options={{
          tabBarLabel: 'Rota Ekle',
          tabBarIcon: ({ color, size }) => (
            // @ts-ignore
            <MaterialIcons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Destination"
        component={DestinationScreen}
        options={{
          tabBarLabel: 'Keşfet',
          tabBarIcon: ({ color, size }) => (
            // @ts-ignore
            <MaterialIcons name="explore" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            // @ts-ignore
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTab" component={TabNavigator} />
        <Stack.Screen name="RouteDetail" component={RouteDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 