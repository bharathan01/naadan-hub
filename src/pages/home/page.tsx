import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

const categories = [
  {
    name: 'Naadan Chips',
    count: 15,
    path: '/products?category=chips',
    image: 'https://readdy.ai/api/search-image?query=traditional%20Kerala%20banana%20chips%20tapioca%20chips%20jackfruit%20chips%20variety%20pack%20on%20simple%20white%20background%20authentic%20homemade%20snacks%20natural%20ingredients&width=600&height=600&seq=cat1&orientation=squarish'
  },
  {
    name: 'Tapioca Products',
    count: 12,
    path: '/products?category=tapioca',
    image: 'https://readdy.ai/api/search-image?query=fresh%20tapioca%20cassava%20root%20and%20tapioca%20flour%20powder%20on%20simple%20white%20background%20Kerala%20traditional%20food%20natural%20organic&width=600&height=600&seq=cat2&orientation=squarish'
  },
  {
    name: 'Spice Powders',
    count: 18,
    path: '/products?category=powders',
    image: 'https://readdy.ai/api/search-image?query=bay%20leaf%20powder%20turmeric%20powder%20spice%20powders%20in%20bowls%20on%20simple%20white%20background%20Kerala%20spices%20organic%20natural&width=600&height=600&seq=cat3&orientation=squarish'
  }
];

const featuredProducts = [
  {
    id: 1,
    name: 'Naadan Banana Chips - 500g',
    price: 180,
    rating: 5,
    whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Naadan%20Banana%20Chips',
    image: 'https://readdy.ai/api/search-image?query=crispy%20Kerala%20banana%20chips%20in%20transparent%20package%20golden%20yellow%20color%20traditional%20homemade%20snack%20simple%20white%20background%20authentic%20product%20photography&width=400&height=400&seq=prod1&orientation=squarish'
  },
  {
    id: 2,
    name: 'Fresh Tapioca - 1kg',
    price: 60,
    rating: 5,
    whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Fresh%20Tapioca',
    image: 'https://readdy.ai/api/search-image?query=fresh%20tapioca%20cassava%20root%20peeled%20and%20whole%20on%20simple%20white%20background%20Kerala%20traditional%20vegetable%20natural%20organic%20farm%20fresh&width=400&height=400&seq=prod2&orientation=squarish'
  },
  {
    id: 3,
    name: 'Bay Leaf Powder - 100g',
    price: 120,
    rating: 5,
    whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Bay%20Leaf%20Powder',
    image: 'https://readdy.ai/api/search-image?query=bay%20leaf%20powder%20in%20glass%20jar%20with%20fresh%20bay%20leaves%20on%20simple%20white%20background%20Kerala%20spice%20organic%20natural%20aromatic&width=400&height=400&seq=prod3&orientation=squarish'
  },
  {
    id: 4,
    name: 'Tapioca Chips - 250g',
    price: 150,
    rating: 5,
    whatsappLink: 'https://wa.me/919876543210?text=I%20want%20to%20order%20Tapioca%20Chips',
    image: 'https://readdy.ai/api/search-image?query=crispy%20tapioca%20chips%20cassava%20chips%20in%20package%20on%20simple%20white%20background%20Kerala%20traditional%20snack%20homemade%20natural&width=400&height=400&seq=prod4&orientation=squarish'
  }
];

const blogPosts = [
  {
    id: 1,
    title: 'Benefits of Black Soldier Fly Larvae in Poultry Farming',
    excerpt: 'Discover how BSF larvae can improve your poultry health and reduce feed costs significantly.',
    category: 'Farming Tips',
    author: 'Dr. Rajesh Kumar',
    date: 'Jan 15, 2025',
    readTime: '5 min',
    image: 'https://readdy.ai/api/search-image?query=poultry%20chickens%20eating%20black%20soldier%20fly%20larvae%20sustainable%20farming%20healthy%20birds%20natural%20feed%20clean%20simple%20background%20professional%20photography&width=800&height=600&seq=blog1&orientation=landscape'
  },
  {
    id: 2,
    title: 'How to Start Your Own BSF Farm at Home',
    excerpt: 'A complete guide to setting up a small-scale black soldier fly farming operation.',
    category: 'Getting Started',
    author: 'Priya Menon',
    date: 'Jan 12, 2025',
    readTime: '8 min',
    image: 'https://readdy.ai/api/search-image?query=black%20soldier%20fly%20farming%20setup%20home%20scale%20sustainable%20agriculture%20equipment%20containers%20clean%20simple%20background%20professional%20photography&width=800&height=600&seq=blog2&orientation=landscape'
  },
  {
    id: 3,
    title: 'BSF Frass: The Ultimate Organic Fertilizer',
    excerpt: 'Learn why BSF frass is becoming the preferred choice for organic farmers across Kerala.',
    category: 'Organic Farming',
    author: 'Anil Thomas',
    date: 'Jan 10, 2025',
    readTime: '6 min',
    image: 'https://readdy.ai/api/search-image?query=organic%20garden%20vegetables%20growing%20with%20natural%20fertilizer%20healthy%20plants%20sustainable%20agriculture%20clean%20simple%20background%20professional%20photography&width=800&height=600&seq=blog3&orientation=landscape'
  }
];

const testimonials = [
  {
    name: 'Suresh Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    text: 'My poultry farm has seen amazing results since switching to BSF larvae. The birds are healthier and my feed costs have dropped by 30%!',
    product: 'Premium BSF Larvae'
  },
  {
    name: 'Lakshmi Devi',
    location: 'Thrissur, Kerala',
    rating: 5,
    text: 'The BSF frass has transformed my vegetable garden. My plants are thriving and I love that it\'s completely organic and chemical-free.',
    product: 'BSF Frass Fertilizer'
  },
  {
    name: 'Mohammed Rasheed',
    location: 'Kozhikode, Kerala',
    rating: 5,
    text: 'Started my own BSF farm with their starter kit. The support team guided me through everything. Now I\'m producing my own protein feed!',
    product: 'BSF Starter Kit'
  },
  {
    name: 'Deepa Krishnan',
    location: 'Trivandrum, Kerala',
    rating: 5,
    text: 'Fast delivery and excellent quality. My fish farm loves the BSF larvae. Highly recommend Naadan Hub for sustainable farming solutions.',
    product: 'Dried BSF Larvae'
  },
  {
    name: 'Ravi Varma',
    location: 'Palakkad, Kerala',
    rating: 5,
    text: 'As an organic farmer, finding quality natural fertilizer was always a challenge. BSF frass from Naadan Hub is a game-changer!',
    product: 'BSF Frass Fertilizer'
  },
  {
    name: 'Anjali Menon',
    location: 'Kannur, Kerala',
    rating: 5,
    text: 'The educational content and customer support are outstanding. They really care about helping farmers succeed with BSF products.',
    product: 'Premium BSF Larvae'
  }
];

const heroSlides = [
  {
    title: 'Naadan Hub - Farm to Your Table',
    subtitle: 'Direct from Kerala farmers to buyers. Fresh agricultural products, traditional snacks, and organic spices. Support local farmers, get authentic quality products at fair prices.',
    image: 'https://readdy.ai/api/search-image?query=Kerala%20farmers%20harvesting%20fresh%20vegetables%20in%20green%20agricultural%20field%20with%20traditional%20farming%20tools%20natural%20sunlight%20beautiful%20landscape%20direct%20farm%20to%20table%20concept&width=1920&height=1080&seq=hero-bg-agri-001&orientation=landscape',
    cta1: 'Browse Products',
    cta2: 'Become a Seller'
  },
  {
    title: 'Traditional Kerala Snacks',
    subtitle: 'Authentic Naadan chips made by local farmers. Banana chips, tapioca chips, jackfruit chips - handmade with traditional recipes and natural ingredients.',
    image: 'https://readdy.ai/api/search-image?query=variety%20of%20Kerala%20traditional%20chips%20banana%20chips%20tapioca%20chips%20arranged%20beautifully%20golden%20crispy%20authentic%20homemade%20snacks%20natural%20lighting%20simple%20background&width=1920&height=1080&seq=hero-bg-chips-002&orientation=landscape',
    cta1: 'Shop Chips',
    cta2: 'Learn More'
  },
  {
    title: 'Fresh Farm Products Daily',
    subtitle: 'Get fresh vegetables, tapioca, spices, and organic products delivered to your doorstep. No middlemen, fair prices, quality guaranteed.',
    image: 'https://readdy.ai/api/search-image?query=fresh%20Kerala%20vegetables%20tapioca%20spices%20arranged%20on%20wooden%20table%20farm%20fresh%20organic%20produce%20natural%20sunlight%20beautiful%20composition&width=1920&height=1080&seq=hero-bg-fresh-003&orientation=landscape',
    cta1: 'Order Now',
    cta2: 'Track Order'
  }
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleWhatsAppOrder = (product: any) => {
    window.open(product.whatsappLink, '_blank');
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar scrolled={scrolled} />
      <WhatsAppButton />

      {/* Hero Section with Auto-Slider */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroSlides[currentSlide].image})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/50"></div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={currentSlide === 1 ? '/products?category=chips' : currentSlide === 2 ? '/products' : '/products'}
                  className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg cursor-pointer whitespace-nowrap"
                >
                  {heroSlides[currentSlide].cta1}
                </Link>
                <Link
                  to={currentSlide === 2 ? '/order-tracking' : '/seller-profile'}
                  className="bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg cursor-pointer whitespace-nowrap"
                >
                  {heroSlides[currentSlide].cta2}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                currentSlide === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="ri-arrow-down-line text-4xl text-white"></i>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Naadan Hub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kerala&apos;s trusted agricultural marketplace connecting farmers directly with buyers. Get fresh farm products, traditional snacks, and organic spices at fair prices while supporting local farmers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <i className="ri-plant-line text-3xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Direct from Farmers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Buy directly from Kerala farmers. No middlemen, fair prices for farmers, fresh quality products for you. Support local agriculture and get authentic products.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <i className="ri-shield-check-line text-3xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quality Assured
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All products are quality checked and sourced from verified farmers. Fresh, organic, and traditionally processed products you can trust.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <i className="ri-whatsapp-line text-3xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Easy WhatsApp Orders
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Order directly through WhatsApp. Chat with farmers, negotiate prices, and close deals easily. Simple, fast, and convenient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-2 rounded-full border-2 border-olive text-olive text-sm font-medium mb-4">
                EXPLORE CATEGORIES
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
                Quality Agricultural<br />Products for Your Farm
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={category.path}
                  className="group relative block aspect-square rounded-2xl overflow-hidden cursor-pointer"
                >
                  <div className="w-full h-full">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.count}+ Products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="inline-block px-4 py-2 rounded-full border border-white/30 text-white text-sm font-medium mb-4">
              BESTSELLERS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">
              Popular Products from Farmers
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide" data-product-shop>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-72 bg-lightBeige rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="w-full h-72 bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-5 bg-gray-800">
                  <h3 className="font-semibold text-white mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-white">₹{product.price}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(product.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleWhatsAppOrder(product)}
                    className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-whatsapp-line text-xl"></i>
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chips Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <span className="text-sm text-gray-500 font-medium mb-3 block">TRADITIONAL SNACKS</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
                Authentic Naadan Chips
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Handmade traditional Kerala chips made by local farmers using age-old recipes. Banana chips, tapioca chips, jackfruit chips - all made with natural ingredients and traditional methods.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                No artificial colors, no preservatives, no chemicals. Just pure, authentic taste that reminds you of home. Crispy, delicious, and made with love.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Support local farmers and enjoy the authentic taste of Kerala. Order directly through WhatsApp and get fresh chips delivered to your doorstep.
              </p>
              <Link
                to="/products?category=chips"
                className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline cursor-pointer"
              >
                <span>View All Chips</span>
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>

            <div className="lg:col-span-3 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://readdy.ai/api/search-image?query=variety%20of%20Kerala%20traditional%20chips%20banana%20chips%20tapioca%20chips%20jackfruit%20chips%20arranged%20beautifully%20on%20wooden%20plate%20authentic%20homemade%20snacks%20natural%20lighting&width=800&height=600&seq=chips1&orientation=landscape"
                  alt="Naadan Chips"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute top-6 right-6 bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-gray-600">Natural</div>
              </div>
              <div className="absolute bottom-6 left-6 bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <i className="ri-home-heart-line text-2xl text-green-600"></i>
                  <span className="font-semibold text-gray-900">Homemade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-gray-500 font-medium mb-3 block">OUR PROMISE</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              Naturally Grown,<br />Traditionally Harvested
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cream rounded-xl p-10">
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <i className="ri-truck-line text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Farm Direct</h3>
              <p className="text-gray-600 leading-relaxed">
                Products come straight from our partner farms to your doorstep, ensuring maximum freshness and fair prices for farmers.
              </p>
            </div>

            <div className="bg-cream rounded-xl p-10">
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <i className="ri-leaf-line text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chemical Free</h3>
              <p className="text-gray-600 leading-relaxed">
                All our products are grown without harmful pesticides or chemicals, certified organic and safe for sustainable farming.
              </p>
            </div>

            <div className="bg-cream rounded-xl p-10">
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <i className="ri-time-line text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Same-day delivery within Kerala for orders before noon. We ensure your agricultural products reach you fresh and on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FROM OUR BLOG
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              Stories from the Farm
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link to={`/blog/${post.id}`} className="group block cursor-pointer">
                  <div className="rounded-2xl overflow-hidden mb-5 h-64">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} read</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline cursor-pointer"
            >
              <span>View All Articles</span>
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              CUSTOMER LOVE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              What Our Community Says
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400"></i>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <span className="text-xs text-primary font-medium">{testimonial.product}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}