import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Entypo, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, deleteDoc, getDocs } from "firebase/firestore"; // Added deleteDoc and getDocs
import { firestoreDB } from "../config/firbase.config";
import { useSelector } from "react-redux";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'; // Import the necessary components

const ChatScreen = ({ route }) => {
    const { room } = route.params;
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const textInputRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const user = useSelector(state => state.user.user);

    const handleKeyboardOpen = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    const sendMessage = async () => {
        const timeStamp = serverTimestamp();
        const id = `${Date.now()}`;
        const _doc = {
            _id: id,
            roomId: room._id,
            timeStamp: timeStamp,
            message: message,
            user: user,
        };
        setMessage("");
        await addDoc(collection(doc(firestoreDB, "chats", room._id), "messages"), _doc).then(
            () => { }
        ).catch((err) => alert(err));
    };

    const clearChat = async () => {
        const messagesRef = collection(doc(firestoreDB, "chats", room._id), "messages");
        const querySnapshot = await getDocs(messagesRef);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            
        });
        
        navigation.navigate("Messages")
    };

    useLayoutEffect(() => {
        const messageQuery = query(
            collection(firestoreDB, "chats", room?._id, "messages"), orderBy("timeStamp", "asc")
        );
        const unsubscribe = onSnapshot(messageQuery, (querySnap) => {
            const updatedMessages = querySnap.docs.map(doc => doc.data());
            setMessages(updatedMessages);
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);
    
    const deleteChat = async (room) => {
        const eventDocRef = doc(firestoreDB, 'chats', room);
    
        // Show confirmation alert
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this chat?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                try {
                  await deleteDoc(eventDocRef);
                } catch (error) {
                  console.error('Error deleting chat:', error);
                }
              },
              style: 'destructive',
            },
          ],
          { cancelable: false }
        );
      };
if(user.username=== room.chatName){
    room.chatName = room.otherChatName
    return (
        <View style={{ flex: 1 }}>
            <View style={{
                width: '100%',
                backgroundColor: '#2F3B6A', // Replace with your primary color
                paddingHorizontal: 16,
                paddingVertical: 24,
                flex: 0.2,
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
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                    }}>
                        <View style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: 'white',
                            padding: 4,
                            marginRight: 12,
                        }}>
                            <Ionicons name="person" size={24} color="#555" />
                        </View>
                        <View>
                            <Text style={{
                                color: "#FFFFFF",
                                fontSize: 16,
                                fontWeight: '600',
                                textTransform: 'capitalize'
                            }}>
                                {room.chatName.length > 16 ? `${room.chatName.slice(0, 16)}..` : room.chatName}{" "}
                            </Text>
                            <Text style={{
                                color: "#FFFFFF",
                                fontSize: 12,
                                fontWeight: '600',
                                textTransform: 'capitalize'
                            }}>online</Text>
                        </View>
                    </View>
                    <Menu>
                        <MenuTrigger>
                            <Entypo name="dots-three-vertical" size={24} color="#FFFFFF" />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={clearChat}>
                                <Text style={{ padding: 15 }}>Clear Chat</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => deleteChat(room._id)}>
                                <Text style={{ padding: 15 }}>Delete Chat</Text>
                            </MenuOption>
                            {/* Add more MenuOptions here if needed */}
                        </MenuOptions>
                    </Menu>
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
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={160}>
                    <>
                        <ScrollView>
                            {isLoading ? (
                                <View style={{
                                    width: '100%',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <ActivityIndicator size="large" color="#2F3B6A" />
                                </View>
                            ) : (
                                <>
                                    {messages?.map((msg, i) => msg.user.providerData.email === user.providerData.email ?
                                        (
                                            <View style={{ margin: 4 }} key={i}>
                                                <View style={{
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 8,
                                                    borderRadius: 16,
                                                    backgroundColor: '#007bff',
                                                    position: 'relative',
                                                    width: "auto",
                                                    alignSelf: 'flex-end'
                                                }}>
                                                    <Text style={{
                                                        alignSelf: 'flex-end',
                                                        fontSize: 16,
                                                        fontWeight: '600',
                                                        color: '#FFFFFF',
                                                    }}>
                                                        {msg.message}
                                                    </Text>
                                                </View>
                                                <View style={{ alignSelf: 'flex-end' }}>
                                                    {msg?.timeStamp?.seconds && (
                                                        <Text>{new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            hour12: true,
                                                        })}</Text>
                                                    )
                                                    }
                                                </View>
                                            </View>
                                        )
                                        :
                                        (
                                            <View key={i} style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginRight: 8, paddingLeft:10 }}>
                                                <View style={{ marginTop: 4 }}>
                                                    <View style={{
                                                        paddingHorizontal: 16,
                                                        paddingVertical: 8,
                                                        borderRadius: 16,
                                                        backgroundColor: '#A9A9A9',
                                                        position: 'relative',
                                                        width: "auto",
                                                        alignSelf: 'flex-start'
                                                    }}>
                                                        <Text style={{
                                                            alignSelf: 'flex-start',
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                            color: '#FFFFFF',
                                                        }}>
                                                            {msg.message}
                                                        </Text>
                                                    </View>
                                                    <View style={{ alignSelf: 'flex-start' }}>
                                                        {msg?.timeStamp?.seconds && (
                                                            <Text>{new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                hour12: true,
                                                            })}</Text>
                                                        )
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                </>
                            )}
                        </ScrollView>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 32
                            }}>
                            <View style={{
                                backgroundColor: '#E5E7EB',
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <TouchableOpacity onPress={handleKeyboardOpen} style={{ marginRight: 12 }}>
                                    <Entypo name='emoji-happy' size={24} color='#555' />
                                </TouchableOpacity>
                                <TextInput style={{
                                    flex: 1,
                                    height: 32,
                                    fontSize: 16,
                                    color: '#1E40AF',
                                    fontWeight: '600',
                                }}
                                    placeholder="Type Here ..."
                                    placeholderTextColor={'#999'}
                                    value={message}
                                    onChangeText={(text) => setMessage(text)} />
                                <TouchableOpacity>
                                    <Entypo name='mic' size={24} color='#43C651' />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={{ paddingLeft: 32 }} disabled={message.trim() === ''} onPress={sendMessage}>
                                <FontAwesome name='send' size={24} color={'#777'} />
                            </TouchableOpacity>
                        </View>
                    </>
                </KeyboardAvoidingView>
            </View>
        </View>
    );}
    else{
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    width: '100%',
                    backgroundColor: '#2F3B6A', // Replace with your primary color
                    paddingHorizontal: 16,
                    paddingVertical: 24,
                    flex: 0.2,
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
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                        }}>
                            <View style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: 'white',
                                padding: 4,
                                marginRight: 12,
                            }}>
                                <Ionicons name="person" size={24} color="#555" />
                            </View>
                            <View>
                                <Text style={{
                                    color: "#FFFFFF",
                                    fontSize: 16,
                                    fontWeight: '600',
                                    textTransform: 'capitalize'
                                }}>
                                    {room.chatName.length > 16 ? `${room.chatName.slice(0, 16)}..` : room.chatName}{" "}
                                </Text>
                                <Text style={{
                                    color: "#FFFFFF",
                                    fontSize: 12,
                                    fontWeight: '600',
                                    textTransform: 'capitalize'
                                }}>online</Text>
                            </View>
                        </View>
                        <Menu>
                            <MenuTrigger>
                                <Entypo name="dots-three-vertical" size={24} color="#FFFFFF" />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={clearChat}>
                                    <Text style={{ padding: 15 }}>Clear Chat</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => deleteChat(room._id)}>
                                    <Text style={{ padding: 15 }}>Delete Chat</Text>
                                </MenuOption>
                                {/* Add more MenuOptions here if needed */}
                            </MenuOptions>
                        </Menu>
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
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={160}>
                        <>
                            <ScrollView>
                                {isLoading ? (
                                    <View style={{
                                        width: '100%',
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                        <ActivityIndicator size="large" color="#2F3B6A" />
                                    </View>
                                ) : (
                                    <>
                                        {messages?.map((msg, i) => msg.user.providerData.email === user.providerData.email ?
                                            (
                                                <View style={{ margin: 4 }} key={i}>
                                                    <View style={{
                                                        paddingHorizontal: 16,
                                                        paddingVertical: 8,
                                                        borderRadius: 16,
                                                        backgroundColor: '#007bff',
                                                        position: 'relative',
                                                        width: "auto",
                                                        alignSelf: 'flex-end'
                                                    }}>
                                                        <Text style={{
                                                            alignSelf: 'flex-end',
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                            color: '#FFFFFF',
                                                        }}>
                                                            {msg.message}
                                                        </Text>
                                                    </View>
                                                    <View style={{ alignSelf: 'flex-end' }}>
                                                        {msg?.timeStamp?.seconds && (
                                                            <Text>{new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                hour12: true,
                                                            })}</Text>
                                                        )
                                                        }
                                                    </View>
                                                </View>
                                            )
                                            :
                                            (
                                                <View key={i} style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginRight: 8, paddingLeft:10 }}>
                                                    <View style={{ marginTop: 4 }}>
                                                        <View style={{
                                                            paddingHorizontal: 16,
                                                            paddingVertical: 8,
                                                            borderRadius: 16,
                                                            backgroundColor: '#A9A9A9',
                                                            position: 'relative',
                                                            width: "auto",
                                                            alignSelf: 'flex-start'
                                                        }}>
                                                            <Text style={{
                                                                alignSelf: 'flex-start',
                                                                fontSize: 16,
                                                                fontWeight: '600',
                                                                color: '#FFFFFF',
                                                            }}>
                                                                {msg.message}
                                                            </Text>
                                                        </View>
                                                        <View style={{ alignSelf: 'flex-start' }}>
                                                            {msg?.timeStamp?.seconds && (
                                                                <Text>{new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString('en-US', {
                                                                    hour: 'numeric',
                                                                    minute: 'numeric',
                                                                    hour12: true,
                                                                })}</Text>
                                                            )
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                    </>
                                )}
                            </ScrollView>
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: 32
                                }}>
                                <View style={{
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: 16,
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <TouchableOpacity onPress={handleKeyboardOpen} style={{ marginRight: 12 }}>
                                        <Entypo name='emoji-happy' size={24} color='#555' />
                                    </TouchableOpacity>
                                    <TextInput style={{
                                        flex: 1,
                                        height: 32,
                                        fontSize: 16,
                                        color: '#1E40AF',
                                        fontWeight: '600',
                                    }}
                                        placeholder="Type Here ..."
                                        placeholderTextColor={'#999'}
                                        value={message}
                                        onChangeText={(text) => setMessage(text)} />
                                    <TouchableOpacity>
                                        <Entypo name='mic' size={24} color='#43C651' />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{ paddingLeft: 32 }} disabled={message.trim() === ''} onPress={sendMessage}>
                                    <FontAwesome name='send' size={24} color={'#777'} />
                                </TouchableOpacity>
                            </View>
                        </>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }
};

export default ChatScreen;
