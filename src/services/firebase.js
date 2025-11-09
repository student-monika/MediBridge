import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp,
  deleteDoc,
  getDoc
  // Removed 'limit' import as it was only used by notificationService
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Supplies Service
export const suppliesService = {
  // Get all available supplies (one-time fetch)
  getSupplies: async () => {
    try {
      const q = query(
        collection(db, 'supplies'), 
        where('status', '==', 'available'),
        orderBy('dateAdded', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to JS dates
        dateAdded: doc.data().dateAdded?.toDate(),
        expiryDate: doc.data().expiryDate
      }));
    } catch (error) {
      console.error('Error fetching supplies:', error);
      throw error;
    }
  },

  // Get all supplies for a specific donor (regardless of status)
  getDonorSupplies: async (donorId) => {
    try {
      const q = query(
        collection(db, 'supplies'),
        where('donorId', '==', donorId)
      );
      
      const querySnapshot = await getDocs(q);
      const supplies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateAdded: doc.data().dateAdded?.toDate(),
        expiryDate: doc.data().expiryDate
      }));
      
      supplies.sort((a, b) => {
        if (a.dateAdded && b.dateAdded) {
          return b.dateAdded.getTime() - a.dateAdded.getTime();
        }
        return a.itemName.localeCompare(b.itemName);
      });
      
      return supplies;
    } catch (error) {
      console.error('Error getting donor supplies:', error);
      throw error;
    }
  },

  // Listen to donor supplies changes (real-time)
  onDonorSuppliesChange: (donorId, callback) => {
    const q = query(
      collection(db, 'supplies'),
      where('donorId', '==', donorId)
    );

    return onSnapshot(q, (querySnapshot) => {
      const supplies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateAdded: doc.data().dateAdded?.toDate(),
        expiryDate: doc.data().expiryDate
      }));
      
      supplies.sort((a, b) => {
        if (a.dateAdded && b.dateAdded) {
          return b.dateAdded.getTime() - a.dateAdded.getTime();
        }
        return a.itemName.localeCompare(b.itemName);
      });
      
      callback(supplies);
    }, (error) => {
      console.error('Error in donor supplies listener:', error);
      callback([]);
    });
  },

  // Listen to supplies changes (real-time)
  onSuppliesChange: (callback) => {
    const q = query(
      collection(db, 'supplies'), 
      where('status', '==', 'available'),
      orderBy('dateAdded', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const supplies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateAdded: doc.data().dateAdded?.toDate(),
        expiryDate: doc.data().expiryDate
      }));
      callback(supplies);
    }, (error) => {
      console.error('Error in supplies listener:', error);
      callback([]); // Return empty array on error
    });
  },

  // Add a new supply (for donors)
  addSupply: async (supplyData) => {
    try {
      const docRef = await addDoc(collection(db, 'supplies'), {
        ...supplyData,
        dateAdded: serverTimestamp(),
        status: 'available'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding supply:', error);
      throw error;
    }
  },

  // Update supply status
  updateSupplyStatus: async (supplyId, status) => {
    try {
      const supplyRef = doc(db, 'supplies', supplyId);
      await updateDoc(supplyRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating supply:', error);
      throw error;
    }
  },

  // Delete supply
  deleteSupply: async (supplyId) => {
    try {
      await deleteDoc(doc(db, 'supplies', supplyId));
    } catch (error) {
      console.error('Error deleting supply:', error);
      throw error;
    }
  }
};

// Requests Service
export const requestsService = {
  // Create a new request
  createRequest: async (requestData) => {
    try {
      const docRef = await addDoc(collection(db, 'requests'), {
        ...requestData,
        requestDate: serverTimestamp(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },

  // Get a single supply item (used by receiver to get donor contact info)
  getSupplyById: async (supplyId) => {
    try {
      const docSnap = await getDoc(doc(db, 'supplies', supplyId));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting supply by ID:', error);
      throw error;
    }
  },
  
  // Function for the Donor to respond to a request (Accept/Reject/Collected)
  respondToRequest: async (requestId, supplyId, status, responseMessage = '') => {
    const requestRef = doc(db, 'requests', requestId);
    const supplyRef = doc(db, 'supplies', supplyId);
    const updateData = {
      status,
      updatedAt: serverTimestamp(),
      responseMessage,
    };

    try {
      // 1. Update Request Document
      if (status === 'approved') {
        updateData.approvedAt = serverTimestamp();
        
        // 2. Update Supply Status: Mark as reserved/accepted by one party
        await updateDoc(supplyRef, {
          status: 'reserved', // Mark supply as reserved once accepted
          updatedAt: serverTimestamp()
        });
        
      } else if (status === 'rejected') {
        updateData.rejectedAt = serverTimestamp();
        
      } else if (status === 'collected') {
        updateData.completionDate = serverTimestamp();
        
        // Update Supply Status to collected/distributed
        await updateDoc(supplyRef, {
          status: 'collected', 
          updatedAt: serverTimestamp()
        });
      }

      await updateDoc(requestRef, updateData);
      return true;
    } catch (error) {
      console.error('Error responding to request:', error);
      throw error;
    }
  },

  // Listen to request changes for a receiver (real-time)
  onReceiverRequestsChange: (receiverId, callback) => {
    const q = query(
      collection(db, 'requests'), 
      where('receiverId', '==', receiverId),
      orderBy('requestDate', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        requestDate: doc.data().requestDate?.toDate(),
        approvedAt: doc.data().approvedAt?.toDate(),
        completionDate: doc.data().completionDate?.toDate()
      }));
      callback(requests);
    }, (error) => {
      console.error('Error in receiver requests listener:', error);
      callback([]);
    });
  },

  // Listen to request changes for a donor (real-time)
  onDonorRequestsChange: (donorId, callback) => {
    const q = query(
      collection(db, 'requests'), 
      where('donorId', '==', donorId),
      orderBy('requestDate', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        requestDate: doc.data().requestDate?.toDate(),
        approvedAt: doc.data().approvedAt?.toDate(),
        completionDate: doc.data().completionDate?.toDate()
      }));
      callback(requests);
    }, (error) => {
      console.error('Error in donor requests listener:', error);
      callback([]);
    });
  },
  
  // Cancel request (for receivers)
  cancelRequest: async (requestId) => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'cancelled',
        cancelledDate: serverTimestamp()
      });
    } catch (error) {
      console.error('Error cancelling request:', error);
      throw error;
    }
  }
};

// Removed the entire notificationService block for cleanup.

// User Service (optional)
export const userService = {
  // Create user profile
  createUser: async (userId, userData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user profile
  getUser: async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          lastActive: docSnap.data().lastActive?.toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
};