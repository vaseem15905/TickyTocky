import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";  


const firebaseConfig = {
  apiKey: "AIzaSyAjOOqBau6-GjeqYzzKXP61RJMlvGmVfDY",
  authDomain: "tickytocky-todolist.firebaseapp.com",
  projectId: "tickytocky-todolist",
  storageBucket: "tickytocky-todolist.firebasestorage.app",
  messagingSenderId: "989144636446",
  appId: "1:989144636446:web:480795d0108080cd9ba20f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };