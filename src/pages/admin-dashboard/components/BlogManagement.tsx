
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  status: 'published' | 'draft';
  author: string;
  created_at: string;
  featured_image: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: 1,
      title: "Benefits of Organic Farming in Kerala",
      excerpt: "Discover how organic farming practices are transforming agriculture in Kerala and benefiting both farmers and consumers.",
      category: "Agriculture",
      status: "published",
      author: "Admin",
      created_at: "2024-01-15",
      featured_image: "https://readdy.ai/api/search-image?query=organic%20farming%20in%20kerala%20green%20fields%20traditional%20farming%20methods%20sustainable%20agriculture%20beautiful%20landscape&width=400&height=300&seq=blog1&orientation=landscape"
    },
    {
      id: 2,
      title: "Traditional Spices: From Farm to Table",
      excerpt: "Explore the journey of traditional Kerala spices from cultivation to your kitchen.",
      category: "Food",
      status: "published", 
      author: "Admin",
      created_at: "2024-01-10",
      featured_image: "https://readdy.ai/api/search-image?query=traditional%20kerala%20spices%20turmeric%20cardamom%20pepper%20colorful%20spice%20market%20authentic%20cooking%20ingredients&width=400&height=300&seq=blog2&orientation=landscape"
    },
    {
      id: 3,
      title: "Sustainable Farming Practices for the Future",
      excerpt: "Learn about innovative sustainable farming techniques that are shaping the future of agriculture.",
      category: "Sustainability",
      status: "draft",
      author: "Admin",
      created_at: "2024-01-08",
      featured_image: "https://readdy.ai/api/search-image?query=sustainable%20farming%20modern%20agriculture%20technology%20green%20house%20eco%20friendly%20farming%20practices&width=400&height=300&seq=blog3&orientation=landscape"
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    status: 'draft' as 'published' | 'draft',
    content: ''
  });

  const handleCreateBlog = () => {
    const newBlog: Blog = {
      id: Math.max(...blogs.map(b => b.id)) + 1,
      title: formData.title,
      excerpt: formData.excerpt,
      category: formData.category,
      status: formData.status,
      author: 'Admin',
      created_at: new Date().toISOString().split('T')[0],
      featured_image: `https://readdy.ai/api/search-image?query=$%7BformData.title.toLowerCase%28%29%7D%20$%7BformData.category.toLowerCase%28%29%7D%20blog%20post%20featured%20image&width=400&height=300&seq=blog${Date.now()}&orientation=landscape`
    };
    
    setBlogs([newBlog, ...blogs]);
    setFormData({ title: '', excerpt: '', category: '', status: 'draft', content: '' });
    setShowCreateModal(false);
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      status: blog.status,
      content: ''
    });
    setShowCreateModal(true);
  };

  const handleUpdateBlog = () => {
    if (editingBlog) {
      setBlogs(blogs.map(blog => 
        blog.id === editingBlog.id 
          ? { ...blog, ...formData }
          : blog
      ));
      setEditingBlog(null);
      setFormData({ title: '', excerpt: '', category: '', status: 'draft', content: '' });
      setShowCreateModal(false);
    }
  };

  const handleDeleteBlog = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setBlogs(blogs.map(blog => 
      blog.id === id 
        ? { ...blog, status: blog.status === 'published' ? 'draft' : 'published' }
        : blog
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
            <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
            <p className="text-gray-600 mt-1">Create and manage blog posts</p>
          </div>
          <button
            onClick={() => {
              setEditingBlog(null);
              setFormData({ title: '', excerpt: '', category: '', status: 'draft', content: '' });
              setShowCreateModal(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-add-line text-xl"></i>
            Create New Post
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="p-6">
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-6">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-32 h-24 object-cover object-top rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{blog.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{blog.excerpt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <i className="ri-folder-line"></i>
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-line"></i>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-user-line"></i>
                      {blog.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="text-primary hover:bg-primary/10 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <i className="ri-edit-line"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(blog.id)}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                        blog.status === 'published'
                          ? 'text-yellow-600 hover:bg-yellow-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <i className={`${blog.status === 'published' ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                      {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
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
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Category</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Food">Food</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Health">Health</option>
                  <option value="Recipes">Recipes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Brief description of the blog post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={8}
                  placeholder="Write your blog content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingBlog(null);
                  setFormData({ title: '', excerpt: '', category: '', status: 'draft', content: '' });
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={editingBlog ? handleUpdateBlog : handleCreateBlog}
                disabled={!formData.title || !formData.category || !formData.excerpt}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingBlog ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
