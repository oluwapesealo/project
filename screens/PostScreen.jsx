import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image
 } from 'react-native';
import SvgComponent from '../assets/svg';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import { Uploading } from '../components/Uploading';
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { addDoc, collection, onSnapshot} from "firebase/firestore";
import { firestoreDB, storage } from '../config/firbase.config';



const PostScreen = () => {



  const [image, setimage] = useState("");
  const [progresses, setprogresses] = useState(0);
  const [files, setfiles] = useState([]);

  useEffect( () => {
    const unsubsribe  = onSnapshot(collection(firestoreDB, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if(change.type === "added"){
          console.log("New File", change.doc.data());
          setfiles((prevfiles) => [...prevfiles, change.doc.data()])
        }
      })
    })

    return () => unsubsribe();
  }, [])

  async function pickImage(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing:true,
      aspect: [3,4],
      quality : 1
    })

    if (!result.canceled){
      setimage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri, "image");
      
    }
  }

  async function uploadImage(uri, fileType) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const storageRef = ref(storage, "Pictures/" + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + " % done");
          setprogresses(progress.toFixed(2));
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            await saveRecord(fileType, downloadURL, new Date().toISOString());
            setimage("");
            setprogresses(0); // Reset progress after upload completes
          } catch (error) {
            console.error("Failed to get download URL:", error);
          }
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
  

  async function saveRecord(fileType, url, createdAt){
    try{
      const docRef = await addDoc(collection(firestoreDB, "files"), {
        fileType,
        url,
        createdAt
      })
      console.log("Document Saved", docRef.id);
    }catch (e) {
      console.log(e);
    }
  }
  return (
  <View style={{flex:1}}>
    <FlatList 
    data={files}
    keyExtractor={(item) => item.url}
    renderItem={({item}) => {
      return(
        <Image 
        source = {{uri : item.url}}
        style={{width: "34%", height:100}}/>
      );
    }}
    />
    {image && <Uploading image={image} progress={progresses}/>}
    
    <TouchableOpacity onPress={pickImage} style={{
      position: "absolute",
      bottom: 90,
      right:30,
      width:44,
      height:44,
      backgroundColor: "black",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 25,

    }}>
      <Ionicons  name="image" size={24} color={"white"}/>

    </TouchableOpacity>
    
    </View>
  );
};

export default PostScreen;