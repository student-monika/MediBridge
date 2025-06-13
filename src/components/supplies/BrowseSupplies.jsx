import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

// Import components
import SupplyNavbar from './SupplyNavbar'; 
import SupplySearch from './SupplySearch';
import SupplyFilters from './SupplyFilters';
import SupplyCard from './SupplyCard';
import SupplyDetails from './SupplyDetails';

// Import services (uncomment when Firebase is set up)
// import { suppliesService, requestsService } from '../../services/firebase';

// Import mock data (remove when Firebase is set up)
import { mockSupplies, mockUser } from '../../utils/mockData';

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

  // Load supplies and requests on component mount
  useEffect(() => {
    loadSupplies();
    loadRequests();
  }, []);

  // Filter supplies based on search and filters
  useEffect(() => {
    filterSupplies();
  }, [supplies, searchTerm, filters]);

  const loadSupplies = async () => {
    try {
      // For development - using mock data
      setSupplies(mockSupplies);
      
      // When Firebase is ready, uncomment this:
      // const suppliesData = await suppliesService.getSupplies();
      // setSupplies(suppliesData);
      
      // Or use real-time listener:
      // const unsubscribe = suppliesService.onSuppliesChange((suppliesData) => {
      //   setSupplies(suppliesData);
      // });
      // return unsubscribe; // Don't forget to cleanup
    } catch (error) {
      console.error('Error loading supplies:', error);
    }
  };

  const loadRequests = async () => {
    try {
      // For development - using empty array
      setRequests([]);
      
      // When Firebase is ready, uncomment this:
      // const requestsData = await requestsService.getReceiverRequests(mockUser.id);
      // setRequests(requestsData);
      
      // Or use real-time listener:
      // const unsubscribe = requestsService.onReceiverRequestsChange(mockUser.id, (requestsData) => {
      //   setRequests(requestsData);
      // });
      // return unsubscribe; // Don't forget to cleanup
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const filterSupplies = () => {
    let filtered = supplies;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(supply =>
        supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.donorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(supply => supply.category === filters.category);
    }

    // Apply location filter
    if (filters.location !== 'All') {
      filtered = filtered.filter(supply => supply.location.includes(filters.location));
    }

    // Apply expiry filter
    if (filters.expiry !== 'All') {
      filtered = filtered.filter(supply => {
        const daysUntilExpiry = Math.ceil((new Date(supply.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        switch (filters.expiry) {
          case 'Within 1 month':
            return daysUntilExpiry <= 30;
          case 'Within 3 months':
            return daysUntilExpiry <= 90;
          case 'Within 6 months':
            return daysUntilExpiry <= 180;
          case 'More than 6 months':
            return daysUntilExpiry > 180;
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

  const handleRequestItem = async (supply) => {
    setLoading(true);
    try {
      const requestData = {
        supplyId: supply.id,
        receiverId: mockUser.id,
        receiverName: mockUser.name,
        receiverEmail: mockUser.email,
        donorId: supply.donorId,
        supplyName: supply.name,
        quantity: supply.quantity,
        unit: supply.unit
      };

      // For development - just show success message
      alert('Request submitted successfully! The donor will be notified.');
      
      // When Firebase is ready, uncomment this:
      // const requestId = await requestsService.createRequest(requestData);
      // console.log('Request created with ID:', requestId);
      
      setSelectedSupply(null);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRequestStatus = (supplyId) => {
    const request = requests.find(req => req.supplyId === supplyId);
    return request ? request.status : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
    <SupplyNavbar />
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Browse supplies
        </h1>
        <p className="text-gray-600">
          Find medical supplies available for donation from healthcare organizations
        </p>
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
        
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredSupplies.length} of {supplies.length} supplies
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Expires within 30 days</span>
            </div>
          </div>
        </div>
        
        {filteredSupplies.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No supplies found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSupplies.map((supply) => (
              <SupplyCard
                key={supply.id}
                supply={supply}
                onViewDetails={setSelectedSupply}
                onRequest={handleRequestItem}
                requestStatus={getRequestStatus(supply.id)}
              />
            ))}
          </div>
        )}
        
        {selectedSupply && (
          <SupplyDetails
            supply={selectedSupply}
            onClose={() => setSelectedSupply(null)}
            onRequest={handleRequestItem}
            requestStatus={getRequestStatus(selectedSupply.id)}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseSupplies;