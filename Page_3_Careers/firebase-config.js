const firebaseConfig = {
    apiKey: "AIzaSyAwjMv8rZzGY6C181ie9eo7LHHQf6J1NEk",
  authDomain: "spice-junction-harsha.firebaseapp.com",
  projectId: "spice-junction-harsha",
  storageBucket: "spice-junction-harsha.firebasestorage.app",
  messagingSenderId: "333965746558",
  appId: "1:333965746558:web:536ac93559eef53f14532f",
  measurementId: "G-5QHK42LMC6"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
