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
      // Simple query that doesn't require composite index
      const q = query(
        collection(db, 'supplies'),
        where('donorId', '==', donorId)
      );
      
      const querySnapshot = await getDocs(q);
      const supplies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to JS dates
        dateAdded: doc.data().dateAdded?.toDate(),
        expiryDate: doc.data().expiryDate
      }));
      
      // Sort in JavaScript to avoid needing composite index
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
        // Convert Firestore timestamps to JS dates
        dateAdded: doc.data().dateAdded?.toDate(),
        expiryDate: doc.data().expiryDate
      }));
      
      // Sort in JavaScript
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
        // Convert Firestore timestamps to JS dates
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

  // Get requests for a specific receiver
  getReceiverRequests: async (receiverId) => {
    try {
      const q = query(
        collection(db, 'requests'), 
        where('receiverId', '==', receiverId),
        orderBy('requestDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        requestDate: doc.data().requestDate?.toDate(),
        approvalDate: doc.data().approvalDate?.toDate(),
        completionDate: doc.data().completionDate?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching receiver requests:', error);
      throw error;
    }
  },

  // Get requests for a specific donor
  getDonorRequests: async (donorId) => {
    try {
      const q = query(
        collection(db, 'requests'), 
        where('donorId', '==', donorId),
        orderBy('requestDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        requestDate: doc.data().requestDate?.toDate(),
        approvalDate: doc.data().approvalDate?.toDate(),
        completionDate: doc.data().completionDate?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching donor requests:', error);
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
        approvalDate: doc.data().approvalDate?.toDate(),
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
        approvalDate: doc.data().approvalDate?.toDate(),
        completionDate: doc.data().completionDate?.toDate()
      }));
      callback(requests);
    }, (error) => {
      console.error('Error in donor requests listener:', error);
      callback([]);
    });
  },

  // Get unread requests count for donor
  getUnreadRequestsCount: async (donorId) => {
    try {
      const q = query(
        collection(db, 'requests'),
        where('donorId', '==', donorId),
        where('status', '==', 'pending'),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread requests count:', error);
      return 0;
    }
  },

  // Mark request as read
  markRequestAsRead: async (requestId) => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        isRead: true,
        readAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error marking request as read:', error);
      throw error;
    }
  },
  
  // Update request status (for donors)
  updateRequestStatus: async (requestId, status, message = '') => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      const updateData = {
        status,
        updatedAt: new Date(),
        ...(message && { responseMessage: message })
      };

      // If approved, also update the response timestamp
      if (status === 'approved') {
        updateData.approvedAt = new Date();
      } else if (status === 'rejected') {
        updateData.rejectedAt = new Date();
      }

      await updateDoc(requestRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
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
export const notificationService = {
  // Create notification for donor when new request is made
  createRequestNotification: async (donorId, requestData) => {
    try {
      const notification = {
        recipientId: donorId,
        type: 'new_request',
        title: 'New Supply Request',
        message: `${requestData.receiverName} has requested ${requestData.supplyName}`,
        data: {
          requestId: requestData.id,
          supplyId: requestData.supplyId,
          receiverName: requestData.receiverName,
          supplyName: requestData.supplyName
        },
        isRead: false,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'notifications'), notification);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get notifications for user
  onNotificationsChange: (userId, callback) => {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notifications);
    });
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: new Date()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};
// User Service (optional)
export const userService = {
  // Create user profile
  createUser: async (userId, userData) => {
    try {
      await addDoc(doc(db, 'users', userId), {
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