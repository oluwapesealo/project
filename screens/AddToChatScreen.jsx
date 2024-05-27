import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { firestoreDB } from '../config/firbase.config';
import HomeScreen from './HomeScreen';
import { doc, setDoc } from 'firebase/firestore';
const AddToChatScreen = () => {
    const navigation = useNavigation();
    const user = useSelector(state => state.user.user);
    const [addchat, setaddchat] = useState('');
    const CreateNewChat = async () =>{
        let id = `${Date.now()}`;

        const _doc ={
            _id : id,
            user : user,
            chatName : addchat
        };
        if (addchat !==""){
            setDoc(doc(firestoreDB, "chats", id), _doc).then(() =>{
                setaddchat("");
                navigation.replace("HomeScreen");
            }).catch((err)=>{
                alert("Error : ", err);
            });
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={{
                width: '100%',
                backgroundColor: '#2F3B6A', // Replace with your primary color
                paddingHorizontal: 16,
                paddingVertical: 24,
                flex: 0.25,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    width: '100%',
                    paddingHorizontal: 16,
                    paddingVertical: 48,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="chevron-left" size={32} color={'white'} />
                    </TouchableOpacity>
                    <View style={{
                        marginRight: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: 'white'
                    }}>
                        <Ionicons name="person" size={24} color="#555" />
                    </View>
                </View>
            </View>
            <View style={{
                width: '100%',
                backgroundColor: 'white',
                paddingHorizontal: 16,
                paddingVertical: 24,
                borderRadius: 24,
                flex: 1,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                marginTop: -40,
            }}>
                <View style={{
                    width: '100%',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                }}>
                    <View style={{
                        width: '100%',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                    }}>
                        <Ionicons name='chatbubbles' size={24} color={'#777'} />
                        <TextInput
                            style={{
                                flex: 1,
                                fontSize: 16,
                                color: '#333',
                                marginLeft: 8, // Added margin to separate the icon from text input
                                height: 48,
                            }}
                            placeholder='Create a chat'
                            placeholderTextColor={'#777'}
                            value={addchat}
                            onChangeText={(text) => setaddchat(text)}
                        />
                        <TouchableOpacity onPress={CreateNewChat}> 
                            <FontAwesome name='send' size={24} color={'#777'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default AddToChatScreen;
