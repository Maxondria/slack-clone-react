import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBTaiYuLsGq0jPRZzzNMG9zNWkgcK3eZtQ",
  authDomain: "slack-clone-react-app-aba99.firebaseapp.com",
  databaseURL: "https://slack-clone-react-app-aba99.firebaseio.com",
  projectId: "slack-clone-react-app-aba99",
  storageBucket: "slack-clone-react-app-aba99.appspot.com",
  messagingSenderId: "645908875797",
  appId: "1:645908875797:web:b34e6817c5c6a09913dc1c",
  measurementId: "G-81TGQY5EW2"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
