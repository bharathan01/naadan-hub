import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import WhatsAppOrderModal from '../../components/feature/WhatsAppOrderModal';
import { productService } from '../../services/product.service';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  useEffect(() => {
    if (id) {
      loadProductData(id);
    }
  }, [id]);

  const loadProductData = async (productId: string) => {
    setLoading(true);
    try {
      const data = await productService.getProductById(productId);
      if (data) {
        setProduct(data);
        // Fetch related products (limit 3, same category)
        const { data: related } = await productService.getProducts({
          category: data.category,
          from: 0,
          to: 3
        });
        setRelatedProducts(related.filter((p: any) => p.id !== productId).slice(0, 3));
      }
    } catch (error: any) {
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: quantity,
    };

    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 3000);
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-40 pb-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading traditional goodness...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-40 pb-20 text-center">
          <i className="ri-error-warning-line text-6xl text-gray-300 mb-4 block"></i>
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <p className="text-gray-500 mt-2 mb-8">The product you're looking for might have been moved or removed.</p>
          <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-full font-bold">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

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
            <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div>
              <div className="rounded-[2.5rem] overflow-hidden bg-gray-50 mb-6 aspect-square shadow-inner border border-gray-100">
                <img
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/600?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-all duration-500"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images?.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-2xl overflow-hidden aspect-square cursor-pointer transition-all ${selectedImage === index ? 'ring-4 ring-primary shadow-lg scale-105' : 'ring-1 ring-gray-200 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <span className="inline-flex items-center space-x-1 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  <i className="ri-leaf-line"></i>
                  <span>100% Natural</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                  <i className="ri-shield-check-line"></i>
                  <span>Verified Seller</span>
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 font-serif leading-tight">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center text-yellow-400">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
                <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Premium Quality</span>
              </div>

              <div className="flex items-baseline space-x-4 mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <span className="text-5xl font-black text-primary">₹{product.price}</span>
                <span className="text-gray-400 font-medium line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-tighter">Save 20%</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Select Quantity</h3>
                  <span className="text-xs font-bold text-gray-400 uppercase">{product.stock_quantity} units available</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center bg-white border-2 border-gray-100 rounded-2xl p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <i className="ri-subtract-line text-xl"></i>
                    </button>
                    <span className="w-12 text-center font-black text-xl text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <i className="ri-add-line text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-gray-900 text-white py-5 rounded-[1.5rem] font-bold hover:bg-black transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-xl disabled:opacity-50"
                >
                  <i className="ri-shopping-cart-2-line text-2xl"></i>
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-[#25D366] text-white py-5 rounded-[1.5rem] font-bold hover:bg-[#128C7E] transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-xl shadow-green-100 disabled:opacity-50"
                >
                  <i className="ri-whatsapp-line text-2xl"></i>
                  <span>Order on WhatsApp</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                <div className="flex items-center space-x-3 text-gray-500">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                    <i className="ri-truck-line text-xl"></i>
                  </div>
                  <span className="text-sm font-semibold">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-500">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                    <i className="ri-exchange-funds-line text-xl"></i>
                  </div>
                  <span className="text-sm font-semibold">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <div className="flex space-x-12 border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
              {['description', 'details', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-bold uppercase tracking-widest text-xs transition-all cursor-pointer whitespace-nowrap relative ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 p-8 md:p-12 rounded-[3rem]">
              {activeTab === 'description' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none">
                  <h3 className="text-xl font-black text-gray-900 mb-4">About this traditional product</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                      <h4 className="font-bold text-primary mb-3 uppercase tracking-wider text-xs">Origin</h4>
                      <p className="text-gray-900 font-bold">Traditional Kerala Farms</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                      <h4 className="font-bold text-primary mb-3 uppercase tracking-wider text-xs">Category</h4>
                      <p className="text-gray-900 font-bold">{product.category}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'details' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between p-4 bg-white rounded-2xl">
                      <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Weight</span>
                      <span className="text-gray-900 font-black">500g (Standard)</span>
                    </div>
                    <div className="flex justify-between p-4 bg-white rounded-2xl">
                      <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Store</span>
                      <span className="text-gray-900 font-black">{product.profiles?.store_name || 'Naadan Hub'}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-white rounded-2xl">
                      <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Status</span>
                      <span className="text-green-600 font-black uppercase text-xs">{product.status}</span>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'shipping' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-xl font-black text-gray-900 mb-4">Shipping & Returns</h3>
                  <p className="text-gray-600 text-lg">We offer fast and secure shipping across India. Most orders are delivered within 3-5 business days. Due to the fresh nature of our products, we ensure premium packaging to maintain traditional taste and quality.</p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="pt-20 border-t border-gray-100">
            <h2 className="text-4xl font-black text-gray-900 mb-10 font-serif">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all p-2"
                >
                  <div className="aspect-square bg-gray-50 rounded-[2.2rem] overflow-hidden mb-6">
                    <img
                      src={relatedProduct.images?.[0] || 'https://via.placeholder.com/400?text=No+Image'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="px-6 pb-6 text-center">
                    <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">{relatedProduct.name}</h3>
                    <span className="text-2xl font-black text-gray-900">₹{relatedProduct.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WhatsAppOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
        quantity={quantity}
      />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}