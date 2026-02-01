import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../../services/admin.service';
import { productService } from '../../../services/product.service';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
    created_at: string;
}

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', image_url: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await productService.getCategories();
            setCategories(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData({ ...formData, name, slug: generateSlug(name) });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadLoading(true);
        try {
            let image_url = formData.image_url;
            if (selectedFile) {
                image_url = await adminService.uploadCategoryImage(selectedFile);
            }

            if (editingCategory) {
                await adminService.updateCategory(editingCategory.id, {
                    name: formData.name,
                    slug: formData.slug,
                    image_url
                });
                toast.success('Category updated successfully');
            } else {
                await adminService.createCategory({
                    name: formData.name,
                    slug: formData.slug,
                    image_url
                });
                toast.success('Category created successfully');
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', slug: '', image_url: '' });
            setSelectedFile(null);
            loadCategories();
        } catch (error: any) {
            toast.error(error.message || 'Error saving category');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category? Products linked to this category might be affected.')) {
            try {
                await adminService.deleteCategory(id);
                toast.success('Category deleted');
                loadCategories();
            } catch (error: any) {
                toast.error(error.message || 'Error deleting category');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
            <div className="p-6 border-b flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                    <p className="text-gray-600 mt-1">Add or edit product categories</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', slug: '', image_url: '' });
                        setShowModal(true);
                    }}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                    <i className="ri-add-line text-xl"></i>
                    Add Category
                </button>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="border rounded-2xl p-4 flex flex-col gap-4 group hover:shadow-md transition-all">
                            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                                {category.image_url ? (
                                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <i className="ri-image-line text-4xl"></i>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            setEditingCategory(category);
                                            setFormData({ name: category.name, slug: category.slug, image_url: category.image_url || '' });
                                            setShowModal(true);
                                        }}
                                        className="p-2 bg-white rounded-lg shadow-sm hover:text-primary transition-colors cursor-pointer"
                                    >
                                        <i className="ri-edit-line"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 bg-white rounded-lg shadow-sm hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                                <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b flex items-center justify-between">
                                <h3 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                                <button onClick={() => setShowModal(false)}><i className="ri-close-line text-2xl"></i></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3 focus:border-primary outline-none transition-all"
                                        placeholder="e.g. Traditional Spicy Snacks"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        readOnly
                                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3 bg-gray-50 text-gray-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Category Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full border-2 border-dashed border-gray-100 rounded-2xl px-5 py-8 text-center cursor-pointer hover:border-primary transition-all"
                                    />
                                    {formData.image_url && !selectedFile && (
                                        <p className="text-xs text-gray-500 mt-2">Current image will be kept if none selected.</p>
                                    )}
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploadLoading}
                                        className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {uploadLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Save Category'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
