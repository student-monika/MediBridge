import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

// Import components
import SupplyNavbar from './SupplyNavbar'; 
import SupplySearch from './SupplySearch';
import SupplyFilters from './SupplyFilters';
import SupplyCard from './SupplyCard';
import SupplyDetails from './SupplyDetails';

// Import services - Firebase usage
import { suppliesService, requestsService, notificationService} from '../../services/firebase';

// Import mock data as fallback
import { mockUser } from '../../utils/mockData';

const BrowseSupplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [filteredSupplies, setFilteredSupplies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    expiry: 'All'
  });
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load supplies and requests on component mount
  useEffect(() => {
    let suppliesUnsubscribe;
    let requestsUnsubscribe;

    const setupRealtimeListeners = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set up real-time listener for ALL available supplies from ANY donor
        suppliesUnsubscribe = suppliesService.onSuppliesChange((suppliesData) => {
          console.log('All available supplies updated:', suppliesData);
          // Ensure each supply has proper ID and normalized data
          const normalizedSupplies = suppliesData.map(supply => ({
            ...supply,
            // Ensure ID is present
            id: supply.id,
            // Normalize name field
            name: supply.name || supply.itemName || 'Unnamed Supply',
            // Ensure other required fields exist
            category: supply.category || 'Uncategorized',
            quantity: supply.quantity || 'N/A',
            unit: supply.unit || 'units',
            pickupLocation: supply.pickupLocation || supply.location || 'Location not specified',
            donorName: supply.donorName || 'Anonymous Donor',
            status: supply.status || 'available'
          }));
          
          setSupplies(normalizedSupplies);
          setLoading(false);
        });

        // Set up real-time listener for current user's requests
        if (mockUser && mockUser.id) {
          requestsUnsubscribe = requestsService.onReceiverRequestsChange(mockUser.id, (requestsData) => {
            console.log('User requests updated:', requestsData);
            setRequests(requestsData);
          });
        }

      } catch (error) {
        console.error('Error setting up real-time listeners:', error);
        setError('Failed to load supplies. Please refresh the page.');
        setLoading(false);
      }
    };

    setupRealtimeListeners();

    // Cleanup function to unsubscribe from listeners
    return () => {
      if (suppliesUnsubscribe) {
        suppliesUnsubscribe();
      }
      if (requestsUnsubscribe) {
        requestsUnsubscribe();
      }
    };
  }, []);

  // Filter supplies based on search and filters
  useEffect(() => {
    filterSupplies();
  }, [supplies, searchTerm, filters]);

  const filterSupplies = () => {
    let filtered = supplies;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(supply =>
        supply.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(supply => supply.category === filters.category);
    }

    // Apply location filter
    if (filters.location !== 'All') {
      filtered = filtered.filter(supply => 
        supply.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        supply.pickupLocation?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply expiry filter
    if (filters.expiry !== 'All') {
      filtered = filtered.filter(supply => {
        if (!supply.expiryDate) return true; // Include items without expiry date
        
        const expiryDate = new Date(supply.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        switch (filters.expiry) {
          case 'Within 1 month':
            return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
          case 'Within 3 months':
            return daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
          case 'Within 6 months':
            return daysUntilExpiry <= 180 && daysUntilExpiry >= 0;
          case 'More than 6 months':
            return daysUntilExpiry > 180;
          case 'Expired':
            return daysUntilExpiry < 0;
          default:
            return true;
        }
      });
    }

    setFilteredSupplies(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      location: 'All',
      expiry: 'All'
    });
    setSearchTerm('');
  };

  const handleViewDetails = (supply) => {
    console.log('Viewing details for supply:', supply);
    
    // Validate supply object
    if (!supply || !supply.id) {
      console.error('Invalid supply object:', supply);
      alert('Error: Supply data is invalid. Please refresh the page.');
      return;
    }

    // Set the selected supply with all necessary data
    setSelectedSupply({
      ...supply,
      // Ensure all required fields are present
      id: supply.id,
      name: supply.name || supply.itemName || 'Unnamed Supply',
      category: supply.category || 'Uncategorized',
      quantity: supply.quantity || 'N/A',
      unit: supply.unit || 'units',
      pickupLocation: supply.pickupLocation || supply.location || 'Location not specified',
      donorName: supply.donorName || 'Anonymous Donor',
      status: supply.status || 'available'
    });
  };

const handleRequestItem = async (supply) => {
  console.log('Requesting item:', supply);
  
  // Validate supply object
  if (!supply || !supply.id) {
    console.error('Invalid supply object for request:', supply);
    alert('Error: Supply data is invalid. Please refresh the page.');
    return;
  }

  // Check if user is logged in
  if (!mockUser || !mockUser.id) {
    alert('Please log in to make a request.');
    return;
  }

  // Check if user already has a pending request for this item
  const existingRequest = requests.find(
    req => req.supplyId === supply.id && req.status === 'pending'
  );

  if (existingRequest) {
    alert('You already have a pending request for this item.');
    return;
  }

  setLoading(true);
  try {
    const requestData = {
      supplyId: supply.id,
      receiverId: mockUser.id,
      receiverName: mockUser.name,
      receiverEmail: mockUser.email,
      receiverPhone: mockUser.phone || '',
      donorId: supply.donorId,
      donorName: supply.donorName || 'Anonymous Donor',
      supplyName: supply.name || supply.itemName || 'Unnamed Supply',
      quantity: supply.quantity || 'N/A',
      unit: supply.unit || 'units',
      category: supply.category || 'Uncategorized',
      location: supply.pickupLocation || supply.location || 'Location not specified',
      expiryDate: supply.expiryDate,
      requestMessage: `Request for ${supply.name || supply.itemName || 'Unnamed Supply'} - ${supply.quantity || 'N/A'} ${supply.unit || 'units'}`,
      priority: 'normal',
      isRead: false // ADD THIS FIELD
    };

    console.log('Creating request with data:', requestData);

    // Create the request in Firebase
    const requestId = await requestsService.createRequest(requestData);
    console.log('Request created with ID:', requestId);
    
    // CREATE NOTIFICATION FOR DONOR
    try {
      await notificationService.createRequestNotification(supply.donorId, {
        id: requestId,
        ...requestData
      });
      console.log('Notification sent to donor');
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      // Don't fail the whole request if notification fails
    }
    
    // Show success message
    alert(`Request submitted successfully! Request ID: ${requestId}\nThe donor will be notified and you'll receive updates on your request status.`);
    
    // Close the details modal
    setSelectedSupply(null);
    
  } catch (error) {
    console.error('Error submitting request:', error);
    alert('Error submitting request: ' + (error.message || 'Please try again.'));
  } finally {
    setLoading(false);
  }
};

  const getRequestStatus = (supplyId) => {
    if (!supplyId) return null;
    const request = requests.find(req => req.supplyId === supplyId);
    return request ? request.status : null;
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  // Show loading state
  if (loading && supplies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SupplyNavbar />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading supplies...</h3>
            <p className="text-gray-600">Please wait while we fetch the latest data</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SupplyNavbar />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading supplies</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplyNavbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Available Supplies
          </h1>
          <p className="text-gray-600">
            Find medical supplies available for donation from healthcare organizations
          </p>
          {/* Real-time indicator */}
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-green-600">Live data - updates automatically</span>
          </div>
        </div>
        
        <div className="mb-6">
          <SupplySearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
        
        <div className="mb-6">
          <SupplyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </div>
        
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600">
            Showing {filteredSupplies.length} of {supplies.length} available supplies
            {requests.length > 0 && (
              <span className="ml-2 text-blue-600">
                • {requests.filter(r => r.status === 'pending').length} pending requests
              </span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Expires within 30 days</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Requested</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Available</span>
            </div>
          </div>
        </div>
        
        {filteredSupplies.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {supplies.length === 0 ? 'No supplies available' : 'No supplies found'}
            </h3>
            <p className="text-gray-600">
              {supplies.length === 0 
                ? 'Be the first to add supplies to help others!' 
                : 'Try adjusting your search terms or filters'}
            </p>
            {supplies.length === 0 && (
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSupplies.map((supply) => {
              // Validate supply has ID before rendering
              if (!supply.id) {
                console.warn('Supply without ID detected:', supply);
                return null;
              }

              const daysUntilExpiry = getDaysUntilExpiry(supply.expiryDate);
              const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
              const requestStatus = getRequestStatus(supply.id);
              
              return (
                <SupplyCard
                  key={supply.id}
                  supply={{
                    ...supply,
                    isExpiringSoon,
                    daysUntilExpiry
                  }}
                  onViewDetails={handleViewDetails}
                  onRequest={handleRequestItem}
                  requestStatus={requestStatus}
                  loading={loading}
                />
              );
            })}
          </div>
        )}
        
        {selectedSupply && (
          <SupplyDetails
            supply={{
              ...selectedSupply,
              isExpiringSoon: getDaysUntilExpiry(selectedSupply.expiryDate) <= 30,
              daysUntilExpiry: getDaysUntilExpiry(selectedSupply.expiryDate)
            }}
            onClose={() => setSelectedSupply(null)}
            onRequest={handleRequestItem}
            requestStatus={getRequestStatus(selectedSupply.id)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseSupplies;