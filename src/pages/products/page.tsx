import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'chips', name: 'Naadan Chips' },
    { id: 'tapioca', name: 'Tapioca Products' },
    { id: 'powders', name: 'Spice Powders' },
    { id: 'vegetables', name: 'Fresh Vegetables' },
    { id: 'rice', name: 'Traditional Rice' },
    { id: 'coconut', name: 'Coconut Products' },
  ];

  const products = [
    { id: 1, name: 'Naadan Banana Chips - 500g', category: 'chips', price: 180, rating: 5, reviews: 145, image: 'https://readdy.ai/api/search-image?query=crispy%20Kerala%20banana%20chips%20in%20transparent%20package%20golden%20yellow%20color%20traditional%20homemade%20snack%20simple%20white%20background%20authentic%20product%20photography&width=300&height=300&seq=p1&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Naadan%20Banana%20Chips%20500g%20-%20Rs180' },
    { id: 2, name: 'Tapioca Chips - 250g', category: 'chips', price: 150, rating: 5, reviews: 98, image: 'https://readdy.ai/api/search-image?query=crispy%20tapioca%20chips%20cassava%20chips%20in%20package%20on%20simple%20white%20background%20Kerala%20traditional%20snack%20homemade%20natural&width=300&height=300&seq=p2&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Tapioca%20Chips%20250g%20-%20Rs150' },
    { id: 3, name: 'Jackfruit Chips - 200g', category: 'chips', price: 160, rating: 5, reviews: 87, image: 'https://readdy.ai/api/search-image?query=crispy%20jackfruit%20chips%20in%20package%20on%20simple%20white%20background%20Kerala%20traditional%20snack%20golden%20color%20homemade&width=300&height=300&seq=p3&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Jackfruit%20Chips%20200g%20-%20Rs160' },
    { id: 4, name: 'Fresh Tapioca - 1kg', category: 'tapioca', price: 60, rating: 5, reviews: 234, image: 'https://readdy.ai/api/search-image?query=fresh%20tapioca%20cassava%20root%20peeled%20and%20whole%20on%20simple%20white%20background%20Kerala%20traditional%20vegetable%20natural%20organic%20farm%20fresh&width=300&height=300&seq=p4&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Fresh%20Tapioca%201kg%20-%20Rs60' },
    { id: 5, name: 'Tapioca Flour - 500g', category: 'tapioca', price: 80, rating: 5, reviews: 156, image: 'https://readdy.ai/api/search-image?query=tapioca%20flour%20cassava%20starch%20powder%20in%20package%20on%20simple%20white%20background%20Kerala%20traditional%20food%20ingredient&width=300&height=300&seq=p5&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Tapioca%20Flour%20500g%20-%20Rs80' },
    { id: 6, name: 'Bay Leaf Powder - 100g', category: 'powders', price: 120, rating: 5, reviews: 142, image: 'https://readdy.ai/api/search-image?query=bay%20leaf%20powder%20in%20glass%20jar%20with%20fresh%20bay%20leaves%20on%20simple%20white%20background%20Kerala%20spice%20organic%20natural%20aromatic&width=300&height=300&seq=p6&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Bay%20Leaf%20Powder%20100g%20-%20Rs120' },
    { id: 7, name: 'Turmeric Powder - 250g', category: 'powders', price: 140, rating: 5, reviews: 198, image: 'https://readdy.ai/api/search-image?query=organic%20turmeric%20powder%20in%20glass%20jar%20vibrant%20golden%20yellow%20color%20simple%20white%20background%20Kerala%20spice%20natural&width=300&height=300&seq=p7&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Turmeric%20Powder%20250g%20-%20Rs140' },
    { id: 8, name: 'Chilli Powder - 200g', category: 'powders', price: 100, rating: 5, reviews: 167, image: 'https://readdy.ai/api/search-image?query=red%20chilli%20powder%20in%20glass%20jar%20vibrant%20red%20color%20simple%20white%20background%20Kerala%20spice%20hot%20natural&width=300&height=300&seq=p8&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Chilli%20Powder%20200g%20-%20Rs100' },
    { id: 9, name: 'Coriander Powder - 200g', category: 'powders', price: 90, rating: 5, reviews: 134, image: 'https://readdy.ai/api/search-image?query=coriander%20powder%20in%20glass%20jar%20simple%20white%20background%20Kerala%20spice%20aromatic%20natural%20organic&width=300&height=300&seq=p9&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Coriander%20Powder%20200g%20-%20Rs90' },
    { id: 10, name: 'Fresh Organic Tomatoes - 1kg', category: 'vegetables', price: 60, rating: 5, reviews: 276, image: 'https://readdy.ai/api/search-image?query=fresh%20red%20organic%20tomatoes%20on%20white%20background%20farm%20fresh%20vegetables%20natural%20healthy%20produce&width=300&height=300&seq=p10&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Fresh%20Organic%20Tomatoes%201kg%20-%20Rs60' },
    { id: 11, name: 'Fresh Curry Leaves - 100g', category: 'vegetables', price: 40, rating: 5, reviews: 312, image: 'https://readdy.ai/api/search-image?query=fresh%20green%20curry%20leaves%20on%20white%20background%20aromatic%20Kerala%20herb%20organic%20natural&width=300&height=300&seq=p11&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Fresh%20Curry%20Leaves%20100g%20-%20Rs40' },
    { id: 12, name: 'Organic Ginger - 500g', category: 'vegetables', price: 80, rating: 5, reviews: 189, image: 'https://readdy.ai/api/search-image?query=fresh%20organic%20ginger%20root%20on%20white%20background%20natural%20farm%20produce%20healthy%20spice&width=300&height=300&seq=p12&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Organic%20Ginger%20500g%20-%20Rs80' },
    { id: 13, name: 'Red Rice - 1kg', category: 'rice', price: 120, rating: 5, reviews: 203, image: 'https://readdy.ai/api/search-image?query=red%20rice%20grains%20in%20wooden%20bowl%20on%20white%20background%20traditional%20Kerala%20rice%20organic%20healthy&width=300&height=300&seq=p13&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Red%20Rice%201kg%20-%20Rs120' },
    { id: 14, name: 'Black Rice - 1kg', category: 'rice', price: 180, rating: 5, reviews: 112, image: 'https://readdy.ai/api/search-image?query=black%20rice%20grains%20in%20bowl%20on%20white%20background%20traditional%20Kerala%20rice%20organic%20nutritious&width=300&height=300&seq=p14&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Black%20Rice%201kg%20-%20Rs180' },
    { id: 15, name: 'Virgin Coconut Oil - 500ml', category: 'coconut', price: 380, rating: 5, reviews: 245, image: 'https://readdy.ai/api/search-image?query=virgin%20coconut%20oil%20in%20glass%20bottle%20on%20white%20background%20pure%20natural%20Kerala%20coconut%20oil%20premium%20quality&width=300&height=300&seq=p15&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Virgin%20Coconut%20Oil%20500ml%20-%20Rs380' },
    { id: 16, name: 'Coconut Milk Powder - 200g', category: 'coconut', price: 220, rating: 5, reviews: 178, image: 'https://readdy.ai/api/search-image?query=coconut%20milk%20powder%20in%20package%20on%20white%20background%20natural%20Kerala%20coconut%20product&width=300&height=300&seq=p16&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Coconut%20Milk%20Powder%20200g%20-%20Rs220' },
    { id: 17, name: 'Banana Chips Spicy - 500g', category: 'chips', price: 190, rating: 5, reviews: 167, image: 'https://readdy.ai/api/search-image?query=spicy%20Kerala%20banana%20chips%20in%20package%20red%20color%20traditional%20snack%20simple%20white%20background&width=300&height=300&seq=p17&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Banana%20Chips%20Spicy%20500g%20-%20Rs190' },
    { id: 18, name: 'Tapioca Starch - 1kg', category: 'tapioca', price: 150, rating: 5, reviews: 134, image: 'https://readdy.ai/api/search-image?query=tapioca%20starch%20powder%20in%20package%20on%20white%20background%20Kerala%20traditional%20ingredient%20pure%20white&width=300&height=300&seq=p18&orientation=squarish', inStock: true, whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Tapioca%20Starch%201kg%20-%20Rs150' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleWhatsAppOrder = (product: any) => {
    window.open(product.whatsappLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-serif">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fresh from Kerala farmers - Order directly on WhatsApp
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-cream rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing <strong>{filteredProducts.length}</strong> products
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <i className="ri-plant-line text-green-600"></i>
                        <span>Farm Fresh</span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(product.rating)].map((_, i) => (
                            <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>

                      <div className="mb-4">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      </div>

                      <button 
                        onClick={() => handleWhatsAppOrder(product)}
                        className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-whatsapp-line text-xl"></i>
                        <span>Order on WhatsApp</span>
                      </button>

                      {product.inStock && (
                        <div className="mt-3 flex items-center justify-center space-x-1 text-xs text-green-600">
                          <i className="ri-checkbox-circle-fill"></i>
                          <span>In Stock</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}