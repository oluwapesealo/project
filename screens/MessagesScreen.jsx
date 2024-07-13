import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config';
import { LinearGradient } from 'expo-linear-gradient';

const MessagesScreen = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(null);

  useLayoutEffect(() => {
    if (!user) return;

    const chatQuery = query(
      collection(firestoreDB, "chats"), 
      where('participants', 'array-contains', user._id),
      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
      const chatRooms = querySnapshot.docs.map(doc => doc.data());
      console.log("Chat Rooms from Firestore:", chatRooms);
      setChats(chatRooms);
      setIsLoading(false);
      console.log("User ID:", user?._id);
console.log("Chat Rooms:", chats);

    });

    navigation.setOptions({ headerShown: false });

    return unsubscribe;
  }, [user]);

  const MessageCard = ({ room, isCurrentUser }) => {
    if(user.username===room.chatName ){
    const displayName = room.otherChatName;
    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate("ChatScreen", { room })}
        style={styles.messageCard}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={26} color="#FFFFFF" />
        </View>
        <View style={styles.messageDetails}>
          <Text style={styles.chatName}>{displayName}</Text>
          <Text style={styles.lastMessage}>This is the message that appears from other people</Text>
        </View>
        <Text style={styles.timestamp}>20 min</Text>
      </TouchableOpacity>
    );}
    else{
      return (
        <TouchableOpacity 
          onPress={() => navigation.navigate("ChatScreen", { room })}
          style={styles.messageCard}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.messageDetails}>
            <Text style={styles.chatName}>{room.chatName}</Text>
            <Text style={styles.lastMessage}>This is the message that appears from other people</Text>
          </View>
          <Text style={styles.timestamp}>20 min</Text>
        </TouchableOpacity>
      );}
    };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Entypo name='menu' size={28} resizeMode="contain" color={'#f0f0f0'}/>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>PAUBOARD</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.profileContainer}>
              <Ionicons name='person-outline' size={18} />
              <Text style={styles.username}>
                {user?.username ?? 'Alo Oluwapese'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={['#2F3B6A', '#bdbcbc']}
          style={styles.gradient}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View>
              <View style={styles.messagesHeader}>
                <Text style={styles.messagesTitle}>Messages</Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddToChatScreen")}>
                  <Ionicons name='chatbox' size={28} color='#555' />
                </TouchableOpacity>
              </View>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              ) : (
                <>
                  {chats && chats.length > 0 ? (
                    chats.map(room => (<MessageCard key={room._id} room={room} isCurrentUser={room.participants.includes(user._id)}/>))
                  ) : (
                    <Text style={styles.noMessages}>No messages available</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative'
  },
  headerTitleContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
  },
  headerTitle: {
    fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#2F3B6A'
  },
  profileContainer: { alignItems: 'center', justifyContent: 'center' },
  username: {
    marginTop: 4, fontSize: 13, fontWeight: 'bold', color: '#2F3B6A', paddingHorizontal: 20
  },
  gradient: { flex: 1 },
  scrollView: { width: '100%', paddingHorizontal: 16, paddingTop: 16 },
  messagesHeader: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  messagesTitle: {
    color: '#FFFFFF', fontSize: 24, fontWeight: '800', paddingBottom: 8
  },
  loadingContainer: {
    width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  noMessages: { color: '#FFFFFF' },
  messageCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 16
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#2F3B6A', padding: 4
  },
  messageDetails: {
    flex: 1, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 16
  },
  chatName: {
    color: '#FFFFFF', fontSize: 16, fontWeight: '600', textTransform: 'capitalize'
  },
  lastMessage: { color: '#FFFFFF', fontSize: 14 },
  timestamp: {
    color: '#FFFFFF', fontSize: 14, fontWeight: '600'
  }
});

export default MessagesScreen;
