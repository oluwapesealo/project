import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config'; // Adjusted import path for Firebase config
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);

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

  const removeEvent = async (eventId) => {
    const eventDocRef = doc(firestoreDB, 'files', eventId);

    // Show confirmation alert
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDoc(eventDocRef);
            } catch (error) {
              console.error('Error deleting event:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleEventPress = (event) => {
    navigation.navigate('DashboardEvents', { event });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
      <View style={{
    position: 'absolute',
    left: 0,
    width: 50, // Adjust width as needed
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{
    position: 'absolute',
    left: 16,
  }}>
          <MaterialIcons name='chevron-left' size={40} color={'#555'} />
        </TouchableOpacity>
        </View>
        <View style={{
    left: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
          <Text style={{
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2F3B6A',
  }}>PAUBOARD</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{
   alignItems: 'center', justifyContent: 'center'
  }}>
          <Ionicons name='person-outline' size={18} />
          <Text style={{
    marginTop: 4,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3B6A',
    paddingHorizontal: 20,
  }}>
            {user?.username ?? 'Alo Oluwapese'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {events.map((event, index) => (
          <TouchableOpacity key={index} style={styles.container} onPress={() => handleEventPress(event)}>
            <View style={styles.card}>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeEvent(event.id)}>
                <Ionicons name='close-circle' size={24} color={'grey'} />
              </TouchableOpacity>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.date}>{new Date(event.date).toLocaleDateString()}</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

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
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
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
    paddingHorizontal: 20,
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
    marginBottom: 20,
    borderRadius: 15,
  },
  card: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
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
});
