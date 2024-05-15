import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const UserTextInput = ({ 
  placeholder, 
  isPass, 
  setStateValue,
  setemailvalid }) => {

    const [value, setvalue] = useState('');

    const [showpass, setshowpass] = useState(true);

    const [icon, seticon] = useState(null);

    const [isemailvalid, setisemailvalid] = useState(false);

    const textchange =(text) => {
      setvalue(text)
      setStateValue(value)

      if (placeholder === "Email"){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const status = emailRegex.test(value);
        setisemailvalid(status)
        setemailvalid(status)

      }
    }

    useLayoutEffect(() => {
      switch(placeholder){
        case 'Confirm Password' :
          return seticon('lock')
        
        case 'Email' :
          return seticon('email')

        case 'Password':
          return seticon('lock')
      }
    }, [])
  return (
    <View style={{ 
      borderWidth: 1,
      borderRadius: 12, // React Native uses a numeric value for borderRadius, not 'rounded-2xl'
      paddingVertical: 10,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 2,
      borderColor: (!isemailvalid && placeholder == "Email" && value.length > 0) ? 'red' : '#000080' , // Use a specific color or replace with a variable representing your desired color
    }}>
      <MaterialIcons name={icon} size={24} color={'#000080'} style={{ marginRight: 10 }} />
      <TextInput 
        style={{ 
          fontSize: 16, // Increase font size
          color: '#000080',
          fontWeight: '600', 
          flex: 1,
          paddingVertical: 15, // Increase vertical padding
          paddingHorizontal: 20, // Increase horizontal padding
        }}
        placeholder={placeholder}
        secureTextEntry={isPass && showpass} // Conditionally set secureTextEntry
        onChangeText={textchange}// Pass setStateFunction as onChangeText callback
        value={value}
        autoCapitalize='none'
      />

      {isPass && (
        <TouchableOpacity onPress={() => setshowpass(!showpass)}>
          <Entypo name={`${showpass ? 'eye' :  'eye-with-line'}`} size={24} color={'#000080'}  />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserTextInput;
