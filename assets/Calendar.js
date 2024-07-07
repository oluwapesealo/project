import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestoreDB } from '../config/firbase.config'; // Adjust this import based on your Firebase setup

const SCalendar = () => {
  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const events = useSelector(state => state.events); // Assuming events are stored in Redux state

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestoreDB, 'files'), snapshot => {
      const newMarkedDates = {};
      snapshot.forEach(doc => {
        const event = doc.data();
        if (event.date && typeof event.date.toDate === 'function') {
          const eventDate = event.date.toDate(); // Assuming date is a Firestore Timestamp
          const formattedDate = eventDate.toISOString().split('T')[0];
          newMarkedDates[formattedDate] = { marked: true, dotColor: 'red' };
        }
      });
      setMarkedDates(newMarkedDates);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => {
          console.log('Selected day:', day);
          setSelected(day.dateString);
        }}
        markedDates={markedDates}
      />
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
});
