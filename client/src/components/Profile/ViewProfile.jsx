import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProfileQuery, useGetAllPostofAlumniQuery, useGetAddInfoQuery, useFriendCountQuery } from '../../redux/api/apiSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { TbBoxMultipleFilled } from "react-icons/tb";
import PostModal from './PostModal';

const ViewProfile = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data, isLoading } = useGetProfileQuery(id);
  const { data: postData, isLoading: postLoader } = useGetAllPostofAlumniQuery(id);
  const { data: additionalInfo, isLoading: infoLoader } = useGetAddInfoQuery(id);
  const { data: count, isLoading: countLoader } = useFriendCountQuery(id);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  useEffect(() => {
    if (postData) {
      setPosts(postData.posts || []);
    }
  }, [postData]);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  if (isLoading || postLoader || countLoader || infoLoader) {
    return <p>Loading....</p>;
  }
 

  return (
    <div className="p-6 mt-[63px] flex flex-col items-center bg-gray-50 min-h-screen">
      {/* Main Profile Section */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-md p-6">
        <div className="bg-white w-full max-w-4xl p-6 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <img
              src={data.data.profile_photo || "https://via.placeholder.com/150"}
              alt="Profile"
              className="rounded-full w-36 h-36 border-4 border-gray-300 cursor-pointer hover:scale-105 transition-transform duration-300 object-cover"
              onClick={openProfileModal}
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{data.data.username}</h2>
              <p className="text-gray-500">{data.data.address || "Profession not specified"}</p>
              <button className="mt-2 px-4 py-1 border rounded-md text-sm font-semibold hover:bg-gray-100">
              Follow
            </button>
            </div>
          </div>
          <div className="text-center">
            <div className="flex space-x-8">
              <div>
                <span className="text-lg font-semibold">{posts.length}</span>
                <p className="text-gray-500 text-sm">Posts</p>
              </div>
              <div>
                <span className="text-lg font-semibold">{count.data || 0}</span>
                <p className="text-gray-500 text-sm">Followers</p>
              </div>
              <div>
                <span className="text-lg font-semibold">{count.data || 0}</span>
                <p className="text-gray-500 text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Image Modal */}
        {isProfileModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={closeProfileModal}
          >
            <div
              className="relative bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={data.data.profile_photo || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-[90vw] h-[90vh] object-contain"
              />
              <button
                onClick={closeProfileModal}
                className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-4">
          {data.data.company_name && (
            <p>I work at {data.data.company_name}</p>
          )}
          {data.data.email && (
            <p>My email is {data.data.email}</p>
          )}
          {data.data.graduationYear && (
            <p>I have graduated in the year {data.data.graduationYear}</p>
          )}
          {additionalInfo?.data?.about && (
            <p><strong>About me</strong> <br /> {additionalInfo.data.about}</p>
          )}
          {additionalInfo?.data?.hobbies && (
            <p>Some Hobbies of mine:  {additionalInfo.data.hobbies}</p>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="w-full max-w-4xl mt-10">
        <div className="grid grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="relative group overflow-hidden cursor-pointer rounded-lg aspect-square"
                onClick={() => openModal(post)}
              >
                <img
                  src={post.post[0] || "https://via.placeholder.com/300"}
                  alt="Post"
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Multi-post Indicator */}
                {post.post.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm rounded-full p-2 flex items-center space-x-1">
                    <TbBoxMultipleFilled />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts available.</p>
          )}
        </div>
      </div>

      {/* Post Modal
      {isModalOpen && selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-lg overflow-hidden max-w-5xl w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full">
              <div className="w-2/3 h-full">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full h-full"
                >
                  {selectedPost.post.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-fit"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="w-1/3 p-4 flex flex-col">
                <p className="mt-4">{selectedPost.description}</p>
                <p className="text-gray-500 mt-2">{selectedPost.likes_count || 0} likes</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-red-500 p-2 rounded-full hover:bg-red-700 transition duration-300"
            >
              ✕
            </button>
          </div>
        </div>
      )} */}
      {isModalOpen && selectedPost && (
        <PostModal selectedPost={selectedPost} closeModal={closeModal} profilePic={data.data.profile_photo} username={data.data.username}/>
      )}
    </div>
  );
};

export default ViewProfile;
