import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import { blogService, Blog } from '../../services/blog.service';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<Blog[]>([]);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (blogId: string) => {
    try {
      setLoading(true);
      const data = await blogService.getBlogById(blogId);
      setArticle(data);

      // Load related articles (from same category)
      const allBlogs = await blogService.getPublishedBlogs();
      const related = allBlogs
        .filter(b => b.category === data.category && b.id !== data.id)
        .slice(0, 3);
      setRelatedArticles(related);
    } catch (error) {
      console.error('Failed to load blog detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="solid" />
        <div className="pt-48 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500 text-lg">Loading story details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="solid" />
        <div className="pt-48 text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4 inline-block"></i>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link to="/blog" className="text-primary font-semibold hover:underline">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="solid" />

      <article className="pt-32 pb-20">
        <div className="relative h-[60vh] mb-12">
          <img
            src={article.featured_image || 'https://via.placeholder.com/1200x600?text=Naadan+Hub'}
            alt={article.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <span className="inline-block px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold mb-4 capitalize">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              {article.title}
            </h1>
            <div className="flex items-center space-x-4 text-white/90">
              <span>{article.author?.full_name || 'Admin'}</span>
              <span>•</span>
              <span>{new Date(article.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary cursor-pointer">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/blog" className="hover:text-primary cursor-pointer">Blog</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 line-clamp-1">{article.title}</span>
          </nav>

          <div className="bg-cream rounded-2xl p-8 mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-2xl">
                  {article.author?.full_name ? article.author.full_name.split(' ').map(n => n[0]).join('') : 'A'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{article.author?.full_name || 'Admin'}</h3>
                <p className="text-gray-600 mb-3">Community contributor at Naadan Hub, sharing passion for sustainable agriculture and traditional Kerala farming.</p>
                <div className="flex space-x-3">
                  <span className="text-primary hover:text-primary/80 cursor-pointer">
                    <i className="ri-twitter-line text-xl"></i>
                  </span>
                  <span className="text-primary hover:text-primary/80 cursor-pointer">
                    <i className="ri-linkedin-line text-xl"></i>
                  </span>
                  <span className="text-primary hover:text-primary/80 cursor-pointer">
                    <i className="ri-mail-line text-xl"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>

          <div className="flex items-center justify-between py-8 border-y border-gray-200 mb-12">
            <span className="text-gray-600 font-medium">Share this article:</span>
            <div className="flex space-x-3">
              <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <i className="ri-facebook-fill"></i>
              </button>
              <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <i className="ri-twitter-fill"></i>
              </button>
              <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <i className="ri-linkedin-fill"></i>
              </button>
              <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <i className="ri-whatsapp-line"></i>
              </button>
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="rounded-xl overflow-hidden mb-4 h-48">
                      <img
                        src={related.featured_image || 'https://via.placeholder.com/400x300?text=Naadan+Hub'}
                        alt={related.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2 capitalize">
                      {related.category}
                    </span>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
