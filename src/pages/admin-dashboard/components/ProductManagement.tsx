import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../../services/admin.service';
import { productService, Product } from '../../../services/product.service';
import { UserProfile } from '../../../services/auth.service';
import toast from 'react-hot-toast';
import ProductFormModal from '../../../components/feature/ProductFormModal';

type AdminProduct = Product & { seller: { full_name: string; store_name: string } };

export default function ProductManagement({
  initialOpenModal = false,
  initialSellerId = '',
  onModalClose
}: {
  initialOpenModal?: boolean;
  initialSellerId?: string;
  onModalClose?: () => void;
}) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [sellers, setSellers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (initialOpenModal) {
      if (initialSellerId) {
        setEditingProduct(null); // Ensure we're in create mode
      }
      setShowModal(true);
    }
  }, [initialOpenModal, initialSellerId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, usersData, categoriesData] = await Promise.all([
        adminService.getAllProductsAdmin(),
        adminService.getAllUsers(),
        productService.getCategories()
      ]);
      setProducts(productsData);
      setSellers(usersData.filter(u => u.role === 'seller' || u.role === 'admin'));
      setDynamicCategories(categoriesData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminService.deleteProductAdmin(id);
        toast.success('Product deleted successfully');
        loadData();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const toggleStatus = async (product: AdminProduct) => {
    const newStatus: Product['status'] = product.status === 'active' ? 'inactive' : 'active';
    try {
      await adminService.updateProductStatus(product.id, newStatus);
      toast.success(`Product marked as ${newStatus}`);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setShowModal(false);
    if (onModalClose) onModalClose();
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-sans">Product Management</h2>
            <p className="text-gray-600 mt-1">Manage all products in your marketplace</p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowModal(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <i className="ri-add-line text-xl"></i>
            Add Product
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="p-6">
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/150?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {product.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                      +{product.images.length - 1} images
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-primary text-lg font-bold">₹{product.price}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${product.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : product.status === 'draft'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                        }`}>
                        {product.status}
                      </span>
                      {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 uppercase tracking-wider">
                          Low Stock
                        </span>
                      )}
                      {product.stock_quantity === 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 uppercase tracking-wider">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-2">
                      <i className="ri-folder-line text-primary"></i>
                      {product.category}
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="ri-store-line text-primary"></i>
                      {product.seller?.store_name || product.seller?.full_name || 'Unknown Seller'}
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="ri-box-line text-primary"></i>
                      {product.stock_quantity} in stock
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="ri-calendar-line text-primary"></i>
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-gray-700 hover:text-primary font-semibold transition-colors flex items-center gap-2"
                    >
                      <i className="ri-edit-line text-lg"></i>
                      Edit Details
                    </button>
                    <button
                      onClick={() => toggleStatus(product)}
                      className={`font-semibold transition-colors flex items-center gap-2 ${product.status === 'active'
                        ? 'text-yellow-600 hover:text-yellow-700'
                        : 'text-green-600 hover:text-green-700'
                        }`}
                    >
                      <i className={`${product.status === 'active' ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
                      {product.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 font-semibold transition-colors flex items-center gap-2"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <i className="ri-inbox-line text-6xl text-gray-300 mb-4 block"></i>
              <p className="text-gray-500 font-medium">No products found. Start by adding one!</p>
            </div>
          )}
        </div>
      </div>

      {/* Shared Product Form Modal */}
      <ProductFormModal
        isOpen={showModal}
        onClose={resetForm}
        onSuccess={() => {
          loadData();
          resetForm();
        }}
        initialData={editingProduct}
        sellerId={editingProduct ? editingProduct.seller_id : initialSellerId}
        isAdmin={true}
      />
    </motion.div>
  );
}
