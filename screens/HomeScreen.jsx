import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Login, Logo } from '../assets';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config';

const HomeScreen = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(true);
  const [chats, setchats] = useState(null);

  useLayoutEffect(() => {
    const chatquery = query(collection(firestoreDB, "chats"), orderBy("_id", "desc"));

    const unsubscribe = onSnapshot(chatquery, (querySnapShot) =>{
      const chatrooms = querySnapShot.docs.map(doc => doc.data())
      setchats(chatrooms)
      setisLoading(false)
    })

    return unsubscribe

  }, [])
  console.log("Logged User: ", user);

  const MessageCard = ({room}) => {
    //const navigation = useNavigation();
    return (
      <TouchableOpacity 
      onPress={() => navigation.navigate("ChatScreen", {room : room})} style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // changed to flex-start
        paddingTop: 16
      }}>
        <View style={{ 
          width: 64, 
          height: 64, 
          borderRadius: 32, 
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2, 
          borderColor: 'blue', 
          padding: 4
        }}>
          <Ionicons name="person" size={24} color="#555" />
        </View>
        <View style={{ 
          flex: 1, 
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          marginLeft: 16 
        }}>
          <Text style={{ 
            color: '#333', 
            fontSize: 16, 
            fontWeight: '600', 
            textTransform: 'capitalize' 
          }}>
            {room.chatName}
          </Text>
          <Text style={{ 
            color: 'blue', 
            fontSize: 14 
          }}>
            This is the message that appears from other people
          </Text>
        </View>
        <Text style={{ 
            color: 'blue', 
            fontSize: 14,
            fontWeight: '600'
          }}>20 min</Text>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={{
      flex: 1,
    }}>
      <SafeAreaView style={{
    flex: 1,
  }}>
        <View style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 8,
          
        }}>
          <Image source={Logo} style={ {
            width: 60,
            height: 60,
          }} resizeMode="contain" />
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#2F3B6A',
              flex: 1, 
            }}>PAUBOARD</Text>
          <TouchableOpacity style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: 'blue',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 16,
          }}>
            <Image source={Login} style={{
              width: 24,
              height: 24,
            }} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{
          width: '100%',
          paddingHorizontal: 16,
          paddingTop: 16,
        }}>
          <View>
          <View style ={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            }}>
              <Text style={{
                color: '#2F3B6A', 
                fontSize: 20, 
                fontWeight: '800', 
                paddingBottom: 8}}>Messages</Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddToChatScreen") }>
                  <Ionicons name='chatbox' size ={28} color ='#555'/>
                </TouchableOpacity>
          </View>
          {isLoading ? (<><View style ={{
            width: '100%',
            flex:1,
            alignItems: 'center',
            justifyContent: 'space-between',
            }}>
               <ActivityIndicator size="large" color="#2F3B6A" /></View></>) : 
               ( <> 
                {chats && chats?.length > 0 ? (<>
                {chats?.map(room => (<MessageCard key={room._id} room ={room} />))}</>) : (<></>) }
               </>
              )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;