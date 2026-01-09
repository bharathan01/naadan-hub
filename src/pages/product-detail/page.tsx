import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  const product = {
    id: 1,
    name: 'Kerala Black Pepper',
    price: 450,
    originalPrice: 550,
    rating: 5,
    reviews: 128,
    inStock: true,
    stock: 50,
    category: 'Spices & Herbs',
    images: [
      'https://readdy.ai/api/search-image?query=premium%20Kerala%20black%20pepper%20in%20small%20bowl%20on%20pure%20white%20background%20high%20quality%20organic%20spice%20close-up%20detailed%20view%20natural%20lighting&width=600&height=600&seq=pd1&orientation=squarish',
      'https://readdy.ai/api/search-image?query=black%20pepper%20plant%20with%20peppercorns%20growing%20on%20vine%20Kerala%20farm%20natural%20setting&width=600&height=600&seq=pd2&orientation=squarish',
      'https://readdy.ai/api/search-image?query=black%20pepper%20powder%20and%20whole%20peppercorns%20on%20white%20background%20spice%20comparison&width=600&height=600&seq=pd3&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Kerala%20black%20pepper%20packaging%20organic%20certified%20product%20label&width=600&height=600&seq=pd4&orientation=squarish',
    ],
    description: 'Premium quality Kerala black pepper, hand-picked from organic farms in the Western Ghats. Known for its bold flavor and aromatic properties, our black pepper is sun-dried naturally to preserve its essential oils and pungency. Perfect for enhancing the taste of any dish.',
    features: [
      'Organically grown without pesticides',
      'Hand-picked and sun-dried',
      'High piperine content',
      'Rich aroma and bold flavor',
      'Certified organic',
      'Direct from Kerala farms'
    ],
    usage: [
      'Add to curries and gravies for enhanced flavor',
      'Grind fresh over salads and soups',
      'Use in marinades for meat and fish',
      'Perfect for pickling and preserving',
      'Mix with other spices for masala blends'
    ],
    specifications: {
      weight: '250g',
      origin: 'Wayanad, Kerala',
      certification: 'Organic Certified',
      shelfLife: '12 months',
      storage: 'Store in cool, dry place'
    }
  };

  const relatedProducts = [
    { id: 3, name: 'Organic Turmeric Powder', price: 320, image: 'https://readdy.ai/api/search-image?query=organic%20turmeric%20powder%20in%20bowl%20with%20fresh%20turmeric%20root%20on%20white%20background%20vibrant%20golden%20yellow%20color%20natural%20Kerala%20spice&width=300&height=300&seq=rp1&orientation=squarish' },
    { id: 6, name: 'Organic Cardamom', price: 890, image: 'https://readdy.ai/api/search-image?query=green%20cardamom%20pods%20in%20wooden%20bowl%20on%20white%20background%20premium%20Kerala%20spice%20aromatic%20organic%20quality&width=300&height=300&seq=rp2&orientation=squarish' },
    { id: 10, name: 'Organic Cinnamon Sticks', price: 280, image: 'https://readdy.ai/api/search-image?query=Ceylon%20cinnamon%20sticks%20on%20white%20background%20premium%20organic%20spice%20natural%20aromatic&width=300&height=300&seq=rp3&orientation=squarish' },
  ];

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    };

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if product exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch custom event to update navbar cart count
    window.dispatchEvent(new Event('cartUpdated'));

    // Show notification
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Added to Cart Notification */}
      {showAddedNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-24 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3"
        >
          <i className="ri-checkbox-circle-fill text-2xl"></i>
          <div>
            <p className="font-semibold">Added to Cart!</p>
            <p className="text-sm opacity-90">{quantity} item(s) added</p>
          </div>
        </motion.div>
      )}

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary cursor-pointer">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/products" className="hover:text-primary cursor-pointer">Products</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div>
              <div className="rounded-3xl overflow-hidden bg-gray-50 mb-4 aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-xl overflow-hidden aspect-square cursor-pointer ${
                      selectedImage === index ? 'ring-4 ring-primary' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <i className="ri-leaf-line"></i>
                  <span>Organic Certified</span>
                </span>
                {product.inStock && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <i className="ri-checkbox-circle-fill"></i>
                    <span>In Stock</span>
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">{product.name}</h1>

              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(product.rating)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400 text-lg"></i>
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-5xl font-bold text-primary">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-semibold">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

              <div className="bg-cream rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-primary cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-subtract-line text-xl"></i>
                    </button>
                    <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-primary cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-add-line text-xl"></i>
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">({product.stock} available)</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-shopping-cart-line text-xl"></i>
                  <span>Add to Cart</span>
                </button>
                <Link
                  to="/cart"
                  className="flex-1 bg-accent text-white py-4 rounded-full font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-flashlight-line text-xl"></i>
                  <span>Buy Now</span>
                </Link>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <i className="ri-truck-line text-xl text-primary"></i>
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <i className="ri-shield-check-line text-xl text-primary"></i>
                  <span>100% Organic & Certified</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <i className="ri-arrow-go-back-line text-xl text-primary"></i>
                  <span>Easy returns within 7 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8">
                {['details', 'usage', 'specifications'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-semibold capitalize cursor-pointer whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose max-w-none"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <i className="ri-checkbox-circle-fill text-primary text-xl mt-1"></i>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {activeTab === 'usage' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Usage Instructions</h3>
                <div className="space-y-4">
                  {product.usage.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-4 bg-cream p-4 rounded-xl">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-600">{instruction}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Specifications</h3>
                <div className="bg-cream rounded-2xl p-8">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-gray-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                        <dd className="text-lg font-semibold text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-gray-50">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                    <span className="text-2xl font-bold text-primary">₹{relatedProduct.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}