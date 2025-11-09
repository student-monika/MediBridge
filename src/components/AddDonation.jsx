import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Package, Plus, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { suppliesService } from '../services/firebase'; // Import the service
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

export default function AddDonation() {
  const { currentUser, userRole } = useAuth(); // Get the real user and role
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: '',
    expiryDate: '',
    pickupLocation: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Create a currentDonor object from the authenticated user
  const currentDonor = currentUser ? {
    id: currentUser.uid,
    name: currentUser.displayName,
    email: currentUser.email
  } : null;

  const categories = [
    'Medication', 
    'Medical Equipment', 
    'Surgical Supplies', 
    'Diagnostic Equipment',
    'PPE'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard'); // Use navigate from react-router-dom
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentDonor) {
      setError('You must be logged in to add a donation.');
      setIsSubmitting(false);
      return;
    }

    if (userRole !== 'donor') {
      setError('Only users with the Donor role can add donations.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // Prepare data for Firebase
      const supplyData = {
        itemName: formData.itemName,
        category: formData.category,
        quantity: formData.quantity,
        expiryDate: formData.expiryDate, // Store as string
        pickupLocation: formData.pickupLocation,
        notes: formData.notes,
        // Additional fields for the database
        donorId: currentDonor.id,
        donorName: currentDonor.name,
        donorEmail: currentDonor.email,
        status: 'available'
      };

      // Save to Firebase
      const docId = await suppliesService.addSupply(supplyData);
      console.log('Supply added with ID:', docId);
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        itemName: '',
        category: '',
        quantity: '',
        expiryDate: '',
        pickupLocation: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding donation:', error);
      setError('Failed to add donation. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.itemName && formData.category && formData.quantity && 
                     formData.expiryDate && formData.pickupLocation;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Added Successfully!</h2>
            <p className="text-gray-600 mb-6">Your medical supplies have been listed and are now available for receivers to request.</p>
            <div className="space-y-3">
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Another Donation
              </button>
              <button 
                onClick={() => navigate('/my-donations')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View My Donations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle not authenticated/not donor case
  if (!currentDonor || userRole !== 'donor') {
    if (currentUser === undefined) { // Still loading auth
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              {currentDonor ? 'Only users with the Donor role can add donations.' : 'Please log in as a Donor to access this page.'}
            </p>
            <button 
              onClick={handleDashboardClick}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleDashboardClick}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2"/>
                Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Welcome back,</span>
              <span className="font-medium text-gray-900">{currentDonor.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Donation</h1>
          <p className="text-gray-600">Help others by sharing your surplus medical supplies before they expire.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Item Name */}
                <div>
                  <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    placeholder="e.g., Paracetamol 500mg tablets"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity and Expiry Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 100 tablets, 5 boxes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Pickup Location */}
                <div>
                  <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location / Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="pickupLocation"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      placeholder="Enter full address for pickup"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any special handling instructions, storage conditions, or additional information..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Adding Donation...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span>Add Donation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donor Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Donor Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-600">{currentDonor.name}</p>
                </div>
               
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-600">{currentDonor.email}</p>
                </div>
              </div>
            </div>

            {/* Guidelines & Quick Stats remain unchanged */}
            {/* ... */}
          </div>
        </div>
      </main>
    </div>
  );
}