import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  // const getDisplayName = () => {
  //   if (user && user.providerData && user.providerData.email) {
  //     const email = user.providerData.email;
  //     const atIndex = email.indexOf('@');
  //     if (atIndex !== -1) {
  //       const firstName = email.slice(0, atIndex);
  //       const surname = email.slice(atIndex + 1).split('.')[0]; // Assuming surname is before the domain extension
  //       return `${firstName} ${surname}`;
  //     }
  //   }
  //   return '';
  // };
  return (
    <SafeAreaView style={{
      flex:1,
      alignItems:'center',
      justifyContent: 'flex-start'
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
        
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#2F3B6A',
            }}>PAUBOARD</Text>
          </View>
          
        </View>
        <ScrollView>
      <View style ={{
        width:'100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingHorizontal : 16,
        paddingVertical: 16,
      }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name ='chevron-left' size={32} color={'#555'}/>

        </TouchableOpacity> */}
      </View>
      <View style={{ 
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 16 
      }}>
        <View style={{
          width: 100, 
          height: 100, 
          borderRadius: 32, 
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2, 
          borderColor: '#2F3B6A', 
          padding: 4
        }}>
          <Ionicons name="person" size={26} color="#FFFFFF" />
        </View>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', marginTop:10}}>
        <Text style={{fontSize:18}}>
        {/* {getDisplayName()} */}
        {user?.username}
        
          
        </Text>
        <Text style={{fontSize:18, marginTop: 10}}>
        {/* {getDisplayName()} */}
       
        
          {user?.providerData.email}
        </Text>
      </View>
      <View style={{
        width:'100%', 
        alignItems:'center', 
        justifyContent:'space-evenly' ,
        flexDirection:'row', 
        paddingVertical: 24}}>
        
        <View style={{
          alignItems:'center', 
          justifyContent:'center'}}>
          <TouchableOpacity style={{
            alignItems:'center', 
            justifyContent:'center', 
            width:48, 
            height:48, 
            borderRadius: 16, 
            backgroundColor: '#f8f8f8' }}>
            <MaterialIcons name='messenger-outline' size={24} color={'#555'}/>
          </TouchableOpacity>
          <Text style={{fontSize:12, paddingHorizontal:8}}>Message</Text>
        </View>
        <View style={{
          alignItems:'center', 
          justifyContent:'center'}}>
          <TouchableOpacity style={{
            alignItems:'center', 
            justifyContent:'center', 
            width:48, 
            height:48, 
            borderRadius: 16, 
            backgroundColor: '#f8f8f8' }}>
            <Entypo name='dots-three-vertical' size={24} color={'#555'}/>
          </TouchableOpacity>
          <Text style={{fontSize:12, paddingHorizontal:8}}>More</Text>
        </View>
      </View>
      <View style={{width:'100%', paddingVertical: 24, marginTop:12}}>

      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;