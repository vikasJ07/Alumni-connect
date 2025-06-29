# Alumni Connect

A comprehensive full-stack web application that combines an Alumni Networking Platform with a Text OCR (Optical Character Recognition) feature. This project facilitates alumni connections, provides a chat system using Firebase, and includes document text extraction capabilities.

## 🚀 Features

### Alumni Networking Platform
- **User Authentication & Authorization**: Secure login/signup with role-based access (Admin, Alumni, Student)
- **Profile Management**: Complete user profiles with additional information
- **Social Networking**: Friend requests, connections, and networking features
- **Post Management**: Create, like, comment, and share posts
- **Real-time Chat**: Firebase-powered chat system for instant messaging
- **Notifications**: Real-time notifications for various activities
- **Dashboard**: Role-specific dashboards with analytics and insights
- **File Upload**: Profile pictures and document uploads with Cloudinary integration

### Text OCR Application
- **Document Text Extraction**: Extract text from uploaded images
- **Multiple Format Support**: Supports various image formats (JPEG, PNG, etc.)
- **Real-time Processing**: Instant text extraction and display
- **Clean Interface**: Simple and intuitive user interface

## 🛠️ Tech Stack

### Frontend (React + Vite)
- **React 18.3.1** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Material Tailwind** - React components library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Firebase** - Real-time database and authentication
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Icons** - Icon library

### Backend (Node.js + Express)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **CORS** - Cross-origin resource sharing

### Text OCR (Python + Flask)
- **Python** - Programming language
- **Flask** - Web framework
- **Pytesseract** - OCR engine
- **Pillow (PIL)** - Image processing
- **Flask-CORS** - Cross-origin support

## 📁 Project Structure

```
alumni-connect/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Admin/      # Admin-specific components
│   │   │   ├── Alumni/     # Alumni-specific components
│   │   │   ├── Chat/       # Chat-related components
│   │   │   ├── Profile/    # Profile management components
│   │   │   ├── Student/    # Student-specific components
│   │   │   └── signup/     # Authentication components
│   │   ├── redux/          # Redux store and slices
│   │   ├── utils/          # Utility functions
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main application component
│   │   ├── firebase.js     # Firebase configuration
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middlewares
│   ├── createTable/       # Database initialization scripts
│   ├── uploads/           # File upload directory
│   ├── server.js          # Main server file
│   ├── db.js              # Database configuration
│   └── package.json       # Backend dependencies
├── static/                # Static files for OCR app
│   └── uploads/           # OCR image uploads
├── app.py                 # Flask OCR application
├── requirements.txt       # Python dependencies
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MySQL** (v8.0 or higher)
- **Tesseract OCR** (for text extraction)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vikasJ07/Alumni-connect.git
   cd alumni-connect
   ```

2. **Set up the Backend (Node.js)**
   ```bash
   cd server
   npm install
   ```

3. **Set up the Frontend (React)**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up the Text OCR (Python)**
   ```bash
   cd ..
   pip install -r requirements.txt
   ```

### Environment Configuration

1. **Backend Environment Variables**
   Create a `.env` file in the `server` directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=alumni_connect
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

2. **Frontend Environment Variables**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

### Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE alumni_connect;
   USE alumni_connect;
   ```

2. **Run Database Initialization Scripts**
   ```bash
   cd server/createTable
   # Run the initialization scripts in order
   node initAdminTable.js
   node initAlumniTable.js
   node initStudentTable.js
   # ... (run other table creation scripts)
   ```

### Tesseract OCR Setup

1. **Install Tesseract OCR**
   - **Windows**: Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
   - **macOS**: `brew install tesseract`
   - **Linux**: `sudo apt-get install tesseract-ocr`

2. **Update the Tesseract path** in `app.py`:
   ```python
   pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"  # Windows
   # or
   pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'  # Linux/macOS
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd server
   node server.js
   # Server will run on http://localhost:3000
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   # Frontend will run on http://localhost:5173
   ```

3. **Start the Text OCR Server**
   ```bash
   python app.py
   # OCR server will run on http://localhost:5000
   ```

### Production Build

1. **Build the Frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Serve the Production Build**
   ```bash
   npm run preview
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout

### User Management
- `GET /api/me/profile` - Get user profile
- `PUT /api/me/profile` - Update user profile
- `POST /api/me/upload` - Upload profile picture

### Alumni Features
- `GET /api/alumni/` - Get all alumni
- `POST /api/alumni/connect` - Send connection request
- `GET /api/alumni/connections` - Get user connections

### Posts & Social Features
- `GET /api/v1/post/` - Get all posts
- `POST /api/v1/post/` - Create new post
- `POST /api/like/` - Like/unlike post
- `POST /api/comment/` - Add comment

### Text OCR
- `POST /upload` - Upload image for text extraction

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Cross-origin resource sharing configuration
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure file upload with validation

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first responsive layout
- **Modern UI**: Clean and intuitive user interface
- **Real-time Updates**: Live notifications and chat
- **Dark/Light Mode**: Theme customization (if implemented)
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Backend Deployment (Heroku/Railway)
1. Set up environment variables
2. Configure database connection
3. Deploy the server

### OCR Service Deployment
1. Deploy to platforms supporting Python (Railway, Render)
2. Install Tesseract OCR on the server
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vikas J** - [GitHub Profile](https://github.com/vikasJ07)

## 🙏 Acknowledgments

- Firebase for real-time features
- Tesseract OCR for text extraction
- Cloudinary for file storage
- All contributors and supporters



---

**Note**: Make sure to replace placeholder values (API keys, database credentials, etc.) with your actual configuration values before running the application. 