const Post = require('../models/postsModel')
const AlumniModel = require('../models/alumniModel');
const Friends = require('../models/freindsModel')
const cloudinary = require('cloudinary').v2



const addPost = async (req, res) => {
    const { username } = req.body;
    try {
      if (!req.files || req.files.length === 0) {
                 return res.status(400).send('No files uploaded.');
      }
      // console.log(req.files)
  
      const urls = [];
      //This is cloudinary logic which creates url for any number of posts uploaded and pushs to array urls
      for (const file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: 'alumni_posts', // Cloudinary folder for profile photos
          resource_type: 'image',         // Since it's an image file
      });
        urls.push(uploadResult.secure_url);
      }
  
      // console.log(urls)
      const alumni = await AlumniModel.findAlumniByUsername(username);
      const alumniId = alumni.id;
      const description = req.body.description; 
      const postUrls = urls; 
  
      // Use the Post model to create a new post
      const postId = await Post.create(alumniId, postUrls, description);
  

      res.json({
        message: 'Post created successfully',
        post: { id: postId, username: alumni.username, post: postUrls, description, created_at: alumni.created_at, profile_photo: alumni.profile_photo},//sending alumni because to display about alumni in the post like Company his name
      });
    } catch (err) {
      console.error('Error in addPost:', err);
      res.status(500).send('Error uploading files.');
    }
  };
  
//TOcheck with post man only
// const addPost = async (req, res) => {
//   const { username } = req.body;
//   try {
    
//     const alumni = await AlumniModel.findAlumniByUsername(username);
//     const alumniId = alumni.id;
//     const description = req.body.description; 
//     const postUrls = req.body.urls; 

//     // Use the Post model to create a new post
//     const postId = await Post.create(alumniId, postUrls, description);


//     res.json({
//       message: 'Post created successfully',
//       post: { id: postId, alumni, postUrls, description },//sending alumni because to display about alumni in the post like Company his name
//     });
//   } catch (err) {
//     console.error('Error in addPost:', err);
//     res.status(500).send('Error uploading files.');
//   }
// };

  //Delet the post of alumni
const deletePost = async (req, res) => {
    const{ postId } = req.body;
    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }
    try {
      const isDeleted = await Post.delete(postId)
      if(!isDeleted){
        return res.status(400).json({
          message: "Post not found or could not be deleted"
        })
      }
      return res.status(200).json({
        success: true,
        message: "Post Deleted Successfully",
      })
    } catch (error) {
      console.error("Error deleting post:", error.message);
    return res.status(500).json({
      message: "An internal server error occurred while deleting the post",
      error: error.message,
    });
    }
}

//Increae the like count when a user likes the post (total like count)
const increaseLikeCount = async (req, res) => {
  const{ postId } = req.body;
  if (!postId) {
    return res.status(400).json({
      message: "Post ID is required",
    });
  }
  try {
    const isLike = await Post.like(postId)
    if(!isLike){
      return res.status(400).json({
        message: "Post not found or unable to increase like count"
      })
    }
    return res.status(200).json({
      success: isLike,
      message: "Post Liked Successfully",
    })
  } catch (error) {
    console.error("Error increasing like count:", error.message);
    return res.status(500).json({
      message: "An internal server error occurred while increasing like count",
      error: error.message,
    });
  }
}
//Make sure a user cannot like the post more than once.....plzzzz


//Get three renadom posts from friends of alumni
const getRandomPosts = async (req, res) => {
  try {
    const { id } = req.query;

    // console.log(id);
    const friendsIds = await Friends.getFriendsIds(id);

    if (!friendsIds.length) {
      return res.status(404).json({ message: "No friends found for the given alumni" });
    }
    const posts = await Post.getPostsByAuthors(friendsIds);

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for the friends of the alumni" });
    }

    // Step 3: Randomly select 5 posts
    const shuffledPosts = posts.sort(() => 0.5 - Math.random());
    const selectedPosts = shuffledPosts.slice(0, 5);

    // Step 4: Return the selected posts
    return res.json({
      message: "Here are 5 random posts from friends",
      posts: selectedPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Get all the posts of alumni
const getAllPostsOfAlumni = async (req, res) => {
  const { id } = req.query; 
    try {
        const alumni = await AlumniModel.findById(id);
        if(!alumni){
          return res.status(400).json({
            message: "No Alumni Found",
          })
        }
        const posts = await Post.getAllPostsByAlumniId(id);
        if(!posts || posts.length === 0){
          return res.status(400).json({
            message: "You Have Not uploaded any posts",
          })
        }
        return res.status(200).json({
          alumni,
          posts
        })
    } catch (error) {
      console.error("Error fetching alumni posts:", error);
      return res.status(500).json({
        message: "An error occurred while fetching posts.",
        error: error.message,
      });
    }
}





module.exports = {addPost, getRandomPosts, getAllPostsOfAlumni, deletePost, increaseLikeCount};