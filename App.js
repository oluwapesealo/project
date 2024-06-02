import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from "react-redux";
import Store from "./context/store";
import { SplashScreen, LoginScreen, SignUpScreen, HomeScreen, CalendarScreen, MessagesScreen, ProfileScreen, FavouritesScreen, AddToChatScreen, ChatScreen } from "./screens";
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
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
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#2F3B6A',
      inactiveTintColor: 'gray',
      headerShown: false,
    }}
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="AddToChatScreen" component={AddToChatScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App;
