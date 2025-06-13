import React from 'react';
import { Filter } from 'lucide-react';

const SupplyFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const categories = ['All', 'Medication', 'Medical Equipment', 'Surgical Supplies', 'Diagnostic Equipment'];
  const locations = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  const expiryOptions = ['All', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'More than 6 months'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="mr-2" size={20} />
          Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
          <select
            value={filters.expiry}
            onChange={(e) => onFilterChange('expiry', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {expiryOptions.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SupplyFilters;