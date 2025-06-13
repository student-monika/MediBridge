import React, { useState } from 'react';
import { LogOut, User, PackageSearch, ChevronDown } from 'lucide-react';

const Navbar = ({ user = { name: 'John Doe', email: 'john@example.com' } }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        // Add your logout logic here
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        
        if (confirmLogout) {
            // Clear authentication tokens/session data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            sessionStorage.clear();
            
            // Redirect to login page
            window.location.href = '/login';
            
            // Alternative: If using React Router
            // navigate('/login');
            
            // Alternative: If using Firebase Auth
            // auth.signOut();
            
            console.log('User logged out successfully');
        }
    };

    const handleProfileClick = () => {
        // Navigate to profile page
        window.location.href = '/profile';
        // Alternative: navigate('/profile');
        setIsDropdownOpen(false);
    };

    const handleDashboardClick = () => {
        // Navigate to dashboard
        window.location.href = '/dashboard';
        // Alternative: navigate('/dashboard');
    };

    const handleMyRequestsClick = () => {
        // Navigate to my requests page
        window.location.href = '/my-requests';
        // Alternative: navigate('/my-requests');
    };

    return (
        <nav className="bg-white shadow-sm mb-6">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo / Title */}
                <div className="flex items-center gap-2">
                    <PackageSearch className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-semibold text-gray-800">MediBridge</span>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex gap-6 text-gray-700">
                    <button 
                        onClick={handleDashboardClick}
                        className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={handleMyRequestsClick}
                        className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                        My Requests
                    </button>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <User className="h-5 w-5 text-gray-600" />
                            <span className="hidden md:block text-sm text-gray-700">{user.name}</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="py-2">
                                    {/* User Info */}
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    
                                    {/* Profile Option */}
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <User className="h-4 w-4 mr-3" />
                                        Profile
                                    </button>
                                    
                                    {/* Logout Option */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Backdrop to close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;