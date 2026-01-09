
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  sales: number;
  image: string;
}

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock seller data
  const sellerInfo = {
    farmName: "Green Valley Organic Farm",
    farmerName: "Ravi Kumar",
    location: "Kottayam, Kerala",
    joinedDate: "January 2024",
    rating: 4.8,
    totalProducts: 12,
    totalSales: 156,
    revenue: 45000,
    pendingOrders: 8
  };

  const [products, setProducts] = useState<Array<Product>>([
    {
      id: 1,
      name: "Organic Rice",
      price: 80,
      stock: 150,
      status: "active",
      sales: 45,
      image: "https://readdy.ai/api/search-image?query=premium%20organic%20rice%20grains%20in%20burlap%20sack%20natural%20lighting%20rustic%20wooden%20background%20high%20quality%20food%20photography&width=300&height=300&seq=rice1&orientation=squarish"
    },
    {
      id: 2,
      name: "Fresh Vegetables Mix",
      price: 120,
      stock: 85,
      status: "active",
      sales: 32,
      image: "https://readdy.ai/api/search-image?query=fresh%20organic%20vegetables%20basket%20colorful%20mix%20tomatoes%20carrots%20beans%20natural%20lighting%20farm%20fresh%20produce&width=300&height=300&seq=veg1&orientation=squarish"
    },
    {
      id: 3,
      name: "Turmeric Powder",
      price: 150,
      stock: 45,
      status: "active",
      sales: 28,
      image: "https://readdy.ai/api/search-image?query=organic%20turmeric%20powder%20in%20glass%20jar%20golden%20yellow%20color%20wooden%20spoon%20natural%20lighting%20spice%20photography&width=300&height=300&seq=turmeric1&orientation=squarish"
    }
  ]);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: ''
  });

  const handleAddProduct = () => {
    if (!formData.name || formData.price <= 0 || formData.stock <= 0) {
      alert('Please fill all required fields with valid values');
      return;
    }

    const newProduct: Product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: formData.name,
      price: formData.price,
      stock: formData.stock,
      status: 'active',
      sales: 0,
      image: `https://readdy.ai/api/search-image?query=${encodeURIComponent(formData.name.toLowerCase())}%20organic%20product%20high%20quality%20food%20photography&width=300&height=300&seq=prod${Date.now()}&orientation=squarish`
    };
    
    setProducts([...products, newProduct]);
    setFormData({ name: '', price: 0, stock: 0, description: '' });
    setShowAddProduct(false);
  };

  const toggleProductStatus = (id: number) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
  };

  const deleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{sellerInfo.farmName}</h1>
                <p className="text-gray-600 mt-2">Managed by {sellerInfo.farmerName} • {sellerInfo.location}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <i className="ri-store-line mr-1"></i>
                  Seller Dashboard
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{sellerInfo.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <i className="ri-shopping-bag-line text-2xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">{sellerInfo.totalSales}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <i className="ri-line-chart-line text-2xl text-green-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-primary">₹{sellerInfo.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <i className="ri-money-rupee-circle-line text-2xl text-primary"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{sellerInfo.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <i className="ri-time-line text-2xl text-yellow-600"></i>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 space-y-2 sticky top-28">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-dashboard-line text-xl"></i>
                  <span className="font-medium">Overview</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-shopping-bag-line text-xl"></i>
                  <span className="font-medium">My Products</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-truck-line text-xl"></i>
                  <span className="font-medium">Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-user-line text-xl"></i>
                  <span className="font-medium">Farm Profile</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="ri-shopping-cart-line text-white"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">New order received</p>
                        <p className="text-sm text-gray-600">Organic Rice - 2kg</p>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="ri-star-line text-white"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">New review received</p>
                        <p className="text-sm text-gray-600">5 stars for Fresh Vegetables Mix</p>
                      </div>
                      <span className="text-sm text-gray-500">5 hours ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <i className="ri-alert-line text-white"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Low stock alert</p>
                        <p className="text-sm text-gray-600">Turmeric Powder - Only 45 units left</p>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm"
                >
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
                        <p className="text-gray-600 mt-1">Manage your product listings</p>
                      </div>
                      <button
                        onClick={() => setShowAddProduct(true)}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
                      >
                        <i className="ri-add-line text-xl"></i>
                        Add Product
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-4">
                      {products.map((product) => (
                        <div key={product.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex gap-6">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-24 h-24 object-cover object-top rounded-lg flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/150x150?text=Product';
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                  <p className="text-primary text-lg font-bold">₹{product.price}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                  product.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                  <i className="ri-box-line"></i>
                                  {product.stock} in stock
                                </span>
                                <span className="flex items-center gap-1">
                                  <i className="ri-shopping-cart-line"></i>
                                  {product.sales} sold
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleProductStatus(product.id)}
                                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                                    product.status === 'active'
                                      ? 'text-red-600 hover:bg-red-50'
                                      : 'text-green-600 hover:bg-green-50'
                                  }`}
                                >
                                  <i className={`${product.status === 'active' ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                                  {product.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => deleteProduct(product.id)}
                                  className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                  <div className="text-center py-12">
                    <i className="ri-truck-line text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-600">Order management will be available soon</p>
                  </div>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Farm Profile</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                        <input
                          type="text"
                          value={sellerInfo.farmName}
                          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Farmer Name</label>
                        <input
                          type="text"
                          value={sellerInfo.farmerName}
                          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={sellerInfo.location}
                          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <input
                          type="text"
                          value={sellerInfo.joinedDate}
                          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <i className="ri-information-line mr-2"></i>
                        Profile editing will be available soon. Contact support for any changes.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock || ''}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) || 0 })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={4}
                  placeholder="Product description..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setFormData({ name: '', price: 0, stock: 0, description: '' });
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!formData.name || formData.price <= 0 || formData.stock <= 0}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Product
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
