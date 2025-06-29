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

import { Pagination, Navigation } from 'swiper/modules';
import '../Alumni/swiper.css';
import PostCard from '../Alumni/PostCard';

import { useGetRandomPostsQuery } from '../../redux/api/apiSlice';
import useAuth from '../../redux/hooks/useAuth';

const StudentPostDisplay = () => {
  const [posts, setPosts] = useState([]);
  const { user, currentUserId } = useAuth();
  const { data, isLoading } = useGetRandomPostsQuery(currentUserId);


  useEffect(() => {
    if (data) {
      setPosts(data.posts || []);
    }
  }, [data]);

  if (isLoading) {
    return <p className="text-white">Loading.....</p>;
  }


  return (
    <div className="flex-1 p-4 mt-[67px]">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          postId={post.id}
          user={post.username}
          content={post.description}
          images={post.post}
          profile_photo={post.profile_photo}
          createdAt={post.created_at}
        />
      ))}
    </div>
  );
};

export default StudentPostDisplay;
