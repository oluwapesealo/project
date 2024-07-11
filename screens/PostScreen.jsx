import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { firestoreDB, storage } from '../config/firbase.config';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ProgressBar from '../components/ProgressBar';
import Uploading from '../components/Uploading';

const PostScreen = () => {
  const user = useSelector(state => state.user.user);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [titles, settitles] = useState('');
  const [dates, setdates] = useState(null);
  const [descriptions, setdescriptions] = useState('');
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');

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
    setUploading(true);
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
  
      const fileRef = ref(storage, 'Posts/' + new Date());
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
          setUploading(false); // Reset uploading state if there is an error
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            const formattedDate = dates.split('T')[0]; // Extract only the date part
            await saveRecord(titles, fileType, downloadURL, new Date().toISOString(), descriptions, formattedDate, selectedDepartment);
            setProgress(0); // Reset progress after upload completes
            setUploading(false); // Reset uploading state after upload completes
            navigation.navigate('Home'); // Redirect to Home screen after upload completes
          } catch (error) {
            console.error('Failed to get download URL:', error);
            setUploading(false); // Reset uploading state if there is an error
          }
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false); // Reset uploading state if there is an error
    }
  }
  

  async function saveRecord(titles, fileType, url, createdAt, descriptions, dates, selectedDepartment) {
    try {
      const docRef = await addDoc(collection(firestoreDB, 'files'), {
        title: titles,
        fileType,
        url,
        createdAt,
        description: descriptions,
        date: dates, // dates already formatted to contain only the date part
        views: null,
        likes: null,
        shares: null,
        department: selectedDepartment,
      });
      console.log('Post Added', docRef.id);
    } catch (e) {
      console.error('Error saving record:', e);
    }
  }

  const handleDateChange = (event, date) => {
    setShowDatePicker(false); // Close date picker after selection
    if (date) {
      setSelectedDate(date);
      setdates(date.toISOString().split('T')[0]); // Extract only the date part
    }
  };

  const handlePost = () => {
    if (titles === '' || descriptions === '' || dates === null || selectedDepartment === '') {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    images.forEach((imageUri) => {
      uploadImage(imageUri, 'image');
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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
        <TouchableOpacity>
          <Entypo name='menu' size={28} resizeMode="contain" />
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
      <ScrollView>
        <View style={styles.header}></View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder='Title of Event'
            placeholderTextColor={'#777'}
            onChangeText={(content) => settitles(content)}
          />
          <TextInput
            style={[styles.textInput, { marginTop: 20 }]}
            placeholder='Description of Event'
            placeholderTextColor={'#777'}
            onChangeText={(decontent) => setdescriptions(decontent)}
          />
        </View>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>What day is the event?</Text>
          <View style={{ marginTop: 10 }} />
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
        <View style={styles.departmentPickerContainer}>
          <Text style={styles.departmentPickerLabel}>Select Department:</Text>
          <Picker
            selectedValue={selectedDepartment}
            onValueChange={(itemValue, itemIndex) => setSelectedDepartment(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a department" value="" />
            <Picker.Item label="ALL" value="All" />
            <Picker.Item label="Computer Science" value="Comp" />
            <Picker.Item label="Electrical Engineering" value="Elect" />
            <Picker.Item label="Mechanical Engineering" value="Mech" />
            <Picker.Item label="Finance" value="finance" />
            <Picker.Item label="Mass Communication" value="MassCom" />
            <Picker.Item label="Accounting" value="Acc" />
            <Picker.Item label="Business Administration" value="Bus Admin" />
            <Picker.Item label="Information Science Media Studies" value="ISMS" />
            <Picker.Item label="Economics" value="Econs" />
            <Picker.Item label="Software Engineering" value="Seng" />
            {/* Add more departments as needed */}
          </Picker>
        </View>
        <View style={{ marginTop: 150 }}>
          <Text style={{
            marginHorizontal: 30,
            marginVertical: 10,
            fontWeight: '400',
            fontSize: 20
          }}>
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
        <TouchableOpacity onPress={handlePost}>
          <View style={styles.postButton}><Text style={styles.posttext}>Post</Text></View>
        </TouchableOpacity>
        {uploading && <Uploading progress={progress} />}
      </ScrollView>
    </SafeAreaView>
  );
}  

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderBottomColor: '#000000',
  },
  postButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  inputContainer: {
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textInput: {
    borderWidth: 0.5,
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize:14
  },
  datePickerContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  datePickerText: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 8,
    color: '#000',
  },
  departmentPickerContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  departmentPickerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  picker: {
    height: 45,
    width: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  uploadButton: {
    width:'15%',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  posttext:{
    fontWeight: '700',
    fontSize: 16,
    color: 'white'
  }
});

export default PostScreen;
