
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { sellerService } from '../../services/seller.service';
import { authService, UserProfile } from '../../services/auth.service';
import { productService, Product } from '../../services/product.service';
import toast from 'react-hot-toast';
import ProductFormModal from '../../components/feature/ProductFormModal';


export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
    pendingOrders: 0
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) return;

      const userProfile = await authService.getUserProfile(user.id);
      setProfile(userProfile);

      if (userProfile) {
        const [sellerStats, sellerProducts, sellerOrders] = await Promise.all([
          sellerService.getSellerStats(user.id),
          sellerService.getSellerProducts(user.id),
          sellerService.getSellerOrders(user.id)
        ]);

        setStats({
          totalProducts: sellerStats.totalProducts,
          totalSales: sellerStats.totalSales,
          revenue: sellerStats.totalRevenue,
          pendingOrders: sellerStats.pendingOrders
        });
        setProducts(sellerProducts as any);
        setOrders(sellerOrders);
      }
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      const newStatus = (product.status === 'active' ? 'inactive' : 'active') as any;
      await productService.updateProduct(product.id, { status: newStatus });
      toast.success('Product status updated');
      loadDashboardData();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted');
        loadDashboardData();
      } catch (error: any) {
        toast.error('Failed to delete product');
      }
    }
  };

  const [orderToPrint, setOrderToPrint] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await sellerService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      loadDashboardData();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handlePrint = (order: any) => {
    setOrderToPrint(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12">
        {/* Print-only CSS */}
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print-container { visibility: visible !important; position: absolute; top: 0; left: 0; width: 100%; }
            .print-container * { visibility: visible !important; }
            .no-print { display: none !important; }
          }
        `}</style>

        {/* Hidden Printable Content */}
        <div className="print-container hidden print:block bg-white text-black p-8">
          {orderToPrint && (
            <div className="max-w-[800px] border-2 border-black p-8 rounded-lg">
              <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                <div>
                  <h1 className="text-2xl font-black uppercase">Naadan Hub</h1>
                  <p className="text-xs font-bold">Seller Order Receipt</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Order ID: #{orderToPrint.id.slice(0, 8)}</p>
                  <p className="text-[10px] uppercase">{new Date(orderToPrint.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-8 p-6 bg-gray-50 border-2 border-dashed border-black rounded-lg text-sm">
                <p className="font-black mb-2 underline uppercase">To:</p>
                <p className="text-xl font-black">{orderToPrint.customer_name}</p>
                <p className="font-bold">Ph: {orderToPrint.customer_phone}</p>
                <p className="mt-2 font-bold">{orderToPrint.address_line1}</p>
                {orderToPrint.address_line2 && <p className="font-bold">{orderToPrint.address_line2}</p>}
                <p className="font-black">{orderToPrint.city}, {orderToPrint.state} - {orderToPrint.postal_code}</p>
              </div>

              <table className="w-full text-left mb-8">
                <thead className="border-b-2 border-black">
                  <tr>
                    <th className="py-2">Item</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderToPrint.seller_items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-3 font-bold">{item.product_name}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">₹{item.unit_price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right pt-4 border-t-2 border-black">
                <p className="text-xs font-bold uppercase">Seller Subtotal</p>
                <p className="text-2xl font-black">₹{orderToPrint.seller_items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile?.store_name || 'Loading Farm...'}</h1>
                <p className="text-gray-600 mt-2">Managed by {profile?.full_name} • {profile?.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <i className="ri-store-line mr-1"></i>
                  Seller Dashboard
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <i className="ri-shopping-basket-line text-2xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Products</p>
                  <h4 className="text-2xl font-black text-gray-900">{stats.totalProducts}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                  <i className="ri-hand-coin-line text-2xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sales</p>
                  <h4 className="text-2xl font-black text-gray-900">{stats.totalSales}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <i className="ri-money-rupee-circle-line text-2xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</p>
                  <h4 className="text-2xl font-black text-gray-900">₹{stats.revenue.toLocaleString()}</h4>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600">
                  <i className="ri-time-line text-2xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</p>
                  <h4 className="text-2xl font-black text-gray-900">{stats.pendingOrders}</h4>
                </div>
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 space-y-2 sticky top-28">

                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'products'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <i className="ri-shopping-bag-line text-xl"></i>
                  <span className="font-medium">My Products</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'orders'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <i className="ri-truck-line text-xl"></i>
                  <span className="font-medium">Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'profile'
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
                        onClick={() => {
                          setEditingProduct(null);
                          setShowProductModal(true);
                        }}
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
                              src={product.images[0]}
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
                                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${product.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                                  }`}>
                                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                </span>
                              </div>

                              <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                  <i className="ri-box-line"></i>
                                  {product.stock_quantity} in stock
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <i className="ri-edit-line"></i>
                                  Edit
                                </button>
                                <button
                                  onClick={() => toggleProductStatus(product)}
                                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${product.status === 'active'
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
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="ri-truck-line text-6xl text-gray-200 mb-4"></i>
                      <p className="text-gray-500 font-medium">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-2xl p-8 hover:shadow-lg transition-all bg-white group">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">ORDER #{order.id.slice(0, 8)}</p>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)} border-current opacity-80`}>
                                  {order.status}
                                </span>
                              </div>
                              <h3 className="text-xl font-black text-gray-900">{order.customer_name}</h3>
                              <p className="text-sm text-gray-500 font-bold">{order.customer_phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handlePrint(order)}
                                className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all cursor-pointer shadow-sm"
                                title="Print Label"
                              >
                                <i className="ri-printer-line text-lg"></i>
                              </button>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm"
                                title="View Details"
                              >
                                <i className="ri-eye-line text-lg"></i>
                              </button>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                className="bg-gray-50 border-2 border-transparent focus:border-primary px-4 py-2 rounded-xl text-xs font-black outline-none transition-all cursor-pointer uppercase tracking-widest"
                              >
                                <option value="pending">Status</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">My Items in this Order</p>
                            <div className="space-y-3">
                              {order.seller_items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm font-bold">
                                  <span className="text-gray-600 font-medium">
                                    <span className="bg-white px-2 py-0.5 rounded border border-gray-100 mr-2">{item.quantity}</span>
                                    {item.product_name}
                                  </span>
                                  <span className="text-gray-900 font-black">₹{item.unit_price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400">
                              <span className="font-bold uppercase">Ordered on {new Date(order.created_at).toLocaleDateString()}</span>
                              <span className="text-gray-900 font-black text-lg">₹{order.seller_items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                          value={profile?.store_name}
                          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Farmer Name</label>
                        <input
                          type="text"
                          value={profile?.full_name}
                          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={profile?.location || 'Not set'}
                          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <input
                          type="text"
                          value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
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

      {/* Shared Product Form Modal */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          loadDashboardData();
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        initialData={editingProduct}
        sellerId={profile?.id}
        isAdmin={false}
      />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Order Details</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">ID: #{selectedOrder.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Customer Info</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Name</p>
                        <p className="text-gray-900 font-black">{selectedOrder.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Phone</p>
                        <p className="text-gray-900 font-black">{selectedOrder.customer_phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Order Info</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)} border border-current`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Date</p>
                        <p className="text-gray-900 font-black">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 ml-2">Shipping Address</h4>
                  <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl shadow-gray-200">
                    <div className="space-y-2">
                      <p className="text-lg font-black">{selectedOrder.address_line1}</p>
                      {selectedOrder.address_line2 && <p className="text-sm opacity-80">{selectedOrder.address_line2}</p>}
                      <div className="pt-4 border-t border-white/10 mt-4">
                        <p className="font-bold">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postal_code}</p>
                        <p className="text-xs uppercase tracking-widest opacity-60 mt-1">{selectedOrder.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 ml-2">My Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.seller_items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-black shadow-sm border border-gray-100">{item.quantity}</div>
                          <p className="font-black text-gray-900 text-sm">{item.product_name}</p>
                        </div>
                        <p className="font-black text-gray-900">₹{item.quantity * item.unit_price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                  <button
                    onClick={() => handlePrint(selectedOrder)}
                    className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <i className="ri-printer-line"></i>
                    <span>Print Label</span>
                  </button>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">My Subtotal</span>
                    <span className="text-4xl font-black text-primary">₹{selectedOrder.seller_items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
