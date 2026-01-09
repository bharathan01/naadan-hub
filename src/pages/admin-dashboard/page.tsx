
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import BlogManagement from './components/BlogManagement';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import SiteContent from './components/SiteContent';
import SellerManagement from './components/SellerManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data
  const stats = {
    totalProducts: 156,
    totalBlogs: 23,
    pendingOrders: 12,
    totalSellers: 45,
    pendingApprovals: 8,
    monthlyRevenue: 125000
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'products', name: 'Products', icon: 'ri-shopping-bag-line' },
    { id: 'blogs', name: 'Blog Posts', icon: 'ri-article-line' },
    { id: 'orders', name: 'Orders', icon: 'ri-truck-line' },
    { id: 'sellers', name: 'Sellers', icon: 'ri-group-line' },
    { id: 'content', name: 'Site Content', icon: 'ri-edit-line' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage your platform efficiently</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  <i className="ri-shield-check-line mr-1"></i>
                  Admin Access
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <i className="ri-shopping-bag-line text-2xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <i className="ri-article-line text-2xl text-green-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <i className="ri-truck-line text-2xl text-yellow-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sellers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSellers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <i className="ri-group-line text-2xl text-purple-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <i className="ri-time-line text-2xl text-red-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border lg:col-span-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-primary">₹{stats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <i className="ri-money-rupee-circle-line text-2xl text-primary"></i>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 space-y-2 sticky top-28">
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
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="ri-shopping-bag-line text-white"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">New product added</p>
                        <p className="text-sm text-gray-600">Organic Rice by Green Valley Farm</p>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="ri-user-add-line text-white"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">New seller registered</p>
                        <p className="text-sm text-gray-600">Sunrise Organic Farm - Pending approval</p>
                      </div>
                      <span className="text-sm text-gray-500">5 hours ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <i className="ri-truck-line text-white"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Order shipped</p>
                        <p className="text-sm text-gray-600">Order #1234 - Vegetables Mix</p>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'products' && <ProductManagement />}
              {activeTab === 'blogs' && <BlogManagement />}
              {activeTab === 'orders' && <OrderManagement />}
              {activeTab === 'sellers' && <SellerManagement />}
              {activeTab === 'content' && <SiteContent />}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
