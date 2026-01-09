
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Seller {
  id: number;
  farmer_name: string;
  farm_name: string;
  email: string;
  phone: string;
  location: string;
  district: string;
  farm_size: string;
  farm_type: string;
  products: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  created_at: string;
  approved_at?: string;
}

export default function SellerManagement() {
  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: 1,
      farmer_name: "Ravi Kumar",
      farm_name: "Green Valley Organic Farm", 
      email: "ravi@greenvalley.com",
      phone: "+91 98765 43210",
      location: "Kottayam",
      district: "Kottayam",
      farm_size: "5 Acres",
      farm_type: "Organic",
      products: ["Rice", "Vegetables", "Spices"],
      status: "approved",
      created_at: "2024-01-10",
      approved_at: "2024-01-12"
    },
    {
      id: 2,
      farmer_name: "Priya Nair",
      farm_name: "Sunrise Organic",
      email: "priya@sunrise.com", 
      phone: "+91 87654 32109",
      location: "Thrissur",
      district: "Thrissur",
      farm_size: "3 Acres",
      farm_type: "Organic",
      products: ["Vegetables", "Fruits", "Herbs"],
      status: "pending",
      created_at: "2024-01-15"
    },
    {
      id: 3,
      farmer_name: "Arun Menon",
      farm_name: "Spice Garden",
      email: "arun@spicegarden.com",
      phone: "+91 76543 21098", 
      location: "Wayanad",
      district: "Wayanad",
      farm_size: "8 Acres",
      farm_type: "Organic",
      products: ["Spices", "Coffee", "Pepper"],
      status: "approved",
      created_at: "2024-01-08",
      approved_at: "2024-01-09"
    },
    {
      id: 4,
      farmer_name: "Seetha Laksmi",
      farm_name: "Coconut Grove",
      email: "seetha@coconutgrove.com",
      phone: "+91 65432 10987",
      location: "Alappuzha", 
      district: "Alappuzha",
      farm_size: "12 Acres",
      farm_type: "Traditional",
      products: ["Coconut", "Coconut Oil", "Copra"],
      status: "rejected",
      created_at: "2024-01-12"
    }
  ]);

  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-100 text-gray-800'
  };

  const updateSellerStatus = (sellerId: number, newStatus: Seller['status']) => {
    setSellers(sellers.map(seller => 
      seller.id === sellerId 
        ? { 
            ...seller, 
            status: newStatus,
            approved_at: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : seller.approved_at
          }
        : seller
    ));
  };

  const filteredSellers = filterStatus === 'all' 
    ? sellers 
    : sellers.filter(seller => seller.status === filterStatus);

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-700 font-medium">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-800">
              {sellers.filter(s => s.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium">Approved</p>
            <p className="text-2xl font-bold text-green-800">
              {sellers.filter(s => s.status === 'approved').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-700 font-medium">Rejected</p>
            <p className="text-2xl font-bold text-red-800">
              {sellers.filter(s => s.status === 'rejected').length}
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
        <div className="space-y-4">
          {filteredSellers.map((seller) => (
            <div key={seller.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {seller.farm_name}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[seller.status]}`}>
                      {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                    </span>
                  </h3>
                  <p className="text-gray-600 mt-1">by {seller.farmer_name}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Applied: {new Date(seller.created_at).toLocaleDateString()}</p>
                  {seller.approved_at && (
                    <p>Approved: {new Date(seller.approved_at).toLocaleDateString()}</p>
                  )}
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
                      {seller.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="ri-map-pin-line"></i>
                      {seller.location}, {seller.district}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Farm Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <i className="ri-landscape-line"></i>
                      {seller.farm_size} • {seller.farm_type}
                    </p>
                    <div className="flex items-start gap-2">
                      <i className="ri-leaf-line mt-0.5"></i>
                      <div className="flex flex-wrap gap-1">
                        {seller.products.map((product, index) => (
                          <span 
                            key={index}
                            className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                {seller.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateSellerStatus(seller.id, 'approved')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      <i className="ri-check-line"></i>
                      Approve
                    </button>
                    <button
                      onClick={() => updateSellerStatus(seller.id, 'rejected')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      <i className="ri-close-line"></i>
                      Reject
                    </button>
                  </>
                )}
                
                {seller.status === 'approved' && (
                  <button
                    onClick={() => updateSellerStatus(seller.id, 'suspended')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-pause-line"></i>
                    Suspend
                  </button>
                )}

                {seller.status === 'suspended' && (
                  <button
                    onClick={() => updateSellerStatus(seller.id, 'approved')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-play-line"></i>
                    Reactivate
                  </button>
                )}

                {seller.status === 'rejected' && (
                  <button
                    onClick={() => updateSellerStatus(seller.id, 'pending')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <i className="ri-refresh-line"></i>
                    Review Again
                  </button>
                )}
                
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
                <h3 className="text-xl font-bold text-gray-900">{selectedSeller.farm_name}</h3>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <p className="text-gray-600 mt-1">by {selectedSeller.farmer_name}</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Application Status</h4>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[selectedSeller.status]}`}>
                  {selectedSeller.status.charAt(0).toUpperCase() + selectedSeller.status.slice(1)}
                </span>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Farmer Name</p>
                    <p className="text-gray-600">{selectedSeller.farmer_name}</p>
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
                    <p className="text-gray-600">{selectedSeller.location}, {selectedSeller.district}</p>
                  </div>
                </div>
              </div>

              {/* Farm Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Farm Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Farm Name</p>
                    <p className="text-gray-600">{selectedSeller.farm_name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Farm Size</p>
                    <p className="text-gray-600">{selectedSeller.farm_size}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Farm Type</p>
                    <p className="text-gray-600">{selectedSeller.farm_type}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">District</p>
                    <p className="text-gray-600">{selectedSeller.district}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Products</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeller.products.map((product, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {/* Application Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Application Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Applied on {new Date(selectedSeller.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedSeller.approved_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">
                        Approved on {new Date(selectedSeller.approved_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
