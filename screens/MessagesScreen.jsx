import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config';
import { LinearGradient } from 'expo-linear-gradient';


const MessagesScreen = () => {
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
    navigation.setOptions({ headerShown: false });

    return unsubscribe

  }, []);
  console.log("Logged User: ", user);

  const MessageCard = ({room}) => {
    return (
      <TouchableOpacity 
      onPress={() => navigation.navigate("ChatScreen", {room : room})} style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 16
      }}>
        <View style={{ 
          width: 64, 
          height: 64, 
          borderRadius: 32, 
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2, 
          borderColor: '#2F3B6A', 
          padding: 4
        }}>
          <Ionicons name="person" size={26} color="#FFFFFF" />
        </View>
        <View style={{ 
          flex: 1, 
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          marginLeft: 16 
        }}>
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: 16, 
            fontWeight: '600', 
            textTransform: 'capitalize' 
          }}>
            {room.chatName}
          </Text>
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: 14 
          }}>
            This is the message that appears from other people
          </Text>
        </View>
        <Text style={{ 
            color: '#FFFFFF', 
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
          
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Ionicons name='person-outline' size={18} />
            </TouchableOpacity>
            <Text style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: 'bold',
              color: '#2F3B6A',
            }}>
              {user?.name ?? 'Alo Oluwapese'}
            </Text>
          </View>
        </View>
        <LinearGradient
          colors={['#2F3B6A', '#bdbcbc']}
          style={{
            flex: 1,
          }}
        >
          <ScrollView contentContainerStyle={{
            width: '100%',
            paddingHorizontal: 16,
            paddingTop: 16,
          }}>
            <View>
              <View style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Text style={{
                  color: '#FFFFFF', 
                  fontSize: 24, 
                  fontWeight: '800', 
                  paddingBottom: 8
                }}>Messages</Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddToChatScreen")}>
                  <Ionicons name='chatbox' size={28} color='#555' />
                </TouchableOpacity>
              </View>
              {isLoading ? (
                <View style={{
                  width: '100%',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              ) : (
                <>
                  {chats && chats.length > 0 ? (
                    chats.map(room => (<MessageCard key={room._id} room={room} />))
                  ) : (
                    <Text style={{ color: '#FFFFFF' }}>No messages available</Text>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};

export default MessagesScreen;
