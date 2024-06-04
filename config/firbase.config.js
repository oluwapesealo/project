import {getApp, getApps, initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyBjYqmAV2dqiOktZd1yPRNufBkdomqu8wg",
    authDomain: "pauboard-6b10a.firebaseapp.com",
    projectId: "pauboard-6b10a",
    storageBucket: "pauboard-6b10a.appspot.com",
    messagingSenderId: "1008301220945",
    appId: "1:1008301220945:web:0627af30a166b03cb68470"
  };

  const app = getApps.length > 0? getApp : initializeApp(firebaseConfig);

  const firebaseAuth = getAuth(app);
  const firestoreDB = getFirestore(app);
  const storage = getStorage(app);

  export {app, firebaseAuth, firestoreDB, storage}