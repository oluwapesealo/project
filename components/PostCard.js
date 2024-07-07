import React from 'react'

const PostCard = () => {

    return(
        <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>PAU Awards Night</Text>
          <Text style={styles.date}>12/06/2024</Text>
          <Image style={styles.image} source={require('../assets/images/award.jpg')}/>
          <Text style={styles.description}>
            Ready to receive your award, Vote and come to see your candidate win!!!
          </Text>
          
            <View style={styles.interaction}>
              <View style={styles.interactionsbox}>
            <TouchableOpacity>
            <Ionicons name = 'heart-outline' size={24}/>
            </TouchableOpacity>
            <Text style={styles.interactiontext}>Like</Text>
              </View>
              <View style={styles.interactionsbox}>
              <TouchableOpacity>
            <MaterialCommunityIcons name = 'share-outline' size={28}/>
            </TouchableOpacity>
            <Text style={styles.interactiontext}>Share</Text>
              </View>
            </View>
          
        </View>
      </View>
    );
};
export default PostCard;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    text: {
      fontSize: 20,
    },
    card: {
      backgroundColor: '#f8f8f8',
      width: '100%',
      marginBottom: 10,
      borderRadius: 10,
      padding: 10,
    },
    info: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Lato-Regular',
      marginBottom: 5,
    },
    description: {
      marginTop:10,
      fontSize: 14,
      fontWeight: 'normal',
      fontFamily: 'Nunito',
      marginBottom: 5,
    },
    date: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: '#665',
    },
    image:{
      width: '100%',
      height: 250,
      marginTop:15,
  
    },
    interactionsbox:{
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
    },
    interaction:{
      flexDirection:'row',
      justifyContent:'center',
      borderRadius:4,
      paddingLeft:5,
      paddingRight:5,
      backgroundColor: $(props => props.active ? '#2e64e5' : 'transparent')
    },
    interactiontext:{
      fontSize:12,
      fontFamily: 'Lato-Regular',
      fontWeight:'bold',
      color:'#665',
      marginTop:5,
      marginLeft: 5
    },    
    divider:  {
  borderBottomColor:'#333',
  borderBottomWidth: 4,
  width: '90%',
    },
  });
  