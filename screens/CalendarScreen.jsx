import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity  } from 'react-native';
import { useSelector } from 'react-redux';

import SCalendar from '../assets/Calendar';
const CalendarScreen = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{
      flex: 1,
    }}>
    
      <View style={{
          width: '100%',
          height: 50, // Adjust height as needed
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 8,
          position: 'relative'
        }}>
          <TouchableOpacity>
            <Entypo name='menu' size={28} resizeMode="contain" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#2F3B6A',
            }}>PAUBOARD</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
           
            <Ionicons name='person-outline' size={18} />
            
            <Text style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: 'bold',
              color: '#2F3B6A',
            }}>
              {user?.name ?? 'Alo Oluwapese'}
            </Text>
          </View>
          </TouchableOpacity>
        </View>
        <ScrollView>
    <SCalendar />
    
    </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;