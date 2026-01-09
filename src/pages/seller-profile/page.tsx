import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

interface SellerProfile {
  id: number;
  farmer_name: string;
  farm_name: string;
  location: string;
  district: string;
  phone: string;
  whatsapp: string;
  email: string;
  farm_size: string;
  farm_type: string;
  products: string[];
  description: string;
  certifications: string;
  experience: string;
  status: string;
  created_at: string;
  total_sales: number;
  ongoing_orders: number;
  total_products: number;
  rating: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  sold: number;
  status: string;
}

// Mock data for demonstration
const mockSeller: SellerProfile = {
  id: 1,
  farmer_name: "Ravi Kumar",
  farm_name: "Green Valley Organic Farm",
  location: "Kottayam",
  district: "Kottayam",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "ravi@greenvalley.com",
  farm_size: "5 Acres",
  farm_type: "Organic",
  products: ["Rice", "Vegetables", "Spices", "Coconut"],
  description: "We are a family-owned organic farm dedicated to sustainable farming practices. Our farm has been producing high-quality organic products for over 15 years. We believe in natural farming methods without using any chemical fertilizers or pesticides.",
  certifications: "Organic Certification from Kerala Agricultural University",
  experience: "15+ Years",
  status: "approved",
  created_at: "2024-01-01",
  total_sales: 125000,
  ongoing_orders: 8,
  total_products: 12,
  rating: 4.8
};

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Organic Rice",
    price: 80,
    category: "Grains",
    images: ["https://readdy.ai/api/search-image?query=premium%20organic%20rice%20grains%20in%20burlap%20sack%2C%20natural%20lighting%2C%20rustic%20wooden%20background%2C%20high%20quality%20food%20photography%2C%20detailed%20texture&width=400&height=400&seq=rice1&orientation=squarish"],
    stock: 50,
    sold: 245,
    status: "active"
  },
  {
    id: 2,
    name: "Fresh Vegetables Mix",
    price: 120,
    category: "Vegetables",
    images: ["https://readdy.ai/api/search-image?query=fresh%20organic%20vegetables%20basket%2C%20colorful%20mix%20of%20tomatoes%20carrots%20beans%2C%20natural%20lighting%2C%20farm%20fresh%20produce%20photography&width=400&height=400&seq=veg1&orientation=squarish"],
    stock: 30,
    sold: 189,
    status: "active"
  },
  {
    id: 3,
    name: "Turmeric Powder",
    price: 150,
    category: "Spices",
    images: ["https://readdy.ai/api/search-image?query=organic%20turmeric%20powder%20in%20glass%20jar%2C%20golden%20yellow%20color%2C%20wooden%20spoon%2C%20natural%20lighting%2C%20spice%20photography&width=400&height=400&seq=turmeric1&orientation=squarish"],
    stock: 25,
    sold: 156,
    status: "active"
  },
  {
    id: 4,
    name: "Coconut Oil",
    price: 280,
    category: "Oil",
    images: ["https://readdy.ai/api/search-image?query=pure%20coconut%20oil%20in%20glass%20bottle%2C%20golden%20color%2C%20natural%20lighting%2C%20premium%20organic%20product%20photography&width=400&height=400&seq=oil1&orientation=squarish"],
    stock: 40,
    sold: 312,
    status: "active"
  }
];

export default function SellerProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'reviews'>('about');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setSeller(mockSeller);
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Hi! I'm interested in ordering ${productName} (₹${price}) from ${seller?.farm_name}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/${seller?.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-loader-4-line text-5xl text-primary animate-spin"></i>
            <p className="mt-4 text-gray-600">Loading seller profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Seller Not Found</h2>
            <p className="text-gray-600 mb-6">The seller profile you're looking for doesn't exist or hasn't been approved yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Seller Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-3xl p-6 md:p-12 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              {/* Farm Logo/Image */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <i className="ri-plant-line text-5xl md:text-6xl text-primary"></i>
              </div>

              {/* Seller Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif">
                    {seller.farm_name}
                  </h1>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                    <i className="ri-checkbox-circle-fill mr-1"></i>
                    Verified
                  </span>
                </div>
                <p className="text-lg md:text-xl text-gray-700 mb-4">by {seller.farmer_name}</p>
                
                <div className="flex flex-wrap gap-3 md:gap-4 text-sm md:text-base text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <i className="ri-map-pin-line text-primary"></i>
                    <span>{seller.location}, {seller.district}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-landscape-line text-primary"></i>
                    <span>{seller.farm_size} • {seller.farm_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-time-line text-primary"></i>
                    <span>{seller.experience} Experience</span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
                  >
                    <i className="ri-whatsapp-line text-lg md:text-xl"></i>
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${seller.phone}`}
                    className="bg-primary text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
                  >
                    <i className="ri-phone-line text-lg md:text-xl"></i>
                    Call Now
                  </a>
                  <a
                    href={`mailto:${seller.email}`}
                    className="bg-gray-200 text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
                  >
                    <i className="ri-mail-line text-lg md:text-xl"></i>
                    Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
          >
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-money-rupee-circle-line text-3xl md:text-4xl text-green-600"></i>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">₹{seller.total_sales.toLocaleString()}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-shopping-bag-line text-3xl md:text-4xl text-blue-600"></i>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Ongoing Orders</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{seller.ongoing_orders}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-product-hunt-line text-3xl md:text-4xl text-purple-600"></i>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{seller.total_products}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-star-line text-3xl md:text-4xl text-yellow-500"></i>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Rating</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{seller.rating}/5</p>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-2 border-b-2 border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 md:px-6 py-3 text-sm md:text-base font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'text-primary border-b-2 border-primary -mb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About Farm
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 md:px-6 py-3 text-sm md:text-base font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'text-primary border-b-2 border-primary -mb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 md:px-6 py-3 text-sm md:text-base font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'text-primary border-b-2 border-primary -mb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6 md:gap-8"
            >
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6 md:space-y-8">
                {/* About Section */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">About Our Farm</h2>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {seller.description}
                  </p>
                </div>

                {/* Products We Grow */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Products We Grow</h2>
                  <div className="flex flex-wrap gap-3">
                    {seller.products.map((product, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 md:px-4 py-2 rounded-full text-sm md:text-base font-semibold"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {seller.certifications && (
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Certifications</h2>
                    <div className="flex items-start gap-3">
                      <i className="ri-award-line text-2xl md:text-3xl text-yellow-500"></i>
                      <p className="text-sm md:text-base text-gray-700">{seller.certifications}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Farm Stats */}
                <div className="bg-cream rounded-2xl p-6">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Farm Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base text-gray-600">Farm Size</span>
                      <span className="text-sm md:text-base font-bold text-gray-900">{seller.farm_size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base text-gray-600">Experience</span>
                      <span className="text-sm md:text-base font-bold text-gray-900">{seller.experience}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base text-gray-600">Farm Type</span>
                      <span className="text-sm md:text-base font-bold text-gray-900">{seller.farm_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base text-gray-600">Products</span>
                      <span className="text-sm md:text-base font-bold text-gray-900">{seller.products.length}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-cream rounded-2xl p-6">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Location</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <i className="ri-map-pin-line text-primary mt-1"></i>
                      <div>
                        <p className="text-sm md:text-base font-semibold text-gray-900">{seller.location}</p>
                        <p className="text-xs md:text-sm text-gray-600">{seller.district}, Kerala</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="bg-primary/10 rounded-2xl p-6">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Quick Contact</h3>
                  <div className="space-y-3">
                    <a
                      href={`tel:${seller.phone}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors cursor-pointer"
                    >
                      <i className="ri-phone-line text-lg md:text-xl"></i>
                      <span className="text-xs md:text-sm">{seller.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
                    >
                      <i className="ri-whatsapp-line text-lg md:text-xl"></i>
                      <span className="text-xs md:text-sm">{seller.whatsapp}</span>
                    </a>
                    <a
                      href={`mailto:${seller.email}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors cursor-pointer"
                    >
                      <i className="ri-mail-line text-lg md:text-xl"></i>
                      <span className="text-xs md:text-sm break-all">{seller.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {products.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" data-product-shop>
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -5 }}
                      className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    >
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover object-top"
                        />
                        {product.stock < 10 && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                            Low Stock
                          </span>
                        )}
                      </div>
                      <div className="p-4 md:p-5">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                          {product.category}
                        </span>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mt-2 mb-3">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl md:text-2xl font-bold text-primary">₹{product.price}</span>
                          <span className="text-xs md:text-sm text-gray-600">{product.stock} in stock</span>
                        </div>
                        <div className="flex items-center justify-between mb-4 text-xs md:text-sm text-gray-600">
                          <span>Sold: {product.sold}</span>
                          <span className={`px-2 py-1 rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleWhatsAppOrder(product.name, product.price)}
                          className="w-full bg-green-600 text-white py-2 md:py-3 rounded-full text-sm md:text-base font-semibold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          <i className="ri-whatsapp-line text-lg md:text-xl"></i>
                          Order on WhatsApp
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
                  <p className="text-gray-600">This seller hasn't listed any products yet. Check back soon!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <i className="ri-star-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-6">Be the first to review this seller!</p>
              <button
                onClick={() => {
                  const message = `Hi! I'd like to leave a review for ${seller.farm_name}.`;
                  const whatsappUrl = `https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                Contact Seller
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}