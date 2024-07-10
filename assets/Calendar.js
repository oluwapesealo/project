import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config'; // Ensure the correct path

const SCalendar = () => {
  const [selected, setSelected] = useState('');
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  const getEventsOnDate = async (date) => {
    try {
      const q = query(
        collection(firestoreDB, 'files'), // Adjust the collection name as per your structure
        where('date', '==', date) // Assuming date is stored as ISO string in Firestore
      );

      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventsOnSelectedDate(events);
      console.log('Selected Events:', events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchAllEventDates = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestoreDB, 'files'));
      const dates = {};
      querySnapshot.docs.forEach(doc => {
        const eventDate = doc.data().date; // Assuming date is stored as ISO string in Firestore
        dates[eventDate] = { marked: true };
      });
      setMarkedDates(dates);
    } catch (error) {
      console.error('Error fetching event dates:', error);
    }
  };

  useEffect(() => {
    if (selected) {
      getEventsOnDate(selected);
    } else {
      setEventsOnSelectedDate([]);
      console.log('No events for selected date.');
    }
  }, [selected]);

  useEffect(() => {
    fetchAllEventDates();
  }, []);

  const handleDayPress = day => {
    console.log('Selected day:', day.dateString);
    setSelected(day.dateString); // Ensure day.dateString matches your date format
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{ 
          ...markedDates, 
          [selected]: { selected: true, marked: true, selectedColor: 'lightblue' } 
        }}
      />
      {selected && (
        <View style={styles.reminderContainer}>
          {eventsOnSelectedDate.length === 0 ? (
            <Text style={styles.noEventText}>No events on this date</Text>
          ) : (
            <ScrollView style={styles.eventList}>
              {eventsOnSelectedDate.map((event, index) => (
                <View key={index} style={styles.eventCard}>
                  <Text style={styles.date}>{event.date}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default SCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  reminderContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  eventList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  date:{
    fontSize: 14
  },
  eventTitle: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  noEventText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
});
