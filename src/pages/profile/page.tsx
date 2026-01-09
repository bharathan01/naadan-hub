import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import ProfileInfo from './components/ProfileInfo';
import DeliveryAddresses from './components/DeliveryAddresses';
import PaymentMethods from './components/PaymentMethods';
import OrderHistory from './components/OrderHistory';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Mock user data - replace with your API authentication later
  const user = {
    id: 'user-123',
    email: 'user@example.com',
    name: 'John Doe'
  };

  const handleLogout = () => {
    // Add your logout logic here when you implement authentication
    navigate('/');
  };

  const tabs = [
    { id: 'profile', name: 'Profile Info', icon: 'ri-user-line' },
    { id: 'addresses', name: 'Delivery Addresses', icon: 'ri-map-pin-line' },
    { id: 'payment', name: 'Payment Methods', icon: 'ri-bank-card-line' },
    { id: 'orders', name: 'Order History', icon: 'ri-shopping-bag-line' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your profile and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${tab.icon} text-xl`}></i>
                    <span className="font-medium text-sm">{tab.name}</span>
                  </button>
                ))}
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap text-red-600 hover:bg-red-50 mt-4 border-t pt-4"
                >
                  <i className="ri-logout-box-line text-xl"></i>
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && <ProfileInfo user={user} />}
              {activeTab === 'addresses' && <DeliveryAddresses userId={user.id} />}
              {activeTab === 'payment' && <PaymentMethods userId={user.id} />}
              {activeTab === 'orders' && <OrderHistory userId={user.id} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}