
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  seller: string;
  created_at: string;
  image: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Organic Rice",
      price: 80,
      category: "Grains",
      stock: 150,
      status: "active",
      seller: "Green Valley Farm",
      created_at: "2024-01-15",
      image: "https://readdy.ai/api/search-image?query=premium%20organic%20rice%20grains%20in%20burlap%20sack%20natural%20lighting%20rustic%20wooden%20background%20high%20quality%20food%20photography&width=300&height=300&seq=rice1&orientation=squarish"
    },
    {
      id: 2,
      name: "Fresh Vegetables Mix",
      price: 120,
      category: "Vegetables",
      stock: 85,
      status: "active",
      seller: "Sunrise Organic",
      created_at: "2024-01-12",
      image: "https://readdy.ai/api/search-image?query=fresh%20organic%20vegetables%20basket%20colorful%20mix%20tomatoes%20carrots%20beans%20natural%20lighting%20farm%20fresh%20produce&width=300&height=300&seq=veg1&orientation=squarish"
    },
    {
      id: 3,
      name: "Turmeric Powder",
      price: 150,
      category: "Spices",
      stock: 45,
      status: "active",
      seller: "Spice Garden",
      created_at: "2024-01-10",
      image: "https://readdy.ai/api/search-image?query=organic%20turmeric%20powder%20in%20glass%20jar%20golden%20yellow%20color%20wooden%20spoon%20natural%20lighting%20spice%20photography&width=300&height=300&seq=turmeric1&orientation=squarish"
    },
    {
      id: 4,
      name: "Coconut Oil",
      price: 200,
      category: "Oils",
      stock: 0,
      status: "inactive",
      seller: "Coconut Grove",
      created_at: "2024-01-08",
      image: "https://readdy.ai/api/search-image?query=pure%20coconut%20oil%20in%20glass%20bottle%20traditional%20kerala%20coconut%20oil%20natural%20organic%20healthy%20cooking%20oil&width=300&height=300&seq=coconut1&orientation=squarish"
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    seller: '',
    description: ''
  });

  const categories = ['Grains', 'Vegetables', 'Fruits', 'Spices', 'Oils', 'Dairy', 'Others'];

  const handleCreateProduct = () => {
    const newProduct: Product = {
      id: Math.max(...products.map(p => p.id)) + 1,
      name: formData.name,
      price: formData.price,
      category: formData.category,
      stock: formData.stock,
      status: 'active',
      seller: formData.seller,
      created_at: new Date().toISOString().split('T')[0],
      image: `https://readdy.ai/api/search-image?query=$%7BformData.name.toLowerCase%28%29%7D%20$%7BformData.category.toLowerCase%28%29%7D%20organic%20product%20high%20quality%20food%20photography&width=300&height=300&seq=prod${Date.now()}&orientation=squarish`
    };
    
    setProducts([newProduct, ...products]);
    setFormData({ name: '', price: 0, category: '', stock: 0, seller: '', description: '' });
    setShowCreateModal(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      seller: product.seller,
      description: ''
    });
    setShowCreateModal(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...formData }
          : product
      ));
      setEditingProduct(null);
      setFormData({ name: '', price: 0, category: '', stock: 0, seller: '', description: '' });
      setShowCreateModal(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
            <p className="text-gray-600 mt-1">Manage all products in your marketplace</p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', price: 0, category: '', stock: 0, seller: '', description: '' });
              setShowCreateModal(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
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
            <div key={product.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover object-top rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                      <p className="text-primary text-lg font-bold">₹{product.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
                          Low Stock
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <i className="ri-folder-line"></i>
                      {product.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-store-line"></i>
                      {product.seller}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-box-line"></i>
                      {product.stock} in stock
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-line"></i>
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-primary hover:bg-primary/10 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <i className="ri-edit-line"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(product.id)}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                        product.status === 'active'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <i className={`${product.status === 'active' ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                      {product.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seller</label>
                <input
                  type="text"
                  value={formData.seller}
                  onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter seller name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={4}
                  placeholder="Product description..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingProduct(null);
                  setFormData({ name: '', price: 0, category: '', stock: 0, seller: '', description: '' });
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                disabled={!formData.name || !formData.category || !formData.seller || formData.price <= 0}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
