import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DashboardScreen, PostScreen } from '../screens';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    
      <Drawer.Navigator initialRouteName="Dashboard">
        <Drawer.Screen name="Dashboard" component={DashboardScreen} />
        <Drawer.Screen name="Post Menu" component={PostScreen} />
      </Drawer.Navigator>
    
  );
};

export default DrawerNavigator;
