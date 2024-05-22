import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Login, Logo } from '../assets';
import { Leaf } from '../assets';
import { Leave } from '../assets';
import { UserTextInput } from '../components';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from '../config/firbase.config';
import { setDoc, doc } from 'firebase/firestore';

const SignUpScreen = () => {

  const screenWidth = Math.round(Dimensions.get("window").width);
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [emailvalid, setemailvalid] = useState(false);
  const navigation = useNavigation();

  const signup = async () => {
    if(emailvalid && email !==""){
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then((userCred) => {
        const data = {
          _id: userCred?.user.uid,
          username: username,
          providerData: userCred.user.providerData[0],
          
        };
        setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(() => {
          navigation.navigate("LoginScreen");
        }
      );
      }
    );
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
      <Image 
        source={Leave} 
        style={{ width: screenWidth, height: 200 }} 
        //resizeMode='cover'
      />
      <View style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'white', 
        borderTopLeftRadius: 100, 
        marginTop: -44, 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        paddingTop: 10, paddingHorizontal: 20, 
        paddingBottom: 0 }}>
          

        <Image source={Logo} 
        style={{ 
          width: 300, 
          height: 100 }} 
          resizeMode="contain" />
        <Text style ={{ paddingBottom: 90, color: '#2F3B6A', fontSize: 20, fontWeight: 'bold'}}> Welcome To PAUBOARD! </Text>
        
    <View style={{ 
      paddingBottom: 550,
      width: '90%',
      flex: 3, 
      alignItems: 'center', 
      justifyContent: 'center' }}>
        <View style={{ marginTop: 150 }} />

        <UserTextInput 
      placeholder="Username" 
      isPass={false} 
      setStateValue={setusername} />
      <View style={{ marginTop: 10 }} />

       <UserTextInput 
      placeholder="Email" 
      isPass={false} 
      setStateValue={setemail}
      setemailvalid={setemailvalid}  />
      <View style={{ marginTop: 10 }} />

      <UserTextInput 
      placeholder="Password" 
      isPass={true} 
      setStateValue={setpassword}  />
      <View style={{ marginTop: 10 }} />

      <UserTextInput 
      placeholder="Confirm Password" 
      isPass={true} 
      setStateValue={setconfirmpassword}  />
      <View style={{ marginTop: 10 }} />

      <TouchableOpacity onPress={signup} style={{ width: '100%', 
      marginTop: 10, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10, backgroundColor: '#2F3B6A', marginVertical: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ paddingVertical: 5, color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Sign Up
        </Text>
        
      </TouchableOpacity>
      <View style={{ marginTop: 10 }} />
      <View style={{ 
        width: '100%',
        marginTop: 10, // Add margin top to create space
        paddingHorizontal: 20, // Add horizontal padding for space on the sides
        paddingVertical: 12, // Add vertical padding for space above and below
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Text>
          Already Registered?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={{ fontWeight: 'bold' }}>Login Here</Text>
          </TouchableOpacity>
        </Text>
      </View>
      </View>  
       </View>
    </View>
  )
}

export default SignUpScreen

{/* <View className='w-full flex items-center justify-center relative -my-4' >
          <TouchableOpacity className='w-20 h-20 p-1 rounded-full border-2 bg-primary relative'>
            <Image
            source={{url:''}} className='w-full h-full' resizeMode='contain'/>

          </TouchableOpacity>

        </View> */}