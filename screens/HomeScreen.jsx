import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestoreDB, 'files'), (snapshot) => {
      const eventsData = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (eventId) => {
    const eventDocRef = doc(firestoreDB, 'files', eventId);
    const isLiked = likedEvents[eventId];

    // Update the local liked state
    setLikedEvents((prevLikedEvents) => ({
      ...prevLikedEvents,
      [eventId]: !isLiked,
    }));

    // Update the likes count in Firestore
    try {
      await updateDoc(eventDocRef, {
        likes: increment(isLiked ? -1 : 1),
      });
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventScreen', { event });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Entypo name='menu' size={28} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>PAUBOARD</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <View style={styles.profileContainer}>
            <Ionicons name='person-outline' size={18} />
            <Text style={styles.profileName}>
              {user?.name ?? 'Alo Oluwapese'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {events.map((event, index) => (
          <TouchableOpacity key={index} style={styles.container}onPress={() => handleEventPress(event)} >
            <View style={styles.card}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.date}>{new Date(event.date).toLocaleDateString()}</Text>
              <Image style={styles.image} source={{ uri: event.url }} />
              <Text style={styles.description}>{event.description}</Text>
              <View style={styles.interaction}>
                <TouchableOpacity 
                  style={styles.interactionsBox}
                  onPress={() => handleLike(event.id)}>
                  <Ionicons 
                    name={likedEvents[event.id] ? 'heart' : 'heart-outline'} 
                    size={24} 
                    color={likedEvents[event.id] ? 'red' : 'black'} 
                  />
                  <Text style={styles.interactionText}>
                    {likedEvents[event.id] ? 'Likes' : 'Like'} ({event.likes || 0})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactionsBox}>
                  <MaterialCommunityIcons name='share-outline' size={28} />
                  <Text style={styles.interactionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2F3B6A',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3B6A',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
    marginBottom: 5,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Nunito',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    color: '#665',
  },
  image: {
    width: '100%',
    height: 250,
    marginTop: 15,
  },
  interactionsBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  interaction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  interactionText: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    color: '#665',
    marginLeft: 5,
  },
});
