import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config';

const HomeScreen = () => {
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

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {events.map((event, index) => (
        <View key={index} style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.date}>{new Date(event.date).toLocaleDateString()}</Text>
            <Image style={styles.image} source={{ uri: event.url }} />
            <Text style={styles.description}>{event.description}</Text>
            <View style={styles.interaction}>
              <TouchableOpacity 
              style={styles.interactionsbox}
              onPress={() => handleLike(event.id)}>
                 <Ionicons 
                  name={likedEvents[event.id] ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={likedEvents[event.id] ? 'red' : 'black'} 
                />
                <Text style={styles.interactiontext}>
                {likedEvents[event.id] ? 'Likes' : 'Like'} ({event.likes || 0})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.interactionsbox}>
                <MaterialCommunityIcons name='share-outline' size={28} />
                <Text style={styles.interactiontext}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
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
  interactionsbox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  interaction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  interactiontext: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    fontWeight: 'bold',
    color: '#665',
    marginLeft: 5,
  },
});
