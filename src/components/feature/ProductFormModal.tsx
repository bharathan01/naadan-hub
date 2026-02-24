import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService, Product } from '../../services/product.service';
import { adminService } from '../../services/admin.service';
import { UserProfile } from '../../services/auth.service';
import toast from 'react-hot-toast';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Product | null;
    sellerId?: string; // If provided, pre-selects/locks this seller
    isAdmin?: boolean; // If true, shows seller selection and extra controls
}

export default function ProductFormModal({
    isOpen,
    onClose,
    onSuccess,
    initialData = null,
    sellerId = '',
    isAdmin = false
}: ProductFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [creationStep, setCreationStep] = useState(1);
    const [sellers, setSellers] = useState<UserProfile[]>([]);
    const [dynamicCategories, setDynamicCategories] = useState<{ name: string; slug: string }[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock_quantity: 0,
        seller_id: sellerId || '',
        status: 'draft' as Product['status'],
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            loadInitialData();
        }
    }, [isOpen, initialData, sellerId]);

    const loadInitialData = async () => {
        try {
            const categoriesData = await productService.getCategories();
            setDynamicCategories(categoriesData);

            if (isAdmin) {
                const usersData = await adminService.getAllUsers();
                setSellers(usersData.filter(u => u.role === 'seller' || u.role === 'admin'));
            }

            if (initialData) {
                setFormData({
                    name: initialData.name,
                    description: initialData.description,
                    price: initialData.price,
                    category: initialData.category,
                    stock_quantity: initialData.stock_quantity,
                    seller_id: initialData.seller_id,
                    status: initialData.status,
                });
                setImagePreviews(initialData.images || []);
            } else {
                setFormData(prev => ({ ...prev, seller_id: sellerId || prev.seller_id }));
            }
        } catch (error: any) {
            toast.error('Failed to load form data');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            category: '',
            stock_quantity: 0,
            seller_id: sellerId || '',
            status: 'draft',
        });
        setSelectedFiles([]);
        setImagePreviews([]);
        setCreationStep(1);
        onClose();
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
        // If it's a new file being uploaded
        if (index < selectedFiles.length) {
            setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        }
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let imageUrls = [...imagePreviews.filter(p => p.startsWith('http'))];

            if (selectedFiles.length > 0) {
                const uploadedUrls = await productService.uploadProductImages(selectedFiles);
                imageUrls = [...imageUrls, ...uploadedUrls];
            }

            const productPayload = {
                ...formData,
                images: imageUrls,
                updated_at: new Date().toISOString()
            };

            if (initialData) {
                await productService.updateProduct(initialData.id, productPayload);
                toast.success('Product updated successfully!');
            } else {
                await productService.createProduct(productPayload as any);
                toast.success('Product created successfully!');
            }

            onSuccess();
            resetForm();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                                    {initialData ? 'Edit Product' : 'Add New Product'}
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
                                        {isAdmin && (
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
                                        )}
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
                                                        <p className="text-gray-400 text-[10px] uppercase">Seller ID</p>
                                                        <p className="text-gray-900 truncate">
                                                            {formData.seller_id || 'N/A'}
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
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 sm:flex-none px-10 py-3.5 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>{initialData ? 'Update Product' : 'Confirm & Save'}</>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
