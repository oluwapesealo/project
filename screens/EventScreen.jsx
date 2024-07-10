import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const EventScreen = ({ route }) => {
  const { event } = route.params;
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name ='chevron-left' size={32} color={'#555'}/>
        </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#2F3B6A',
            }}>PAUBOARD</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            
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
          </View>
          </TouchableOpacity>
        </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View >
          <View >
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.date}>{new Date(event.date).toLocaleDateString()}</Text>
            <Image style={styles.image} source={{ uri: event.url }} />
            <Text style={styles.description}>{event.description}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  scrollViewContent: {paddingHorizontal: 20
  },

  title: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
    marginBottom: 5,
  },
  description: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Nunito',
    marginBottom: 5,
  },
  date: {
    marginTop:20,
    fontSize: 18,
    fontFamily: 'Lato-Regular',
    color: '#665',
  },
  image: {
    width: '100%',
    height: 350,
    marginTop: 20,
  },
});
