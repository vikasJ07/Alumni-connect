// node --watch server.js
// npm run dev --> client

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const cloudinary = require('cloudinary').v2
const cookieParser =require('cookie-parser')



const userRoutes = require('./routes/userRoute')
const adminRoutes = require('./routes/adminRoute')
const alumniRoutes = require('./routes/alumniRoutes')
const meRoutes = require('./routes/meRoute')
const pendingRoutes = require('./routes/pendingRoute')
const alumniDashRoutes = require('./routes/alumniDashRoute')
const postsRoutes = require('./routes/postsRoute')
const friendRoutes = require('./routes/friendRoutes')
const likeRoutes = require('./routes/likeRoute');
const commentRoutes = require('./routes/commentRoute');
const notificationRoutes = require('./routes/notificationRoute');

const app = express();
const PORT = 3000;


cloudinary.config({ 
    cloud_name: 'dpnfwbjqv', 
    api_key: '853466866189228', 
    api_secret: 'RxmEYGz_8j_B_eQxn2DXqhKmFeI' // Click 'View API Keys' above to copy your API secret
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });
  

app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies)
  }));

app.use(bodyParser.json());
app.use(cookieParser());


app.use('/api/me/',meRoutes)// the controller functions are in userController make a new file
app.use('/api/user/',userRoutes)
app.use('/api/admin/',adminRoutes)
app.use('/api/alumni/',alumniRoutes)
app.use('/api/pending/',pendingRoutes)

app.use('/api/dash/alumni/',alumniDashRoutes)
app.use('/api/v1/post/',postsRoutes)
app.use('/api/friend/', friendRoutes)
app.use('/api/like/', likeRoutes);
app.use('/api/comment/', commentRoutes);
app.use('/api/notification/', notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
