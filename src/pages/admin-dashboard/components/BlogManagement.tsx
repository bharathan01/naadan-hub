
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService, Blog } from '../../../services/admin.service';
import { authService } from '../../../services/auth.service';
import toast from 'react-hot-toast';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    status: 'draft' as Blog['status'],
    content: '',
    featured_image: ''
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBlogsAdmin();
      setBlogs(data);
    } catch (error: any) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    try {
      setSubmitting(true);
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const newBlog: Partial<Blog> = {
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt,
        category: formData.category,
        status: formData.status,
        content: formData.content,
        author_id: user.id,
        featured_image: formData.featured_image || `https://readdy.ai/api/search-image?query=${encodeURIComponent(formData.title + ' ' + formData.category)}&width=800&height=600`
      };

      await adminService.createBlog(newBlog);
      toast.success('Blog post created successfully');
      loadBlogs();
      setFormData({ title: '', excerpt: '', category: '', status: 'draft', content: '', featured_image: '' });
      setShowCreateModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      status: blog.status,
      content: blog.content,
      featured_image: blog.featured_image
    });
    setShowCreateModal(true);
  };

  const handleUpdateBlog = async () => {
    if (!editingBlog) return;
    try {
      setSubmitting(true);
      const updates: Partial<Blog> = {
        title: formData.title,
        excerpt: formData.excerpt,
        category: formData.category,
        status: formData.status,
        content: formData.content,
        featured_image: formData.featured_image
      };

      await adminService.updateBlog(editingBlog.id, updates);
      toast.success('Blog post updated successfully');
      loadBlogs();
      setEditingBlog(null);
      setFormData({ title: '', excerpt: '', category: '', status: 'draft', content: '', featured_image: '' });
      setShowCreateModal(false);
    } catch (error: any) {
      toast.error('Failed to update blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await adminService.deleteBlog(id);
        toast.success('Blog post deleted');
        loadBlogs();
      } catch (error: any) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const toggleStatus = async (blog: Blog) => {
    try {
      const newStatus: Blog['status'] = blog.status === 'published' ? 'draft' : 'published';
      await adminService.updateBlog(blog.id, { status: newStatus });
      toast.success(`Blog post ${newStatus === 'published' ? 'published' : 'moved to drafts'}`);
      loadBlogs();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
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
              setFormData({ title: '', excerpt: '', category: '', status: 'draft', content: '', featured_image: '' });
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
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No blog posts found. Create your first post!
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-6">
                  <img
                    src={blog.featured_image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={blog.title}
                    className="w-32 h-24 object-cover object-top rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{blog.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{blog.excerpt}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${blog.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {blog.status.toUpperCase()}
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
                        {blog.author?.full_name || 'Admin'}
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
                        onClick={() => toggleStatus(blog)}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${blog.status === 'published'
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
            ))
          )}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown supported)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary font-mono"
                  rows={8}
                  placeholder="Write your blog content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Blog['status'] })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <div className="flex items-start gap-4">
                  {formData.featured_image && (
                    <img
                      src={formData.featured_image}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const loadingToast = toast.loading('Uploading image...');
                            const url = await adminService.uploadBlogImage(file);
                            setFormData({ ...formData, featured_image: url });
                            toast.dismiss(loadingToast);
                            toast.success('Image uploaded successfully');
                          } catch (error) {
                            toast.error('Failed to upload image');
                          }
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <i className="ri-upload-2-line mr-2"></i>
                      {formData.featured_image ? 'Change Image' : 'Upload Image'}
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended size: 1200x800px. Max size: 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingBlog(null);
                  setFormData({ title: '', excerpt: '', category: '', status: 'draft', content: '', featured_image: '' });
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={editingBlog ? handleUpdateBlog : handleCreateBlog}
                disabled={submitting || !formData.title || !formData.category || !formData.excerpt || !formData.content}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                {editingBlog ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
