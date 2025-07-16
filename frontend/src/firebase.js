// ১. Firebase SDK থেকে প্রয়োজনীয় ফাংশনগুলো ইম্পোর্ট করুন
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // অথেনটিকেশনের জন্য
import { getFirestore } from "firebase/firestore"; // Firestore ডেটাবেসের জন্য
import { getStorage } from "firebase/storage"; // ফাইল স্টোরেজের জন্য

// ২. আপনার Firebase প্রজেক্টের কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyA-FuEpxVHZPezGyhjxGqmBqjxVpSlJWCo",
  authDomain: "filesify-app-2023.firebaseapp.com",
  projectId: "filesify-app-2023",
  storageBucket: "filesify-app-2023.appspot.com", // << এই লাইনটি চেক করুন
  messagingSenderId: "257781007960",
  appId: "1:257781007960:web:7c93529aabc71f6b6d6c2d"
};

// ৩. Firebase অ্যাপ ইনিশিয়ালাইজ করুন
const app = initializeApp(firebaseConfig);

// ৪. প্রয়োজনীয় সার্ভিসগুলো ইনিশিয়ালাইজ করুন এবং এক্সপোর্ট করুন
// যাতে অন্য ফাইল থেকে এগুলো ইম্পোর্ট করে ব্যবহার করা যায়
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);