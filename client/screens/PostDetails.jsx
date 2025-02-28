import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert, Image, ActivityIndicator } from 'react-native';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/authContext';

const PostDetails = ({ route }) => {
  const { post } = route.params;
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [comments, setComments] = useState(post.comments || []);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authState] = useContext(AuthContext);
  const { user } = authState;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem('@auth');
        const authData = JSON.parse(storedAuth);
        const user = authData?.user;
        if (user) {
          setUserId(user._id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUserData();
  }, []);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'ความคิดเห็นต้องไม่ว่างเปล่า');
      return;
    }

    setLoading(true);
    try {
      const storedAuth = await AsyncStorage.getItem('@auth');
      const authData = JSON.parse(storedAuth);
      const token = authData?.token;

      if (!token) {
        Alert.alert('Error', 'ไม่พบโทเค็นการอนุญาต');
        setLoading(false);
        return;
      }

      const url = replyingTo
        ? `http://10.0.2.2:8080/api/v1/post/${post._id}/add-reply/${replyingTo}`
        : `http://10.0.2.2:8080/api/v1/post/add-comment/${post._id}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to send reply');
      }

      const responseData = await response.json();
      setCommentText('');
      setReplyingTo(null);
      setComments(responseData.post.comments);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดขณะส่งความคิดเห็น:', error);
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการส่งความคิดเห็น');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setCommentText('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.content}</Text>
          <Text style={styles.tag}>
            <FontAwesome5 name="hashtag" color="#87CEFA" size={14} /> {post.tag}
          </Text>
        </View>

        <Text style={styles.commentsTitle}>การตอบกลับ</Text>
        <View style={styles.commentsContainer}>
          {comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <View style={styles.commentContent}>
                <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} />
                <View style={styles.commentTextContainer}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.commentInfo}>
                    ตอบกลับโดย : {comment.postedBy?.name || 'ไม่ทราบชื่อ'}: 
                    </Text>
                    <Text style={styles.commentDate}>
                      {moment(comment.created).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <TouchableOpacity onPress={() => handleReply(comment._id)} style={styles.replyButton}>
                    <Text style={styles.replyButtonText}>ตอบกลับ</Text>
                  </TouchableOpacity>
                  {comment.replies &&
                    comment.replies.map((reply, replyIndex) => (
                      <View key={replyIndex} style={styles.reply}>
                        <View style={styles.replyContent}>
                          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} />
                          <View style={styles.replyTextContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text style={styles.replyInfo}>
                              ตอบกลับโดย : {comment.postedBy?.name || 'ไม่ทราบชื่อ'}: 
                              </Text>
                              <Text style={styles.commentDate}>
                                {moment(reply.created).format('DD/MM/YYYY')}
                              </Text>
                            </View>
                            <Text style={styles.replyText}>{reply.text}</Text>
                            <TouchableOpacity onPress={() => handleReply(comment._id)} style={styles.replyButton}>
                              <Text style={styles.replyButtonText}>ตอบกลับ</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text>กำลังตอบกลับความคิดเห็น...</Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)} style={styles.cancelReply}>
              <FontAwesome5 name="times" size={12} color="grey" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder={replyingTo ? 'ตอบกลับความคิดเห็น...' : 'แสดงความคิดเห็น...'}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity style={styles.commentButton} onPress={handleCommentSubmit}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.commentButtonText}>ส่ง</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 0.2,
    borderColor: '#C7C7C7',
    padding: 15,
    marginVertical: 10,
    elevation: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 3,
  },
  title: {
    fontSize: 17,
    paddingBottom: 5,
    borderBottomWidth: 0.3,
    fontFamily: "Kanit",
    fontWeight: 'bold'
  },
  description: {
    color: 'grey',
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Kanit"
  },
  tag: {
    color: '#87CEFA',
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Kanit",
    
  },
  commentsTitle: {
    fontSize: 15,
    marginBottom: 5,
    color: '#404040',
    marginTop: 10
  },
  commentsContainer: {
    marginVertical: 10,
  },
  comment: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentText: {
    fontFamily: "Kanit",
    color: "#404040",
  },
  commentInfo: {
    color: 'grey',
    fontSize: 13,
    fontFamily: "Kanit",
  },
  commentDate: {
    color: 'grey',
    fontSize: 13,
    fontFamily: "Kanit",
  },
  replyButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  replyButtonText: {
    color: '#87CEFA',
    fontFamily: "Kanit"
  },
  reply: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 20,
    marginVertical: 7,
  },
  replyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  replyTextContainer: {
    flex: 1,
  },
  replyText: {
    fontFamily: "Kanit"
  },
  replyInfo: {
    color: 'grey',
    fontSize: 13,
    fontFamily: "Kanit",
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  cancelReply: {
    marginLeft: 5,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontFamily: "Kanit",
  },
  commentButton: {
    backgroundColor: '#87CEFA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  commentButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: "Kanit",
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 10
  },
});

export default PostDetails;
