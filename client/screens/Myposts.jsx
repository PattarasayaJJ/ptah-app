import { View, Text,StyleSheet, ScrollView  ,link} from 'react-native'
import React from 'react'
import FooterMenu from '../components/Menus/FooterMenu'
import { useState,useEffect } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'


const Myposts = () => {
  //state
  const [posts, setPosts] = useState([])
  const [loading,setLoading] = useState(false)


  //get user post
  const getUserPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/post/get-user-posts`);
      console.log("User posts data:", data); // เพิ่มเพื่อ Debug
      setLoading(false);
      setPosts(data?.userPosts);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching user posts:", error);
      alert(error);
    }
  };
  


  //initaial 

  useEffect(() => {
    getUserPosts();
  },[])
  return (
    <View style={styles.container}>
     
      <ScrollView         
      contentContainerStyle={styles.scrollViewContent}
>
      <Text style={styles.heading}>กระทู้ของฉัน {posts.length} กระทู้
      </Text>

        <PostCard posts={posts} myPostScreen={true}/>
      </ScrollView>
     
    <FooterMenu/>
    </View>

  )
}
const styles = StyleSheet.create({
  
  container : {
      flex: 1 ,
      margin:0,
      justifyContent:"space-between",
      backgroundColor:"white"
    
  },
  heading: {
    fontSize: 20,
    marginTop: 20,
    fontFamily: "Kanit",
    marginLeft:20,
    borderLeftWidth:1,
    padding:10,
    borderColor:"#87CEFA"
  },
  scrollViewContent:{
    paddingBottom:100
  }


})

export default Myposts