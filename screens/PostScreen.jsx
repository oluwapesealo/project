import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { firestoreDB, storage } from '../config/firbase.config';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const PostScreen = () => {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestoreDB, 'files'), (snapshot) => {
      const filesData = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          filesData.push({ id: change.doc.id, ...change.doc.data() });
        }
      });
      setFiles(filesData);
    });

    return () => unsubscribe();
  }, []);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image URI:', result.assets[0].uri);
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  }

  async function uploadImage(uri, fileType) {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();

      const fileRef = ref(storage, 'Pictures/' + new Date().getTime());
      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + ' % done');
          setProgress(progress.toFixed(2));
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            await saveRecord(fileType, downloadURL, new Date().toISOString());
            setProgress(0); // Reset progress after upload completes
          } catch (error) {
            console.error('Failed to get download URL:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  async function saveRecord(fileType, url, createdAt) {
    try {
      const docRef = await addDoc(collection(firestoreDB, 'files'), {
        fileType,
        url,
        createdAt,
      });
      console.log('Document Saved', docRef.id);
    } catch (e) {
      console.error('Error saving record:', e);
    }
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Close date picker after selection
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handlePost = () => {
    images.forEach((imageUri) => {
      uploadImage(imageUri, 'image');
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name='arrow-back' size={24} color={'#000000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder='Title of Event'
          placeholderTextColor={'#777'}
        />
        <TextInput
          style={[styles.textInput, { marginTop: 30 }]}
          placeholder='Description of Event'
          placeholderTextColor={'#777'}
        />
      </View>
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>What day is the event?
        </Text>
        <View style={{marginTop:10}}/>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID='dateTimePicker'
            value={selectedDate}
            mode='date'
            display='default'
            onChange={handleDateChange}
          />
        )}
      </View>
      <View style={{
        marginTop: 30,
        
      }}> 
        <Text style={{
          marginHorizontal: 30,
          marginVertical: 10,
          fontWeight: '400',
        fontSize: 20}}>
          Please Select a Picture to upload
        </Text>
      </View>
      <ScrollView>
        {images.map((img, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: img }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
              <Ionicons name='close-circle' size={24} color={'grey'} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Ionicons name='image' size={24} color={'white'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  postButton: {
    fontWeight: '700',
  },
  inputContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    height: 48,
  },
  datePickerContainer: {
    marginHorizontal: 30,
    marginVertical: 10,
  },
  datePickerLabel: {
    marginTop: 20,
    fontWeight: '500',
    fontSize: 16,
  },
  datePickerText: {
    marginTop: 5,
    fontSize: 16,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width: 44,
    height: 44,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  imageContainer: {
    position: 'relative',
    margin: 10,
  },
  image: {
    width: 300,
    height: 300,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 5,
  },
});

export default PostScreen;
