import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { firestoreDB } from '../config/firbase.config';
import { collection, query, onSnapshot, setDoc, doc, where } from 'firebase/firestore';

const AddToChatScreen = () => {
    const navigation = useNavigation();
    const user = useSelector(state => state.user.user);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            searchUsers(searchQuery.trim());
        } else {
            setFilteredUsers([]);
        }
    }, [searchQuery]);

    const searchUsers = () => {
        try {
            const usersRef = collection(firestoreDB, 'users');
            const q = query(usersRef);
            
            onSnapshot(q, (querySnapshot) => {
                const users = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                const filteredUsers = users.filter(user =>
                    user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredUsers(filteredUsers);
            });
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };
    
    const UserCard = ({ user, onSelectUser }) => {
        return (
            <TouchableOpacity 
                onPress={() => onSelectUser(user)}
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingTop: 16
                }}>
                <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#2F3B6A',
                    padding: 4
                }}>
                    <Ionicons name="person" size={26} color="#2F3B6A" />
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    marginLeft: 16
                }}>
                    <Text style={{
                        color: '#2F3B6A',
                        fontSize: 16,
                        fontWeight: '600',
                        textTransform: 'capitalize'
                    }}>
                        {user.username}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
 
    const CreateNewChat = (selectedUser) => {
        const chatsRef = collection(firestoreDB, "chats");
        const q = query(chatsRef, where("user._id", "==", user._id), where("chatName", "==", selectedUser.username));
    
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            if (!querySnapshot.empty) {
                // Chat exists, navigate to messages screen with existing chat ID
                const existingChat = querySnapshot.docs[0].data();
                unsubscribe(); // Unsubscribe from real-time updates
                Alert.alert('Already have an existing chat with this user')
                navigation.navigate("Messages", { chatId: existingChat._id, selectedUser });
            } else {
                // Chat does not exist, create new chat
                let id = `${Date.now()}`;
                const _doc = {
                    _id: id,
                    user: user,
                    chatName: selectedUser.username
                };
    
                await setDoc(doc(firestoreDB, "chats", id), _doc);
                unsubscribe(); // Unsubscribe from real-time updates
                navigation.navigate("Messages", { chatId: id, selectedUser });
            }
        }, (error) => {
            console.error("Error checking for existing chat: ", error);
            alert("Error: ", error);
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                width: '100%',
                backgroundColor: '#2F3B6A',
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
                    paddingHorizontal: 10,
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
                                marginLeft: 8,
                                height: 48,
                            }}
                            placeholder='Search users'
                            placeholderTextColor={'#777'}
                            value={searchQuery}
                            onSubmitEditing={() => {
                                if (searchQuery.trim() !== "") {
                                    searchUsers()
                                }
                            }}
                            onChangeText={(text) => setSearchQuery(text)}
                        />
                        <TouchableOpacity >
                            <FontAwesome name='send' size={24} color={'#777'} />
                        </TouchableOpacity>
                    </View>
                </View>
                {filteredUsers.length > 0 ? (
                    <FlatList
                        data={filteredUsers}
                        renderItem={({ item }) => <UserCard user={item} onSelectUser={CreateNewChat} />}
                        keyExtractor={(item) => item.id} // Adjust key as per your data structure
                    />
                ) : (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop:12 }}>
                        <Text style={{ fontWeight: '600', fontSize: 16}}>No users found</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default AddToChatScreen;
