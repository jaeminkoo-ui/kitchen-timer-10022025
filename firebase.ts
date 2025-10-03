import { initializeApp } from "firebase/app";
// Analytics 대신 Auth와 Firestore를 가져옵니다.
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 이 부분은 사용자의 키가 맞습니다. 그대로 두세요.
const firebaseConfig = {
    apiKey: "AIzaSyAyUGIWLfihy2OUPNw4E-yUYRqaBvJWvmU",
    authDomain: "kitchen-fryer-timer.firebaseapp.com",
    projectId: "kitchen-fryer-timer",
    storageBucket: "kitchen-fryer-timer.firebasestorage.app",
    messagingSenderId: "743974691277",
    appId: "1:743974691277:web:87b8476a4f35e0eafbe484",
    measurementId: "G-20CLWRPQKC"  
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 로그인(auth)과 데이터베이스(db) 기능을 초기화하고 다른 파일에서 쓸 수 있게 내보냅니다.
export const auth = getAuth(app);
export const db = getFirestore(app);