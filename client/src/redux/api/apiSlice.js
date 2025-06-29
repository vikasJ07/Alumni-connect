import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }), 
  tagTypes: ['Friends', 'Profile', 'StudentProfile'],
  endpoints: (builder) => ({
    fetchFriends: builder.query({
      query: (id) => `/friend/display?id=${id}`,
      providesTags: ['Friends'],
    }),
    getProfile: builder.query({
      query: (id) => `/dash/alumni/profiledetails?id=${id}`,
      providesTags: ['Profile'],
    }),

    getStudentProfile: builder.query({
      query: (id) => `/user/profile?id=${id}`,
      providesTags: ['StudentProfile'],
    }),

    // New endpoint for updating additional info
    updateAddInfo: builder.mutation({
      query: (data) => ({
        url: '/dash/alumni/updateAddInfo',
        method: 'POST',
        body: data, 
      }),
    }),

    updateProfileDetails: builder.mutation({
      query:(data) =>({
        url: '/dash/alumni/profileupdate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    updateStudentProfileDetails: builder.mutation({
      query:(data) =>({
        url: '/user/update/profiledetails',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['StudentProfile'],
    }),

    updateAddStudentInfo: builder.mutation({
      query: (data) => ({
        url: '/user/update/studentaddinfo',
        method: 'POST',
        body: data, 
      }),
    }),

    connectToFriend: builder.mutation({
      query: (data) =>({
        url:'/friend/connect',
        method:'POST',
        body: data,
      }),
      invalidatesTags: ['Friends'],                                             
    }),

    getRandomPosts: builder.query({
      query: (id) => `/v1/post/randomPosts?id=${id}`,
    }),

    getAlumniSuggestions: builder.query({
      query: (id) => `/dash/alumni/suggest?id=${id}`
    }),
    
    getAddInfo: builder.query({
      query: (id) => ({
        url: `/dash/alumni/addInfo?id=${id}`,
      }),
    }),

    getAddStudentInfo: builder.query({
      query: (id) => ({
        url: `/user/addStudInfo?id=${id}`,
      }),
    }),
    getAllPostofAlumni: builder.query({
      query: (id) => ({
        url: `/v1/post/allposts?id=${id}`,
      })
    }),

    friendCount: builder.query({
      query: (id) => ({
        url: `/friend/count?id=${id}`
      })
    })
  }),
});

export const {
  useFetchFriendsQuery,
  useGetProfileQuery,
  useGetStudentProfileQuery,
  useUpdateAddInfoMutation,  
  useGetAddInfoQuery, 
  useUpdateProfileDetailsMutation,  
  useUpdateStudentProfileDetailsMutation,
  useGetRandomPostsQuery,   
  useGetAlumniSuggestionsQuery,  
  useConnectToFriendMutation,
  useGetAllPostofAlumniQuery,
  useFriendCountQuery,
  useUpdateAddStudentInfoMutation,
  useGetAddStudentInfoQuery,
} = apiSlice;
