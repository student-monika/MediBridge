import React, { useState } from 'react';

export default function MyDonations() {
  const [donations, setDonations] = useState([
    {
      id: 1,
      name: 'N95 Face Masks',
      category: 'PPE',
      quantity: '500',
      expiryDate: '15 Aug 2025',
      location: 'Downtown Medical Center',
      status: 'Requested',
      description: 'High quality 3M masks for frontline workers',
      requestedBy: 'City General Hospital',
      requestDate: '10 Jun 2025',
      categoryColor: 'yellow'
    },
    {
      id: 2,
      name: 'Surgical Gloves',
      category: 'PPE',
      quantity: '200 boxes',
      expiryDate: '20 Dec 2025',
      location: 'MedSupply Warehouse',
      status: 'Available',
      description: 'Latex-free, sterile surgical gloves in various sizes',
      categoryColor: 'yellow'
    },
    {
      id: 3,
      name: 'Digital Thermometer',
      category: 'Medical Devices',
      quantity: '25 units',
      expiryDate: '10 Mar 2027',
      location: 'Healthcare Plus',
      status: 'Collected',
      description: 'Infrared contactless thermometers with LCD display',
      collectedBy: 'Rural Health Clinic',
      categoryColor: 'blue'
    },
    {
      id: 4,
      name: 'Paracetamol Tablets',
      category: 'Medication',
      quantity: '1000 tablets',
      expiryDate: '30 Nov 2025',
      location: 'Central Pharmacy',
      status: 'Available',
      description: '500mg tablets, unopened sealed packaging',
      categoryColor: 'purple'
    },
    {
      id: 5,
      name: 'Blood Pressure Monitor',
      category: 'Medical Equipment',
      quantity: '15 units',
      expiryDate: '05 Sep 2026',
      location: 'MediCare Center',
      status: 'Requested',
      description: 'Digital automatic BP monitors with arm cuffs',
      requestedBy: 'Community Health Center',
      requestDate: '12 Jun 2025',
      categoryColor: 'green'
    },
    {
      id: 6,
      name: 'Insulin Vials',
      category: 'Medication',
      quantity: '50 vials',
      expiryDate: '15 Jul 2025',
      location: 'Diabetes Care Clinic',
      status: 'Collected',
      description: 'Fast-acting insulin, refrigerated storage required',
      collectedBy: 'Metro Diabetes Foundation',
      categoryColor: 'purple'
    }
  ]);

  const addDonation = () => {
    // In a real app, this would use React Router
    window.location.href = '#/add-donation';
    alert('Redirecting to Add Donation page...');
  };

  const goToDashboard = () => {
    // In a real app, this would use React Router
    window.location.href = '#/dashboard';
    alert('Redirecting to Dashboard...');
  };

  const acceptRequest = (donation) => {
    if (window.confirm(`Accept request for ${donation.name}?`)) {
      setDonations(prev => prev.map(item => 
        item.id === donation.id 
          ? { ...item, status: 'Accepted', collectedBy: donation.requestedBy }
          : item
      ));
      alert(`Request accepted for ${donation.name}!`);
    }
  };

  const editItem = (itemName) => {
    alert(`Edit ${itemName}`);
  };

  const deleteItem = (donation) => {
    if (window.confirm(`Delete ${donation.name}?`)) {
      setDonations(prev => prev.filter(item => item.id !== donation.id));
      alert(`${donation.name} deleted`);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'Collected':
      case 'Accepted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Requested':
        return 'bg-yellow-500';
      case 'Collected':
      case 'Accepted':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryStyle = (categoryColor) => {
    switch (categoryColor) {
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
            MediBridge
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={goToDashboard}
              className="text-gray-700 hover:text-blue-600 px-2 py-2 sm:px-3 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={addDonation}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all inline-flex items-center gap-1 sm:gap-2 text-sm"
            >
              <span>+</span>
              <span className="hidden sm:inline">Add Donation</span>
              <span className="sm:hidden">Add</span>
            </button>
            <div className="flex items-center gap-2 px-2 py-2 sm:px-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                JD
              </div>
              <span className="hidden sm:inline text-gray-700 font-medium text-sm">John Doe</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-white text-gray-900 py-3 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">My Donations</h1>
            <p className="text-gray-500 text-sm">Track and manage your donated medical supplies</p>
          </div>
          <div className="bg-gray-50 border border-gray-300 px-4 py-3 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Total Donations</div>
            <div className="text-xl font-bold text-gray-800">{donations.length}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-200 min-h-80 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{donation.name}</h3>
                  <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-medium ${getCategoryStyle(donation.categoryColor)}`}>
                    {donation.category}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    className="w-8 h-8 sm:w-7 sm:h-7 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-sm transition-colors"
                    onClick={() => editItem(donation.name)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="w-8 h-8 sm:w-7 sm:h-7 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-sm transition-colors"
                    onClick={() => deleteItem(donation)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 mb-4 flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Quantity:</span>
                  <span className="text-gray-900 font-semibold text-sm">{donation.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Expiry Date:</span>
                  <span className="text-gray-900 font-semibold text-sm">{donation.expiryDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Location:</span>
                  <span className="text-gray-900 font-semibold text-sm">{donation.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Status:</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(donation.status)}`}>
                    <span className={`w-2 h-2 ${getStatusDot(donation.status)} rounded-full`}></span>
                    {donation.status}
                  </span>
                </div>
              </div>

              <div className="text-gray-500 text-sm mb-4 leading-relaxed">
                {donation.description}
              </div>

              {donation.status === 'Requested' && (
                <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 mt-auto">
                  <div className="flex items-center gap-2 mb-2 text-yellow-800 text-sm font-medium">
                    <span>⏰</span>
                    Request Pending
                  </div>
                  <div className="text-gray-500 text-sm mb-3">
                    {donation.requestedBy} requested on {donation.requestDate}
                  </div>
                  <button 
                    className="bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-md font-medium transition-all w-full text-sm"
                    onClick={() => acceptRequest(donation)}
                  >
                    ✓ Accept Request
                  </button>
                </div>
              )}

              {(donation.status === 'Collected' || donation.status === 'Accepted') && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 mt-auto">
                  <strong>Collected by:</strong> {donation.collectedBy}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}