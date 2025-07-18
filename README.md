# FileSafe
FileSafe 📂✨

A secure, modern, and responsive file storage web application built with the MERN stack principles, using React, Firebase, and Bootstrap. This project was developed as part of the CSE 412: Software Engineering course.

![alt text](https://img.shields.io/badge/License-MIT-blue.svg)

![alt text](https://img.shields.io/github/last-commit/shahariar365/FileSafe)

Note for the Grader/Professor
This project demonstrates a complete development lifecycle, from requirement analysis to deployment. It features a secure authentication system, cloud-based file storage, a real-time database, and a fully responsive user interface, all deployed with a modern CI/CD pipeline.
<br>

🚀 Live Demo
You can view the live, deployed version of the application here:

➡️ [Live Site Link](https://filesify.netlify.app/)

<br>

✅ Core Features

🔐 Secure User Authentication: Users can sign up and log in using their email and password.

✉️ Email Verification: New users receive a verification email to activate their accounts, ensuring valid email addresses.

📤 Dynamic File Upload: Upload any file type (images, videos, PDFs, documents) with an option to set a custom name.

☁️ Cloud-Based Storage: All files are securely hosted on Cloudinary, a robust media management platform.

⚡ Real-time Database: File metadata is stored in Firebase Firestore, and the UI updates in real-time as new files are added.

👤 User-Specific Data: Each user can only view and manage their own uploaded files, thanks to secure Firestore rules.

📱 Fully Responsive Design: The UI is built with Bootstrap to be perfectly usable on desktops, tablets, and mobile devices.

🔔 User-Friendly Notifications: Uses react-toastify to provide clear and attractive feedback for actions like login, logout, and file uploads.

🔄 Continuous Deployment: The site is automatically deployed from the main branch to Netlify, ensuring the live version is always up-to-date.
<br>

🛠️ Tech Stack

This project is built with a modern and powerful tech stack:

Frontend	Backend (Serverless)	Styling & UI	Deployment

![alt text](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![alt text](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=for-the-badge)
![alt text](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white&style=for-the-badge)
![alt text](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white&style=for-the-badge)
![alt text](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white&style=for-the-badge)
![alt text](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white&style=for-the-badge)
![alt text](https://img.shields.io/badge/React_Bootstrap-563D7C?logo=react&logoColor=white&style=for-the-badge)
![alt text](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge)
<br>

⚙️ Getting Started: Running the Project Locally

To run this project on your local machine, follow these steps:

Clone the repository:

git clone https://github.com/shahariar365/FileSafe.git

cd FileSafe/frontend

Install dependencies:

npm install

Set up environment variables:

Create a new file named .env in the frontend directory and add the following keys. You can get these values from your Firebase project settings.

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"

REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"

REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"

REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"

REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"

REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"


Update Cloudinary credentials:

In frontend/src/components/dashboard/HomePage.js, 

Update the following constants with your Cloudinary details:

const CLOUDINARY_UPLOAD_PRESET = 'your_cloudinary_upload_preset';

const CLOUDINARY_CLOUD_NAME = 'your_cloudinary_cloud_name';

Start the development server:

npm start

The application will be available at http://localhost:3000.
<br>

🤝 Contact

Shahariar Rahman Rafi - 

Email: shahariar365@gmail.com

Project Link: https://github.com/shahariar365/FileSafe
