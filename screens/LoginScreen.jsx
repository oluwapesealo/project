import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Login, Logo } from '../assets';
import { Leaf } from '../assets';
import { Leave } from '../assets';
import { UserTextInput } from '../components';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const navigation = useNavigation();

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
        paddingTop: 30, paddingHorizontal: 20, 
        paddingBottom: 20 }}>
          

        <Image source={Logo} 
        style={{ 
          width: 300, 
          height: 100 }} 
          resizeMode="contain" />
        <Text style ={{ paddingBottom: 70, color: '#2F3B6A', fontSize: 20, fontWeight: 'bold'}}> Welcome Back! </Text>
        <View style={{ marginTop: 20 }} />
    <View style={{ 
      paddingBottom: 550,
      width: '90%',
      flex: 3, 
      alignItems: 'center', 
      justifyContent: 'center' }}>
        <View style={{ marginTop: 10 }} />
       <UserTextInput 
      placeholder="Email" 
      isPass={false} 
      setStateValue={setemail}  />
      <View style={{ marginTop: 10 }} />
      <UserTextInput 
      placeholder="Password" 
      isPass={true} 
      setStateValue={setpassword}  />
      <View style={{ marginTop: 10 }} />

      <TouchableOpacity style={{ width: '100%', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 10, backgroundColor: '2F3B6A', marginVertical: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ paddingVertical: 5, color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Sign In
        </Text>
      </TouchableOpacity>
      <View style={{ width: '100%', paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
        <Text >
          Not yet Registered? {' '}                        
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity 
            onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={{ fontWeight: 'bold' }}>
                Register here</Text>
            </TouchableOpacity>
          </View>
        </Text>
      </View>
      </View>  
       </View>
    </View>
  );
};

export default LoginScreen;




/*
<UserTextInput 
placeholder="Email" 
isPass={false} 
setStateValue={email} 
setStateFunction={setemail} />
*/

/* const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '50%',
      top: 50.
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    });*/
    
  //   <ImageBackground source={Login} style={{width:screenwidth}}>
  //   <Text>Overlay Content</Text>
  // </ImageBackground>

   /* <View style={styles.container}>
    <Image source={Login} style={styles.image} />
    <Text style={styles.overlay}>Overlay Content</Text>
    </View> */