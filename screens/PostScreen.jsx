import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SvgComponent from '../assets/svg';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import { Uploading } from '../components/Uploading';
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { addDoc, collection, onSnapshot} from "firebase/firestore";
import { storage } from '../config/firbase.config';


const PostScreen = () => {

  const [image, setimage] = useState("");
  const [progresses, setprogresses] = useState(0);

  async function pickImage(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing:true,
      aspect: [3,4],
      quality : 1
    })

    if (!result.canceled){
      setimage(result.assets[0].uri);

    }
  }

  async function uploadImage(uri, fileType){
    const response = await fetch (uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Pictures/" + new Date().getTime() )
    const uploadTask = uploadBytesResumable(storageRef, blob)
    uploadTask.on("state_changed", 
      (snapshot) => {
        const progress =(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + " % done");
        setprogresses(progresses.toFixed())
      },
    (error) =>{

    }  ,
    () =>{
      getDownloadURL(uploadTask.snapshot,ref).then(async(downloadURL) => {
        console.log("File available at", downloadURL)
        setimage("")
      })
    }
    )


  }
  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {image && <Uploading image={image} progress={progresses}/>}
    <EmptyState />
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