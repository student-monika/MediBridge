// Mock data for development/testing
export const mockSupplies = [
  {
    id: '1',
    name: 'Paracetamol Tablets',
    category: 'Medication',
    quantity: 500,
    unit: 'tablets',
    expiryDate: '2025-08-15',
    location: 'Mumbai, Maharashtra',
    donorId: 'donor1',
    donorName: 'City Hospital',
    donorContact: 'contact@cityhospital.com',
    description: 'Unused stock, properly stored',
    dateAdded: '2025-06-01',
    status: 'available'
  },
  {
    id: '2',
    name: 'Surgical Gloves',
    category: 'Medical Equipment',
    quantity: 200,
    unit: 'pairs',
    expiryDate: '2026-12-31',
    location: 'Delhi, Delhi',
    donorId: 'donor2',
    donorName: 'Metro Clinic',
    donorContact: 'supplies@metroclnic.com',
    description: 'Latex-free, sterile surgical gloves',
    dateAdded: '2025-06-10',
    status: 'available'
  },
  {
    id: '3',
    name: 'Insulin Vials',
    category: 'Medication',
    quantity: 50,
    unit: 'vials',
    expiryDate: '2025-07-20',
    location: 'Bangalore, Karnataka',
    donorId: 'donor3',
    donorName: 'Apollo Pharmacy',
    donorContact: 'donate@apollo.com',
    description: 'Rapid-acting insulin, refrigerated storage',
    dateAdded: '2025-06-05',
    status: 'available'
  }
];

export const mockUser = {
  id: 'receiver1',
  name: 'Rural Health NGO',
  email: 'requests@ruralhealthngo.org',
  type: 'receiver'
};