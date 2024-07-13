import { Text, View, Image, Dimensions, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Logo, Leave } from '../assets'; // Adjust this according to your asset structure
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
  const [alert, setalert] = useState(false);
  const [alertmessage, setalertmessage] = useState(''); // Added alertmessage state

  const signup = async () => {
    if (password === confirmpassword) {
      if (emailvalid && email !== "") {
        await createUserWithEmailAndPassword(firebaseAuth, email, password)
          .then((userCred) => {
            const data = {
              _id: userCred?.user.uid,
              username: username,
              providerData: userCred.user.providerData[0],
              admin: null
            };
            setDoc(doc(firestoreDB, "users", userCred?.user.uid), data)
              .then(() => {
                navigation.navigate("LoginScreen");
              });
          })
          .catch((error) => {
            setalertmessage(error.message);
            setalert(true);
          });
      } else {
        setalertmessage("Invalid email");
        setalert(true);
      }
    } else {
      setalertmessage("Passwords don't match");
      setalert(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    <ScrollView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        <Image
          source={Leave}
          style={{ width: screenWidth, height: 300 }}
          resizeMode='cover'
        />
        <View style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          borderTopLeftRadius: 100,
          marginTop: -125,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 10,
          paddingHorizontal: 20,
          paddingBottom: 0
        }}>
          <Image source={Logo}
            style={{
              width: 300,
              height: 100
            }}
            resizeMode="contain" />
          <Text style={{ paddingBottom: 20, color: '#2F3B6A', fontSize: 20, fontWeight: 'bold' }}>
            Welcome To PAUBOARD!
          </Text>

          <View style={{
            width: '90%',
            flex: 3,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -75
          }}>
            <UserTextInput
              placeholder="Username"
              isPass={false}
              setStateValue={setusername} />
            <View style={{ marginTop: 10 }} />
            <UserTextInput
              placeholder="Email"
              isPass={false}
              setStateValue={setemail}
              setemailvalid={setemailvalid} />
            <View style={{ marginTop: 10 }} />
            <UserTextInput
              placeholder="Password"
              isPass={true}
              setStateValue={setpassword} />
            <View style={{ marginTop: 10 }} />
            <UserTextInput
              placeholder="Confirm Password"
              isPass={true}
              setStateValue={setconfirmpassword} />
            <View style={{ marginTop: 10 }} />

            {alert && <Text style={{ color: 'red', marginVertical: 10 }}>{alertmessage}</Text>}

            <TouchableOpacity onPress={signup} style={{
              width: '100%',
              marginTop: 10,
              paddingHorizontal: 8,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: '#2F3B6A',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                Sign Up
              </Text>
            </TouchableOpacity>

            <View style={{
              width: '100%',
              marginTop: 20,
              paddingHorizontal: 20,
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
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignUpScreen;
