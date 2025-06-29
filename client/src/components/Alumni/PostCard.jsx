import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import { AiFillLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa6";
import './swiper.css';
import useAuth from '../../redux/hooks/useAuth';

const PostCard = ({ postId, user, profile_photo, createdAt, content, images }) => {
  const { role, currentUserId } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const getLikeCount = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/like/count?postId=${postId}`);
        const data = await response.json();
        setCurrentLikes(data.count);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    const checkIfLiked = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/like/check?postId=${postId}&userId=${currentUserId}&userType=${role}`);
        const data = await response.json();
        setIsLiked(data.isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/comment/get?postId=${postId}`);
        const data = await response.json();
        console.log(data)
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    getLikeCount();
    checkIfLiked();
    fetchComments();
  }, [postId, currentUserId, role]);

  const toggleLike = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/like/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postId,
          userId: currentUserId,
          userType: role,
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Post liked') {
          setIsLiked(true);
          setCurrentLikes(prevLikes => prevLikes + 1);
        } else {
          setIsLiked(false);
          setCurrentLikes(prevLikes => prevLikes - 1);
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const response = await fetch('http://localhost:3000/api/comment/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postId,
          userId: currentUserId,
          userType: role,
          content: newComment
        })
      });

      if (response.ok) {
        setNewComment("");
        const data = await response.json();
        setComments(prevComments => [...prevComments, data.newComment]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 rounded-md shadow-md mb-4 bg-white bg-opacity-20 backdrop-blur-lg border border-white/20">
      <div className="flex items-center mb-2">
        <img
          src={profile_photo}
          alt={`${user}'s profile`}
          className="w-10 h-10 rounded-full object-cover mr-3 border border-white/30"
        />
        <h3 className="font-bold text-lg text-white">{user}</h3>
      </div>

      {images.length > 0 && (
        <Swiper
          style={{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          }}
          pagination={{ clickable: true }}
          navigation
          modules={[Pagination, Navigation]}
          className="mySwiper"
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg border border-white/20"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <p className="text-white mt-3">{user} {content}</p>
      <div className="text-sm text-gray-200">
          <p>Published on {formatDate(createdAt)}</p>
        </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            className={`text-2xl transition ${isLiked ? 'text-[#045774]' : 'text-gray-100 hover:text-[#045774]'}`}
            onClick={toggleLike}
          >
            <AiFillLike />
          </button>
          <span className="text-sm text-gray-100">
            <strong>{currentLikes}</strong> {currentLikes === 1 ? 'like' : 'likes'}
          </span>
        </div>
        <button
          className="text-2xl text-gray-100 hover:text-[#045774] transition"
          onClick={() => setShowComments(!showComments)}
        >
          <FaRegCommentDots /> 
        </button>
      </div>

      {showComments && (
        <div className="mt-3">
          <h4 className="text-white mb-2">Comments:</h4>
          {comments.map((comment, index) => (
            <div key={index} className="mb-2 p-2 rounded-md border text-white">
              <div className="flex items-center mb-1">
                <img 
                  src={comment.profile_photo} 
                  alt={`${comment.name}'s profile`} 
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
                <span className=" text-white">{comment.username}</span>
              </div>
              <p>{comment.content}</p>
              <small className="text-gray-200">{formatDate(comment.created_at)}</small>
            </div>
          ))}
          <div className="mt-2 flex items-center">
            <input
              className="w-full p-2 rounded-md text-black"
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="ml-2 p-2 rounded-md bg-[#045774] text-white" onClick={handleAddComment}>
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
