import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Share } from 'react-native';
import { Entypo, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { collection, doc, increment, onSnapshot, updateDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ShareModal from '../components/ShareModal';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

const HomeScreen = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);


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

  const sharing = async (title, description, date,url, event) => {
    const shareOptions = {
      message: `${title}\n${description}\n${date}\n${url}`, // Use template literals for readability
    };
  
    const { id } = event; // Destructure id from event
    const eventDocRef = doc(firestoreDB, 'files', id); // Verify firestoreDB and doc function
  
    try {
      await Share.share(shareOptions); // Ensure Share.share is correctly imported and used
      await updateDoc(eventDocRef, {
        shares: increment(1),
      });
      console.log('Event shared successfully and share count updated.');
    } catch (error) {
      console.error('Error sharing event:', error); // Improve error handling
    }
  };

  // const handleShare = async (item, selectedEvent) => {
  //   if (selectedEvent && selectedUser) {
  //     setSelectedUser(item)
  //     sendEventToUser(selectedUser, selectedEvent);
  //   }
  //   setShareModalVisible(false);
  // };
  // const sharing = async (event) => {
  //   try {
  //     if (!event || !event.roomId) {
  //       console.error('Event or roomId is undefined or null:', event);
  //       return;
  //     }
  
  //     const selectedRoom = { _id: event.roomId, chatName: '' };
  //     setSelectedRoom(selectedRoom);
  //     setSelectedEvent(event);
  //     setShareModalVisible(true);
  //   } catch (error) {
  //     console.error('Error in sharing function:', error);
  //   }
  // };
  
  // const sendEventToUser = async (recipient, event) => {
  //   try {
  //     if (!event || !event.roomId) {
  //       console.error('Event or roomId is undefined or null:', event);
  //       return;
  //     }
  
  //     const messageDocRef = doc(collection(firestoreDB, 'messages'));
  //     await setDoc(messageDocRef, {
  //       sender: user._id,
  //       recipient: selectedUser.id,
  //       event,
  //       timestamp: new Date(),
  //     });
  //     console.log('Event shared successfully');
  //     navigation.navigate("ChatScreen", { room: selectedUser, event: selectedEvent });
  //   } catch (error) {
  //     console.error('Error sharing event:', error);
  //   }
  // };
  

  const searchEvents = async (searchQuery) => {
    try {
      const q = searchQuery ? query(collection(firestoreDB, 'files'), where('title', '>=', searchQuery.trim())) : collection(firestoreDB, 'files');

      onSnapshot(q, (querySnapshot) => {
        const files = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredEvents = searchQuery ? files.filter(file =>
          file.title && file.title.toLowerCase().includes(searchQuery.toLowerCase())
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
          likedPostsData[doc.id] = true;
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

    setLikedEvents((prevLikedEvents) => ({
      ...prevLikedEvents,
      [eventId]: !isLiked,
    }));

    try {
      await updateDoc(eventDocRef, {
        likes: increment(isLiked ? -1 : 1),
      });

      if (!isLiked) {
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
  const handledashboard =() =>{
    navigation.navigate("Dashboard")
  }
  const handlePost =() =>{
    navigation.navigate("Post")
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

<View style={styles.header}>
      <View style={styles.menucontainer}>
      {user?.admin && ( // Check if user is admin
            <Menu>
              <MenuTrigger>
                <Entypo name='menu' size={32} resizeMode="contain" />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={handlePost}>
                  <Text style={{ padding: 15 }}>Post</Text>
                </MenuOption>
                <MenuOption onSelect={handledashboard}>
                  <Text style={{ padding: 15 }}>Dashboard</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PAUBOARD</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.profileButton}>
  <Ionicons name='person-outline' size={18} />
  <Text 
    style={styles.usernameText}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {user?.username ?? 'Alo Oluwapese'}
  </Text>
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
        {/* <TouchableOpacity onPress={() => searchEvents(searchQuery)}>
          <Feather name='filter' size={24} color={'#777'} />
        </TouchableOpacity> */}
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {(searchQuery.trim() === '' ? events : filteredEvents).map((event, index) => (
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
                <TouchableOpacity style={styles.interactionsBox} onPress={() => sharing(event.title, event.description, event.date, event.url, event)}>
                  <MaterialCommunityIcons name='share-outline' size={28} />
                  <Text style={styles.interactionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* <ShareModal
        visible={isShareModalVisible}
        onClose={() => setShareModalVisible(false)}
        onShare={handleShare}
      /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50, // Adjust height as needed
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative'
  },
  menucontainer: {
    position: 'absolute',
    left: 20,
    width: 50, // Adjust width as needed
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  titleContainer: {
    left: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2F3B6A',
  },
  profileButton: {
   alignItems: 'center', justifyContent: 'center', left: 20
  },
  usernameText: {
    left:20,
    marginTop: 4,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3B6A',
    paddingHorizontal: 20,
    width: 125, // Adjust width as needed
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
