import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import { blogService, Blog } from '../../services/blog.service';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'Agriculture', name: 'Agriculture' },
    { id: 'Food', name: 'Food' },
    { id: 'Sustainability', name: 'Sustainability' },
    { id: 'Health', name: 'Health' },
    { id: 'Recipes', name: 'Recipes' },
  ];

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPublishedBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'all'
    ? blogs
    : blogs.filter(post => post.category === selectedCategory);

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
              Farm Stories & Sustainable Living Tips
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Insights, guides, and stories from the world of organic farming and sustainable agriculture
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-cream text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-500">Loading farm stories...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <i className="ri-article-line text-6xl text-gray-300 mb-4 inline-block"></i>
              <p className="text-xl text-gray-500">No blog posts found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.id}`} className="group block cursor-pointer">
                    <div className="relative rounded-2xl overflow-hidden mb-5 h-64">
                      <img
                        src={post.featured_image || 'https://via.placeholder.com/600x400?text=Naadan+Hub+Blog'}
                        alt={post.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full capitalize">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {post.author?.full_name ? post.author.full_name.split(' ').map(n => n[0]).join('') : 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{post.author?.full_name || 'Admin'}</p>
                          <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">5 min read</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredPosts.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg cursor-pointer whitespace-nowrap">1</button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
