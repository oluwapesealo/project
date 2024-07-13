import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from "react-redux";
import Store from "./context/store";
import { SplashScreen, LoginScreen, SignUpScreen, HomeScreen, CalendarScreen, MessagesScreen, ProfileScreen, FavouritesScreen, AddToChatScreen, ChatScreen, PostScreen, PostingScreen, EventScreen, DashboardScreen, DashboardEvents } from "./screens";
import { Ionicons } from '@expo/vector-icons';
import { MenuProvider } from 'react-native-popup-menu';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = 'grid';
      } else if (route.name === 'Calendar') {
        iconName = 'calendar';
      } else if (route.name === 'Messages') {
        iconName = 'chatbubbles';
      } else if (route.name === 'Profile') {
        iconName = 'person';
      } else if (route.name === 'Favourites') {
        iconName = 'star';
      } else if (route.name === 'Post') {
        iconName = 'send';
      } else if (route.name === 'Dashboard') {
        iconName = 'tv-outline';
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#2F3B6A',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: {
      display: 'flex',
    },
  })}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Calendar" component={CalendarScreen} />
  <Tab.Screen name="Messages" component={MessagesScreen} />
  <Tab.Screen name="Favourites" component={FavouritesScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
);

const App = () => {
  return (
    <Provider store={Store}>
      <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="AddToChatScreen" component={AddToChatScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="EventScreen" component={EventScreen} />
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
          <Stack.Screen name="DashboardEvents" component={DashboardEvents} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
      </MenuProvider>
    </Provider>
  )
}

export default App;