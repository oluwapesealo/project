import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { Login, Logo } from '../assets';

const HomeScreen = () => {
  const user = useSelector(state => state.user.user)
  console.log("Logged User: ", user);
  return (
    <View classname ="flex-1">
        <SafeAreaView>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 }}>

          <Image source={Logo} 
          style={{ 
          width: 60, 
          height: 60 }} 
          resizeMode="contain" />
          <TouchableOpacity style={{ 
            width: 26, 
            height: 26, 
            borderRadius: 24, 
            borderWidth: 1, 
            borderColor: 'blue', // replace 'blue' with your primary color
            alignItems: 'center', 
            justifyContent: 'center',
            paddingHorizontal: 25
          }}>
          <Image source={Login} 
          style={{ 
          width: 60, 
          height: 48 }} 
          resizeMode="cover" />
          </TouchableOpacity>

          </View>
          <ScrollView style={{
             width: '100%',
             paddingHorizontal: 16,
             paddingTop: 16,
          }}>

          </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default HomeScreen