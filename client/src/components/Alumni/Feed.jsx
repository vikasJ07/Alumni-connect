// import React, { useRef, useState } from 'react';
// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// import './swiper.css';

// // import required modules
// import { Pagination, Navigation } from 'swiper/modules';

// export default function App() {
//   const [imagePreviews, setImagePreviews] = useState(['https://swiperjs.com/demos/images/nature-1.jpg','https://swiperjs.com/demos/images/nature-1.jpg']);

//   return (
//     <>
//       <Swiper
//         style={{
//           '--swiper-navigation-color': '#fff',
//           '--swiper-pagination-color': '#fff',
//         }}
//         lazy={true}
//         pagination={{
//           clickable: true,
//         }}
//         navigation={true}
//         modules={[Pagination, Navigation]}
//         className="mySwiper"
//       >
//         {imagePreviews.map((preview, index) => (
//   <SwiperSlide key={index}>
//     <img src={preview} alt={`Preview ${index + 1}`} loading="lazy" />
//   </SwiperSlide>
// ))}
//       </Swiper>
//     </>
//   );
// }









import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PostCard from './PostCard';
import { Pagination, Navigation } from 'swiper/modules';
import './swiper.css';

import { useGetRandomPostsQuery } from '../../redux/api/apiSlice';
import useAuth from '../../redux/hooks/useAuth';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user, currentUserId } = useAuth();
  const { data, isLoading } = useGetRandomPostsQuery(currentUserId);

  const fileInputRef = useRef(null);

  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (data) {
      setPosts(data.posts || []);
    }
  }, [data]);

  if (isLoading) {
    return <p className="text-white">Loading.....</p>;
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages(files);
    setImagePreviews((prevPreviews) => [...newPreviews]);
  };

  const handlePost = async () => {
    if (!description && images.length === 0) {
      alert('Please add a description or images.');
      return;
    }

    const formData = new FormData();
    formData.append('username', user);
    formData.append('description', description);
    images.forEach((image) => {
      formData.append('post', image);
    });

    try {
      const response = await fetch('http://localhost:3000/api/v1/post/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost.post, ...posts]);
        setDescription('');
        setImages([]);
        setImagePreviews([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="flex-1 p-4 mt-[67px]">
      <div className="p-4 rounded-md mb-4 mt-[2px] bg-white bg-opacity-20 backdrop-blur-lg border border-white/20 shadow-md">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 rounded-md border border-white/30 bg-transparent text-white placeholder-gray-300"
        ></textarea>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 text-white"
        />

        {imagePreviews.length > 0 && (
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
            {imagePreviews.map((preview, index) => (
              <SwiperSlide key={index}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border border-white/20"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <button
          onClick={handlePost}
          className="mt-2 bg-[#045774] text-white px-4 py-2 rounded-md transition"
        >
          Post
        </button>
      </div>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          postId={post.id}
          user={post.username}
          content={post.description}
          images={post.post}
          profile_photo={post.profile_photo}
          createdAt={post.created_at}
          // likesCount={post.likes_count ? post.likes_count : 0}
        />
      ))}
    </div>
  );
};

export default Feed;
