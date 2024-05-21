import { ActivityIndicator, Text, View, Image } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Logo } from '../assets';
import { useNavigation } from '@react-navigation/native';
import { SET_USER, SET_USER_NULL } from '../context/actions/userActions';
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestoreDB } from '../config/firbase.config';

const SplashScreen = () => {
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    checkLoggedUser();
  }, []
);

  const checkLoggedUser = async() => {
    firebaseAuth.onAuthStateChanged((userCred) =>{
      if(userCred?.uid){
        getDoc(doc(firestoreDB, "users", userCred?.uid)).then((docSnap) => {
          if(docSnap.exists()){
            console.log("User Data :", docSnap.data());
            dispatch(SET_USER(docSnap.data()))
          }
          
        }
      ).then(() => {
        setTimeout(() => {
          navigation.replace("HomeScreen");
        }, 2000);
      });

      }
      else{
        navigation.replace("LoginScreen")
      }
    })
  }
  return (
    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', paddingTop: 24, marginBottom: 200 }}>
      <Image source={Logo} style={{ width: 250, height: 150, marginBottom: 100 }}  />
      <ActivityIndicator size="large" color="#2F3B6A" />

    </View>
  )
}

export default SplashScreen