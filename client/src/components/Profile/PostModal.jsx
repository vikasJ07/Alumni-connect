import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import useAuth from '../../redux/hooks/useAuth';


const PostModal = ({ selectedPost, closeModal, profilePic, username }) => {
    const { role, currentUserId } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentLikes, setCurrentLikes] = useState(0);

  useEffect(() => {

    const getLikeCount = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/like/count?postId=${selectedPost.id}`);
          const data = await response.json();
          setCurrentLikes(data.count);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      };


    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/comment/get?postId=${selectedPost.id}`);
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    getLikeCount();
    fetchComments();
  }, [selectedPost.id]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const response = await fetch('http://localhost:3000/api/comment/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postId: selectedPost.id,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center" onClick={closeModal}>
      <div
        className="relative bg-white rounded-lg overflow-hidden max-w-5xl w-full h-[90vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Slider Section */}
        <div className="w-2/3 h-full">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-full "
          >
            {selectedPost.post.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Comments Section */}
        <div className="w-1/3 p-4 flex flex-col justify-between border-l">
          {/* Post Details */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={profilePic || "https://via.placeholder.com/50"}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h3 className="font-bold">{username}</h3>
            </div>
            <p className="mt-2">{selectedPost.description}</p>
            <p className="text-gray-500 mt-1 text-sm">{currentLikes || 0} likes</p>
          </div>

          {/* Comments Section */}
          <div className="mt-4 flex-1 overflow-y-auto">
            <h4 className="font-semibold mb-2">Comments</h4>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.profile_photo || "https://via.placeholder.com/50"}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-2">
                      <strong className="block">{comment.username}</strong>
                      <p>{comment.content}</p>
                    </div>
                    <div className="text-gray-400 text-xs mt-1 flex items-center space-x-2">
                      <span>{comment.time}</span>
                      {/* <button className="hover:text-red-500 transition duration-300">
                        {comment.liked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Comment Section */}
          <div className="border-t pt-4 text-white">
            <input
              type="text"
              className="border rounded-md w-full p-2 bg-[#045774] text-white placeholder-white"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white bg-[#045774] p-2 rounded-full hover:bg-red-700 transition duration-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default PostModal;
