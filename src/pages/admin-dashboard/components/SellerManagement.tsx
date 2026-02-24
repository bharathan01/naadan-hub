import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../../services/admin.service';
import toast from 'react-hot-toast';

interface Seller {
  id: string;
  full_name: string;
  store_name: string;
  email: string;
  phone: string;
  location?: string;
  district?: string;
  farm_size?: string;
  farm_type?: string;
  registration_products?: string[];
  role: string;
  is_verified_seller: boolean;
  created_at: string;
}

export default function SellerManagement({
  onAddProduct
}: {
  onAddProduct?: (sellerId: string) => void;
}) {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      setLoading(true);
      const allUsers = await adminService.getAllUsers();
      // Filter only sellers
      const sellerUsers = (allUsers as any[]).filter(user => user.role === 'seller');
      setSellers(sellerUsers);
    } catch (error: any) {
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const updateSellerStatus = async (sellerId: string, isVerified: boolean) => {
    try {
      await adminService.verifySeller(sellerId, isVerified);
      toast.success(isVerified ? 'Seller approved' : 'Seller unverified');
      loadSellers();
    } catch (error: any) {
      toast.error('Failed to update seller status');
    }
  };

  const getSellerStatus = (seller: Seller) => {
    return seller.is_verified_seller ? 'approved' : 'pending';
  };

  const filteredSellers = sellers.filter(seller => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return !seller.is_verified_seller;
    if (filterStatus === 'approved') return seller.is_verified_seller;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seller Management</h2>
            <p className="text-gray-600 mt-1">Review and manage seller applications</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Sellers</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-700 font-medium">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-800">
              {sellers.filter(s => !s.is_verified_seller).length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium">Approved</p>
            <p className="text-2xl font-bold text-green-800">
              {sellers.filter(s => s.is_verified_seller).length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Total Sellers</p>
            <p className="text-2xl font-bold text-gray-800">{sellers.length}</p>
          </div>
        </div>
      </div>

      {/* Sellers List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSellers.map((seller) => (
              <div key={seller.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      {seller.store_name || 'No Store Name'}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[getSellerStatus(seller)]}`}>
                        {getSellerStatus(seller).charAt(0).toUpperCase() + getSellerStatus(seller).slice(1)}
                      </span>
                    </h3>
                    <p className="text-gray-600 mt-1">by {seller.full_name}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Registered: {new Date(seller.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <i className="ri-mail-line"></i>
                        {seller.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <i className="ri-phone-line"></i>
                        {seller.phone || 'N/A'}
                      </p>
                      <p className="flex items-center gap-2">
                        <i className="ri-map-pin-line"></i>
                        {seller.location || 'N/A'}, {seller.district || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Farm Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <i className="ri-landscape-line"></i>
                        {seller.farm_size || 'N/A'} • {seller.farm_type || 'N/A'}
                      </p>
                      <div className="flex items-start gap-2">
                        <i className="ri-leaf-line mt-0.5"></i>
                        <div className="flex flex-wrap gap-1">
                          {seller.registration_products?.map((product, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"
                            >
                              {product}
                            </span>
                          )) || 'No products listed'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  {!seller.is_verified_seller ? (
                    <button
                      onClick={() => updateSellerStatus(seller.id, true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      <i className="ri-check-line"></i>
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => updateSellerStatus(seller.id, false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      <i className="ri-pause-line"></i>
                      Unverify
                    </button>
                  )}

                  <button
                    onClick={() => onAddProduct?.(seller.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-add-line"></i>
                    Add Product
                  </button>

                  <button
                    onClick={() => setSelectedSeller(seller)}
                    className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-eye-line"></i>
                    View Details
                  </button>

                  <a
                    href={`mailto:${seller.email}`}
                    className="text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-mail-line"></i>
                    Contact
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{selectedSeller.store_name}</h3>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <p className="text-gray-600 mt-1">by {selectedSeller.full_name}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Application Status</h4>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[getSellerStatus(selectedSeller)]}`}>
                  {getSellerStatus(selectedSeller).charAt(0).toUpperCase() + getSellerStatus(selectedSeller).slice(1)}
                </span>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Farmer Name</p>
                    <p className="text-gray-600">{selectedSeller.full_name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-600">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">{selectedSeller.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Location</p>
                    <p className="text-gray-600">{selectedSeller.location || 'N/A'}, {selectedSeller.district || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Farm Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Farm Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Farm Name</p>
                    <p className="text-gray-600">{selectedSeller.store_name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Farm Size</p>
                    <p className="text-gray-600">{selectedSeller.farm_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Farm Type</p>
                    <p className="text-gray-600">{selectedSeller.farm_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">District</p>
                    <p className="text-gray-600">{selectedSeller.district || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Products</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeller.registration_products?.map((product, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {product}
                    </span>
                  )) || 'No products listed'}
                </div>
              </div>

              {/* Application Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Registration History</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Registered on {new Date(selectedSeller.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
