import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'farming', name: 'Farming Tips' },
    { id: 'recipes', name: 'Recipes' },
    { id: 'bsf', name: 'BSF Knowledge' },
    { id: 'sustainability', name: 'Sustainability' },
  ];

  const blogPosts = [
    { id: 1, title: 'Sustainable Farming with Black Soldier Fly Larvae', category: 'bsf', excerpt: 'Discover how BSF larvae are revolutionizing sustainable agriculture and reducing environmental impact while providing high-quality protein for livestock.', author: 'Dr. Vineeth Kumar', date: 'Jan 15, 2025', readTime: '8 min', image: 'https://readdy.ai/api/search-image?query=farmer%20examining%20black%20soldier%20fly%20larvae%20in%20sustainable%20farm%20setting%20with%20green%20fields%20natural%20Kerala%20landscape%20educational%20farming%20scene%20bright%20daylight&width=600&height=400&seq=blog1&orientation=landscape' },
    { id: 2, title: 'Traditional Kerala Spices: Health Benefits You Should Know', category: 'recipes', excerpt: 'Explore the incredible health benefits of traditional Kerala spices like turmeric, black pepper, and cardamom backed by modern science.', author: 'Anjali Menon', date: 'Jan 12, 2025', readTime: '6 min', image: 'https://readdy.ai/api/search-image?query=colorful%20Kerala%20spices%20arranged%20artistically%20with%20fresh%20herbs%20on%20rustic%20wooden%20table%20natural%20lighting%20vibrant%20colors%20traditional%20cooking%20ingredients&width=600&height=400&seq=blog2&orientation=landscape' },
    { id: 3, title: 'Organic Farming Practices for Better Yields', category: 'farming', excerpt: 'Learn proven organic farming techniques that increase crop yields while maintaining soil health and environmental sustainability.', author: 'Suresh Babu', date: 'Jan 10, 2025', readTime: '10 min', image: 'https://readdy.ai/api/search-image?query=lush%20organic%20farm%20with%20healthy%20crops%20growing%20in%20Kerala%20countryside%20green%20fields%20natural%20farming%20sustainable%20agriculture%20beautiful%20landscape&width=600&height=400&seq=blog3&orientation=landscape' },
    { id: 4, title: 'How to Start Your Own Kitchen Garden', category: 'farming', excerpt: 'A complete guide to starting a productive kitchen garden at home with organic methods and minimal space requirements.', author: 'Maya Thomas', date: 'Jan 8, 2025', readTime: '7 min', image: 'https://readdy.ai/api/search-image?query=beautiful%20home%20kitchen%20garden%20with%20fresh%20vegetables%20and%20herbs%20growing%20in%20containers%20natural%20sunlight%20organic%20gardening&width=600&height=400&seq=blog4&orientation=landscape' },
    { id: 5, title: 'The Complete Guide to Composting at Home', category: 'sustainability', excerpt: 'Transform your kitchen waste into nutrient-rich compost for your garden with these simple and effective composting techniques.', author: 'Rajesh Kumar', date: 'Jan 5, 2025', readTime: '9 min', image: 'https://readdy.ai/api/search-image?query=composting%20bin%20with%20organic%20waste%20and%20rich%20dark%20compost%20soil%20sustainable%20waste%20management%20eco-friendly%20gardening&width=600&height=400&seq=blog5&orientation=landscape' },
    { id: 6, title: 'Delicious Recipes Using Fresh Curry Leaves', category: 'recipes', excerpt: 'Discover authentic Kerala recipes that showcase the aromatic flavor of fresh curry leaves in traditional and modern dishes.', author: 'Priya Menon', date: 'Jan 3, 2025', readTime: '5 min', image: 'https://readdy.ai/api/search-image?query=Kerala%20traditional%20food%20dishes%20with%20fresh%20curry%20leaves%20garnish%20aromatic%20spices%20authentic%20cuisine%20beautiful%20presentation&width=600&height=400&seq=blog6&orientation=landscape' },
    { id: 7, title: 'Water Conservation Techniques for Farmers', category: 'sustainability', excerpt: 'Practical water-saving methods that help farmers reduce water usage while maintaining healthy crop production.', author: 'Arun Krishnan', date: 'Dec 30, 2024', readTime: '8 min', image: 'https://readdy.ai/api/search-image?query=drip%20irrigation%20system%20in%20farm%20field%20water%20conservation%20sustainable%20farming%20efficient%20agriculture%20green%20crops&width=600&height=400&seq=blog7&orientation=landscape' },
    { id: 8, title: 'BSF Larvae: The Future of Animal Feed', category: 'bsf', excerpt: 'Why black soldier fly larvae are becoming the preferred choice for sustainable animal nutrition in modern farming.', author: 'Dr. Vineeth Kumar', date: 'Dec 28, 2024', readTime: '10 min', image: 'https://readdy.ai/api/search-image?query=black%20soldier%20fly%20larvae%20farming%20facility%20sustainable%20protein%20production%20modern%20agriculture%20technology&width=600&height=400&seq=blog8&orientation=landscape' },
    { id: 9, title: 'Growing Organic Vegetables Without Pesticides', category: 'farming', excerpt: 'Natural pest control methods and organic techniques to grow healthy vegetables without harmful chemicals.', author: 'Lakshmi Devi', date: 'Dec 25, 2024', readTime: '7 min', image: 'https://readdy.ai/api/search-image?query=organic%20vegetable%20garden%20with%20healthy%20plants%20natural%20pest%20control%20chemical-free%20farming%20lush%20green%20produce&width=600&height=400&seq=blog9&orientation=landscape' },
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

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
                className={`px-6 py-3 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-cream text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

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
                      src={post.image}
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
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-lg cursor-pointer whitespace-nowrap">1</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">2</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">3</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}