// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  updateDoc,
  doc
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Database functions
export const suppliesService = {
  // Get all available supplies
  getSupplies: async () => {
    const q = query(collection(db, 'supplies'), where('status', '==', 'available'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Listen to supplies changes
  onSuppliesChange: (callback) => {
    const q = query(collection(db, 'supplies'), where('status', '==', 'available'));
    return onSnapshot(q, (snapshot) => {
      const supplies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(supplies);
    });
  }
};

export const requestsService = {
  // Create a new request
  createRequest: async (requestData) => {
    const docRef = await addDoc(collection(db, 'requests'), {
      ...requestData,
      requestDate: new Date(),
      status: 'pending'
    });
    return docRef.id;
  },

  // Get requests for a specific receiver
  getReceiverRequests: async (receiverId) => {
    const q = query(collection(db, 'requests'), where('receiverId', '==', receiverId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Listen to request changes for a receiver
  onReceiverRequestsChange: (receiverId, callback) => {
    const q = query(collection(db, 'requests'), where('receiverId', '==', receiverId));
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(requests);
    });
  },

  // Update request status (for donors)
  updateRequestStatus: async (requestId, status, contactInfo = null) => {
    const requestRef = doc(db, 'requests', requestId);
    const updateData = {
      status,
      approvalDate: new Date()
    };
    
    if (contactInfo) {
      updateData.donorContact = contactInfo;
    }
    
    await updateDoc(requestRef, updateData);
  }
};