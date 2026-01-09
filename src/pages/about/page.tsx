import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function AboutPage() {
  const team = [
    { name: 'Rajesh Kumar', role: 'Founder & CEO', image: 'https://readdy.ai/api/search-image?query=professional%20Indian%20male%20farmer%20portrait%20smiling%20confident%20Kerala%20agriculture%20expert%20natural%20outdoor%20setting&width=400&height=400&seq=team1&orientation=squarish' },
    { name: 'Priya Menon', role: 'Head of Operations', image: 'https://readdy.ai/api/search-image?query=professional%20Indian%20female%20agriculture%20expert%20portrait%20smiling%20confident%20Kerala%20farm%20manager%20natural%20setting&width=400&height=400&seq=team2&orientation=squarish' },
    { name: 'Dr. Vineeth Kumar', role: 'Agricultural Scientist', image: 'https://readdy.ai/api/search-image?query=professional%20Indian%20male%20scientist%20portrait%20smiling%20confident%20agriculture%20researcher%20Kerala%20expert&width=400&height=400&seq=team3&orientation=squarish' },
    { name: 'Lakshmi Devi', role: 'Quality Control Manager', image: 'https://readdy.ai/api/search-image?query=professional%20Indian%20female%20quality%20manager%20portrait%20smiling%20confident%20Kerala%20agriculture%20inspector&width=400&height=400&seq=team4&orientation=squarish' },
  ];

  const timeline = [
    { year: '2018', title: 'The Beginning', description: 'Started with a small organic farm in Wayanad, Kerala, focusing on traditional farming methods' },
    { year: '2019', title: 'BSF Innovation', description: 'Introduced Black Soldier Fly larvae farming, becoming pioneers in sustainable protein production' },
    { year: '2021', title: 'Expansion', description: 'Partnered with 50+ local farmers across Kerala to expand our organic product range' },
    { year: '2023', title: 'Recognition', description: 'Received Kerala State Award for Sustainable Agriculture and Organic Farming Excellence' },
    { year: '2025', title: 'Going Digital', description: 'Launched online platform to bring Kerala\'s finest natural products to customers nationwide' },
  ];

  const highlights = [
    { icon: 'ri-plant-line', text: 'Naturally sourced agricultural products' },
    { icon: 'ri-bug-line', text: 'Sustainable BSF larvae solutions' },
    { icon: 'ri-team-line', text: 'Support for local farmers & eco-entrepreneurs' },
    { icon: 'ri-book-open-line', text: 'Educational content on organic & natural farming' },
    { icon: 'ri-earth-line', text: 'Commitment to environmental responsibility' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=beautiful%20Kerala%20organic%20farm%20landscape%20with%20farmers%20working%20in%20green%20fields%20coconut%20trees%20traditional%20agriculture%20peaceful%20rural%20scene%20golden%20sunlight&width=1920&height=1080&seq=about1&orientation=landscape"
            alt="Our Farm"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              About Naadan Hub
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              A nature-driven platform dedicated to promoting pure, sustainable, and locally sourced agricultural products
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-primary font-semibold mb-3 block">WHO WE ARE</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
                Rooted in Tradition, Growing with Innovation
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Naadan Hub is a nature-driven platform dedicated to promoting pure, sustainable, and locally sourced agricultural products. Rooted in traditional Kerala farming values, we aim to reconnect people with natural living while supporting eco-friendly and ethical practices.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We specialize in natural farm goods, organic agricultural solutions, and Black Soldier Fly (BSF) larvae—an innovative and sustainable alternative for animal nutrition and waste management. Beyond selling products, Naadan Hub focuses on education, awareness, and community building through informative blogs and practical insights.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our mission is to empower farmers, encourage sustainable choices, and offer honest, chemical-free products that support a healthier lifestyle and environment.
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                <p className="text-gray-800 font-medium italic">
                  "Naadan Hub is more than a marketplace — it's a step towards sustainable living."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-64">
                  <img
                    src="https://readdy.ai/api/search-image?query=Kerala%20farmer%20harvesting%20organic%20vegetables%20in%20green%20farm%20traditional%20agriculture%20natural%20farming%20methods&width=400&height=500&seq=story1&orientation=portrait"
                    alt="Farming"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden h-48">
                  <img
                    src="https://readdy.ai/api/search-image?query=fresh%20organic%20spices%20and%20herbs%20from%20Kerala%20farm%20colorful%20natural%20products%20harvest&width=400&height=300&seq=story2&orientation=landscape"
                    alt="Products"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden h-48">
                  <img
                    src="https://readdy.ai/api/search-image?query=Kerala%20coconut%20farm%20with%20palm%20trees%20natural%20landscape%20organic%20farming&width=400&height=300&seq=story3&orientation=landscape"
                    alt="Coconut Farm"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden h-64">
                  <img
                    src="https://readdy.ai/api/search-image?query=sustainable%20BSF%20larvae%20farming%20eco-friendly%20agriculture%20innovation%20Kerala&width=400&height=500&seq=story4&orientation=portrait"
                    alt="BSF Farming"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-semibold mb-3 block">WHAT WE OFFER</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              Our Key Highlights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 flex items-start gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className={`${item.icon} text-3xl text-primary`}></i>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed pt-3">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-semibold mb-3 block">OUR VALUES</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              What Drives Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-cream rounded-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-leaf-line text-5xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainability</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in farming practices that nurture the earth, not deplete it. Every decision we make considers the environmental impact for future generations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-cream rounded-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-heart-line text-5xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality First</h3>
              <p className="text-gray-600 leading-relaxed">
                We never compromise on quality. From seed to delivery, every step is carefully monitored to ensure you receive only the finest natural products.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-cream rounded-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-team-line text-5xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                We support local farmers with fair prices and sustainable partnerships, building a stronger agricultural community across Kerala.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-semibold mb-3 block">OUR JOURNEY</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              Milestones That Matter
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden lg:block"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-white rounded-2xl p-8">
                      <h3 className="text-3xl font-bold text-primary mb-2">{item.year}</h3>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 relative z-10">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-semibold mb-3 block">MEET THE TEAM</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              The People Behind Naadan Hub
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Join Our Journey
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Experience the difference of truly natural, sustainably grown products from Kerala's finest farms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all cursor-pointer whitespace-nowrap"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all cursor-pointer whitespace-nowrap"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}