import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import WhatsAppOrderModal from '../../components/feature/WhatsAppOrderModal';
import { productService, Product } from '../../services/product.service';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 6;

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
      <div className="h-12 bg-gray-200 rounded-full w-full" />
    </div>
  </div>
);

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState<Product | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: any) => {
    if (loadingMore || loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, loading]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    loadProducts(0, true);
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    if (page > 0) {
      loadProducts(page);
    }
  }, [page]);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories([{ id: 'all', name: 'All Products', slug: 'all' }, ...data]);
    } catch (error: any) {
      toast.error('Failed to load categories');
    }
  };

  const loadProducts = async (currentPage: number, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count } = await productService.getProducts({
        category: selectedCategory,
        sortBy,
        from,
        to
      });

      if (reset) {
        setProducts(data);
      } else {
        setProducts(prev => [...prev, ...data]);
      }

      setTotalCount(count);
      setHasMore(data.length === ITEMS_PER_PAGE && (products.length + data.length) < count);
    } catch (error: any) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleWhatsAppOrder = (product: Product) => {
    setSelectedOrderProduct(product);
    setIsOrderModalOpen(true);
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
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-sans">Categories</h3>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name === 'All Products' ? 'all' : category.name)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap font-medium ${(selectedCategory === 'all' && category.name === 'All Products') || selectedCategory === category.name
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 font-sans">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm focus:outline-none focus:border-primary cursor-pointer transition-all font-medium"
                  >
                    <option value="featured">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 font-medium">
                  Showing <strong>{products.length}</strong> of {totalCount} products
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
                ) : (
                  <>
                    <AnimatePresence>
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          ref={index === products.length - 1 ? lastElementRef : null}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
                        >
                          <Link to={`/product/${product.id}`} className="flex-1 flex flex-col cursor-pointer">
                            <div className="relative aspect-square overflow-hidden bg-gray-50">
                              <img
                                src={product.images[0] || 'https://via.placeholder.com/400?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-primary flex items-center space-x-1 shadow-sm">
                                <i className="ri-plant-line"></i>
                                <span>Farm Fresh</span>
                              </div>
                              {product.stock_quantity === 0 && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                  <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs">Out of Stock</span>
                                </div>
                              )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors text-lg">
                                {product.name}
                              </h3>

                              {/* <div className="flex items-center space-x-2 mb-4">
                                <div className="flex items-center text-yellow-400">
                                  <i className="ri-star-fill text-sm"></i>
                                  <i className="ri-star-fill text-sm"></i>
                                  <i className="ri-star-fill text-sm"></i>
                                  <i className="ri-star-fill text-sm"></i>
                                  <i className="ri-star-fill text-sm"></i>
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Verified</span>
                              </div> */}

                              <div className="flex items-center justify-between mt-auto mb-4">
                                <span className="text-3xl font-black text-gray-900 font-sans">₹{product.price}</span>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
                              </div>
                            </div>
                          </Link>

                          <div className="px-6 pb-6">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleWhatsAppOrder(product);
                              }}
                              disabled={product.stock_quantity === 0}
                              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold hover:bg-[#128C7E] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-green-100 disabled:opacity-50 disabled:grayscale"
                            >
                              <i className="ri-whatsapp-line text-xl"></i>
                              <span>Order on WhatsApp</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {loadingMore && [...Array(3)].map((_, i) => <ProductSkeleton key={`more-${i}`} />)}
                  </>
                )}
              </div>

              {!loading && products.length === 0 && (
                <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                  <i className="ri-search-line text-6xl text-gray-300 mb-4 block"></i>
                  <p className="text-xl font-bold text-gray-900">No products found</p>
                  <p className="text-gray-500 mt-2">Try selecting a different category or clearing filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <WhatsAppOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedOrderProduct || undefined}
      />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
