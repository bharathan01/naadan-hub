import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../../services/admin.service';
import type { Product } from '../../../services/product.service';
import { productService } from '../../../services/product.service';
import { UserProfile } from '../../../services/auth.service';
import toast from 'react-hot-toast';

type AdminProduct = Product & { seller: { full_name: string; store_name: string } };

export default function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [sellers, setSellers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creationStep, setCreationStep] = useState(1); // 1: Details, 2: Images, 3: Preview
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock_quantity: 0,
    seller_id: '',
    status: 'draft' as Product['status'],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<{ name: string; slug: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateProduct = async () => {
    setActionLoading(true);
    try {
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await adminService.uploadProductImages(selectedFiles);
      }

      await productService.createProduct({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock_quantity: formData.stock_quantity,
        seller_id: formData.seller_id,
        status: formData.status,
        images: imageUrls,
      } as any);

      toast.success('Product created successfully!');
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    setActionLoading(true);
    try {
      // For simplicity in the demo, we only update fields, not re-uploading all images if they didn't change
      // In a real app, you'd handle image additions/removals specifically
      await productService.updateProduct(editingProduct.id, {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock_quantity: formData.stock_quantity,
        seller_id: formData.seller_id,
        status: formData.status,
      });

      toast.success('Product updated successfully!');
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setActionLoading(false);
    }
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
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock_quantity: 0,
      seller_id: '',
      status: 'draft',
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setEditingProduct(null);
    setShowCreateModal(false);
    setCreationStep(1);
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
              resetForm();
              setShowCreateModal(true);
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
                      onClick={() => {
                        setEditingProduct(product);
                        setFormData({
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          category: product.category,
                          stock_quantity: product.stock_quantity,
                          seller_id: product.seller_id,
                          status: product.status,
                        });
                        setCreationStep(1);
                        setShowCreateModal(true);
                      }}
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

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 w-8 rounded-full transition-all ${creationStep === s ? 'bg-primary w-12' : s < creationStep ? 'bg-primary/40' : 'bg-gray-100'
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <i className="ri-close-line text-2xl text-gray-400"></i>
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                {/* Step 1: Basic Details */}
                {creationStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:outline-none transition-all"
                          placeholder="e.g. Organic Brown Rice"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                        <input
                          type="number"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:outline-none transition-all"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                        <input
                          type="number"
                          value={formData.stock_quantity || ''}
                          onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                          className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:outline-none transition-all"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:outline-none transition-all appearance-none bg-no-repeat bg-[right_1.25rem_center]"
                        >
                          <option value="">Select Category</option>
                          {dynamicCategories.map(cat => (
                            <option key={cat.slug} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Seller *</label>
                        <select
                          value={formData.seller_id}
                          onChange={(e) => setFormData({ ...formData, seller_id: e.target.value })}
                          className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:outline-none transition-all appearance-none"
                        >
                          <option value="">Select Seller</option>
                          {sellers.map(seller => (
                            <option key={seller.id} value={seller.id}>
                              {seller.store_name || seller.full_name} ({seller.role})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:outline-none transition-all"
                        rows={4}
                        placeholder="Provide detailed information about the product..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Image Upload */}
                {creationStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                        <i className="ri-image-add-line text-3xl text-gray-400 group-hover:text-primary"></i>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Upload Product Images</h4>
                      <p className="text-gray-500">Drag and drop or click to select multiple files</p>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                          <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Preview & Submit */}
                {creationStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-48 h-48 flex-shrink-0">
                          {imagePreviews.length > 0 ? (
                            <img src={imagePreviews[0]} className="w-full h-full object-cover rounded-2xl shadow-lg" alt="Primary Preview" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                              <i className="ri-image-line text-4xl text-gray-400"></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">{formData.category}</span>
                            <h4 className="text-3xl font-bold text-gray-900 mt-1">{formData.name}</h4>
                            <p className="text-2xl font-bold text-primary mt-2">₹{formData.price}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                              <p className="text-gray-400 text-[10px] uppercase">Stock</p>
                              <p className="text-gray-900">{formData.stock_quantity} Units</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                              <p className="text-gray-400 text-[10px] uppercase">Seller</p>
                              <p className="text-gray-900 truncate">
                                {sellers.find(s => s.id === formData.seller_id)?.store_name || 'Selected Seller'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {formData.description && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Description</p>
                          <p className="text-gray-600 leading-relaxed">{formData.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                      <i className="ri-information-line text-2xl text-blue-500"></i>
                      <p className="text-sm text-blue-700 font-medium">
                        Please review the details carefully. Once submitted, the product will be created as a **Draft** until verified by an admin.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-4">
                {creationStep > 1 ? (
                  <button
                    onClick={() => setCreationStep(creationStep - 1)}
                    className="px-8 py-3.5 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-white transition-all cursor-pointer whitespace-nowrap"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={resetForm}
                    className="flex-1 sm:flex-none px-8 py-3.5 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-white transition-all cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  {creationStep < 3 ? (
                    <button
                      onClick={() => setCreationStep(creationStep + 1)}
                      disabled={creationStep === 1 && (!formData.name || !formData.category || !formData.seller_id || formData.price <= 0)}
                      className="flex-1 sm:flex-none px-10 py-3.5 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                      disabled={actionLoading}
                      className="flex-1 sm:flex-none px-10 py-3.5 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      {actionLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>{editingProduct ? 'Update Product' : 'Confirm & Save'}</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
