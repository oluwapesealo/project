import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, doc, increment, onSnapshot, updateDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config'; // Ensure correct import path
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setLikedPosts } from './FavouritesScreen';
import { Share } from 'react-native';

const HomeScreen = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [FilteredEvents, setFilteredEvents] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestoreDB, 'files'), (snapshot) => {
      const eventsData = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      eventsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      searchEvents(searchQuery.trim());
    } else {
      setFilteredEvents([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (user) {
      fetchLikedPosts(user._id);
    }
  }, [user]);


  const sharing = async( title, fileType, url, description, date,) => {
    const shareoptions = {
      message: title + '\n'+ description + '\n' + date,
    }
    try {
      const shareresponse = await Share.share(shareoptions);

    }
    catch(error){
      console.log('Error: ', error)
    }
  };
  const searchEvents = async (query) => {
    try {
      const q = query ? query(collection(firestoreDB, 'files'), where('title', '>=', query.trim())) : collection(firestoreDB, 'files');

      onSnapshot(q, (querySnapshot) => {
        const files = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredEvents = query ? files.filter(file =>
          file.title && file.title.toLowerCase().includes(query.toLowerCase())
        ) : files;

        setFilteredEvents(filteredEvents);
      });
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  const fetchLikedPosts = async (userId) => {
    try {
      const likedPostsQuery = query(collection(firestoreDB, 'favorites'), where('likedBy', '==', userId));
      const snapshot = await onSnapshot(likedPostsQuery, (querySnapshot) => {
        const likedPostsData = {};
        querySnapshot.forEach((doc) => {
          likedPostsData[doc.id] = true; // Store liked event IDs in an object for quick lookup
        });
        setLikedEvents(likedPostsData);
      });
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    }
  };

  const handleLike = async (eventId, title, fileType, url, createdAt, description, date, department, likes, userId) => {
    const eventDocRef = doc(firestoreDB, 'files', eventId);
    const favoriteDocRef = doc(firestoreDB, 'favorites', eventId);
    const isLiked = likedEvents[eventId];

    // Toggle local liked status
    setLikedEvents((prevLikedEvents) => ({
      ...prevLikedEvents,
      [eventId]: !isLiked,
    }));

    try {
      // Update likes count in Firestore
      await updateDoc(eventDocRef, {
        likes: increment(isLiked ? -1 : 1),
      });

      if (!isLiked) {
        // Add event to favorites collection
        await setDoc(favoriteDocRef, {
          title,
          fileType,
          url,
          createdAt,
          description,
          date,
          department,
          likes: likes + 1,
          likedBy: userId,
        });
      } else {
        // Remove event from favorites collection
        await deleteDoc(favoriteDocRef);
      }
    } catch (error) {
      console.error('Error updating likes or favorites:', error);
    }
  };

  const handleEventPress = async (event) => {
    const { id, views } = event;
    const eventDocRef = doc(firestoreDB, 'files', id);

    try {
      // Update views count in Firestore
      await updateDoc(eventDocRef, {
        views: views + 1,
      });
    } catch (error) {
      console.error('Error updating views:', error);
    }

    navigation.navigate('EventScreen', { event });
  };

  const handleMenuPress = () => {
    if (navigation && navigation.openDrawer) {
      navigation.openDrawer();
    } else {
      console.warn('Navigation object or openDrawer function is not available.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Entypo name='menu' size={28} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>PAUBOARD</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <View style={styles.profileContainer}>
            <Ionicons name='person-outline' size={18} />
            <Text style={styles.profileName}>
              {user?.username ?? 'Alo Oluwapese'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBarContainer}>
        <Ionicons name='chatbubbles' size={24} color={'#777'} />
        <TextInput
          style={styles.searchInput}
          placeholder='Search'
          placeholderTextColor={'#777'}
          value={searchQuery}
          onSubmitEditing={() => {
            if (searchQuery.trim() !== "") {
              searchEvents(searchQuery);
            }
          }}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={() => searchEvents(searchQuery)}>
          <FontAwesome name='send' size={24} color={'#777'} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {(searchQuery.trim() === '' ? events : FilteredEvents).map((event, index) => (
          <TouchableOpacity key={index} style={styles.container} onPress={() => handleEventPress(event)}>
            <View style={styles.card}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.date}>{new Date(event.date).toLocaleDateString()}</Text>
              <Image style={styles.image} source={{ uri: event.url }} />
              <Text style={styles.description}>{event.description}</Text>
              <View style={styles.interaction}>
                <TouchableOpacity
                  style={styles.interactionsBox}
                  onPress={() => handleLike(
                    event.id,
                    event.title,
                    event.fileType,
                    event.url,
                    event.createdAt,
                    event.description,
                    event.date,
                    event.department,
                    event.likes,
                    user._id,
                  )}
                >
                  <Ionicons
                    name={likedEvents[event.id] ? 'heart' : 'heart-outline'}
                    size={24}
                    color={likedEvents[event.id] ? 'red' : 'black'}
                  />
                  <Text style={styles.interactionText}>
                    {likedEvents[event.id] ? 'Liked' : 'Like'} ({event.likes || 0})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactionsBox} onPress={() => sharing(
                    event.title,
                    event.fileType,
                    event.url,
                    event.description,
                    event.date
                  )}>
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
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3B6A',
  },
  searchBarContainer: {
    width: '90%',
    paddingHorizontal: 16,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
    marginLeft: 20,
    padding: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    height: 48,
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
    borderRadius: 15,
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
