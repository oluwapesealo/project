import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const UserTextInput = ({ placeholder, isPass, setStateValue, setemailvalid }) => {
  const [value, setvalue] = useState('');
  const [showpass, setshowpass] = useState(true);
  const [icon, seticon] = useState(null);
  const [isemailvalid, setisemailvalid] = useState(false);

  const textchange = (text) => {
    setvalue(text);
    setStateValue(text);

    if (placeholder === "Email") {
      const emailRegex = /^[a-zA-Z]+@pau\.edu\.ng$/;
      const status = emailRegex.test(text);
      setisemailvalid(status);
      setemailvalid(status);
    }
  };

  useLayoutEffect(() => {
    switch (placeholder) {
      case 'Username':
        seticon('person');
        break;
      case 'Confirm Password':
        seticon('lock');
        break;
      case 'Email':
        seticon('email');
        break;
      case 'Password':
        seticon('lock');
        break;
      default:
        seticon(null);
    }
  }, [placeholder]);

  return (
    <View style={[
      styles.container,
      { borderColor: (!isemailvalid && placeholder === "Email" && value.length > 0) ? 'red' : '#000080' },
    ]}>
      <MaterialIcons name={icon} size={24} color={'#000080'} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={isPass && showpass}
        onChangeText={textchange}
        value={value}
        autoCapitalize='none'
      />
      {isPass && (
        <TouchableOpacity
          onPress={() => setshowpass(!showpass)}
          accessibilityLabel={`Toggle passowrd visibility ${showpass ? 'off': 'on'}`}
        >
          <Entypo name={`${showpass ? 'eye' : 'eye-with-line'}`} size={24} color={'#000080'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    color: '#000080',
    fontWeight: '600',
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});

export default UserTextInput;