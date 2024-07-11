import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DashboardEvents = ({ route }) => {
  const { event } = route.params;
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();

  // Data for the graph
  const data = {
    labels: ['Views', 'Likes'],
    datasets: [
      {
        data: [event.views || 0, event.likes || 0],
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name='chevron-left' size={40} color={'#555'} />
        </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PAUBOARD</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.profileButton}>
          <Ionicons name='person-outline' size={18} />
          <Text style={styles.usernameText}>
            {user?.username ?? 'Alo Oluwapese'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          <View>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.date}>Date of Event: {new Date(event.date).toLocaleDateString()}</Text>
            <Text style={styles.views}>Views: {event.views}</Text>
            <Text style={styles.likes}>Likes: {event.likes}</Text>
            <Text style={styles.department}>Department: {event.department}</Text>
            
            <Text style={styles.description}>Description: {event.description}</Text>

            
            <BarChart
              data={data}
              width={screenWidth - 40} // from react-native
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: '#2F3B6A',
                backgroundGradientFrom: '#2F3B6A',
                backgroundGradientTo: '#2F3B6A',
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            <Image style={styles.image} source={{ uri: event.url }} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardEvents;

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
  backButtonContainer: {
    position: 'absolute',
    left: 0,
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
    left: 30,
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
   alignItems: 'center', justifyContent: 'center'
  },
  usernameText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3B6A',
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
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
  views: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Nunito',
    marginBottom: 5,
  },
  likes: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Nunito',
    marginBottom: 5,
  },
  department: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Nunito',
    marginBottom: 5,
  },
  date: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Lato-Regular',
  },
  image: {
    width: '50%',
    height: 100,
    marginTop: 20,
    borderRadius:15
  },
});
