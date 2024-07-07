import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config';

const FavouritesScreen = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const likedPostsQuery = query(collection(firestoreDB, 'files'), where('likes', '>', 0));
        const snapshot = await onSnapshot(likedPostsQuery, (querySnapshot) => {
          const likedPostsData = [];
          querySnapshot.forEach((doc) => {
            likedPostsData.push({ id: doc.id, ...doc.data() });
          });
          setLikedPosts(likedPostsData);
        });
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };

    fetchLikedPosts();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {likedPosts.length === 0 ? (
        <Text style={styles.noPostsText}>No liked posts yet.</Text>
      ) : (
        likedPosts.map((post, index) => (
          <View key={index} style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.date}>{new Date(post.date).toLocaleDateString()}</Text>
              <Image style={styles.image} source={{ uri: post.url }} />
              <Text style={styles.description}>{post.description}</Text>
              <View style={styles.interaction}>
                <TouchableOpacity style={styles.interactionsbox}>
                  <Ionicons name='heart' size={24} color='red' />
                  <Text style={styles.interactiontext}>Liked ({post.likes || 0})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactionsbox}>
                  <MaterialCommunityIcons name='share-outline' size={28} />
                  <Text style={styles.interactiontext}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default FavouritesScreen;

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
  noPostsText: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#666',
    marginTop: 20,
  },
});
