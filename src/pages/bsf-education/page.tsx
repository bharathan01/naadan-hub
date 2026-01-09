import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function BSFEducationPage() {
  const benefits = [
    { icon: 'ri-leaf-line', title: 'High Protein Content', description: '42% protein content, superior to traditional feed sources like soybean meal' },
    { icon: 'ri-plant-line', title: 'Sustainable & Eco-Friendly', description: 'Reduces waste, requires minimal resources, and has a low carbon footprint' },
    { icon: 'ri-money-rupee-circle-line', title: 'Cost-Effective', description: 'Reduces feed costs by up to 40% compared to conventional protein sources' },
    { icon: 'ri-heart-pulse-line', title: 'Improves Animal Health', description: 'Rich in essential amino acids, calcium, and antimicrobial peptides' },
    { icon: 'ri-recycle-line', title: 'Waste Management', description: 'Converts organic waste into valuable protein and organic fertilizer' },
    { icon: 'ri-speed-up-line', title: 'Fast Growth Rate', description: 'Animals show improved growth rates and better feed conversion ratios' },
  ];

  const usageSteps = [
    { step: 1, title: 'Choose Your Product', description: 'Select fresh or dried BSF larvae based on your farming needs and animal type' },
    { step: 2, title: 'Calculate Quantity', description: 'Use 10-15% of total feed for poultry, 20-30% for fish, adjust based on animal age' },
    { step: 3, title: 'Introduce Gradually', description: 'Start with small amounts and gradually increase over 7-10 days' },
    { step: 4, title: 'Monitor & Adjust', description: 'Observe animal health, growth, and adjust feeding ratios as needed' },
  ];

  const applications = [
    { 
      title: 'Poultry Farming', 
      image: 'https://readdy.ai/api/search-image?query=healthy%20chickens%20in%20organic%20farm%20eating%20natural%20feed%20Kerala%20poultry%20farming%20green%20environment%20sustainable%20agriculture&width=600&height=400&seq=app1&orientation=landscape',
      description: 'Perfect for chickens, ducks, and quails. Improves egg production, meat quality, and overall bird health.'
    },
    { 
      title: 'Aquaculture', 
      image: 'https://readdy.ai/api/search-image?query=fish%20farming%20pond%20with%20healthy%20fish%20sustainable%20aquaculture%20Kerala%20natural%20environment%20clean%20water&width=600&height=400&seq=app2&orientation=landscape',
      description: 'Ideal for fish, prawns, and other aquatic species. Enhances growth rate and survival rates.'
    },
    { 
      title: 'Livestock Feed', 
      image: 'https://readdy.ai/api/search-image?query=healthy%20livestock%20animals%20in%20natural%20farm%20setting%20Kerala%20sustainable%20farming%20green%20pasture&width=600&height=400&seq=app3&orientation=landscape',
      description: 'Suitable for pigs, goats, and cattle. Provides essential nutrients for optimal growth.'
    },
  ];

  const comparisonData = [
    { feature: 'Protein Content', bsf: '42%', soybean: '35%', fishmeal: '38%' },
    { feature: 'Cost per kg', bsf: '₹280-420', soybean: '₹450-550', fishmeal: '₹600-800' },
    { feature: 'Environmental Impact', bsf: 'Very Low', soybean: 'Medium', fishmeal: 'High' },
    { feature: 'Sustainability', bsf: 'Excellent', soybean: 'Good', fishmeal: 'Poor' },
    { feature: 'Digestibility', bsf: '95%', soybean: '85%', fishmeal: '90%' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-olive to-primary">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Black Soldier Fly Larvae:<br />Nature's Protein Powerhouse
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Discover the sustainable, cost-effective solution for modern farming. Transform your livestock and aquaculture operations naturally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products?category=bsf"
                className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all cursor-pointer whitespace-nowrap"
              >
                Buy Fresh Larvae
              </Link>
              <Link
                to="/products?category=bsf"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all cursor-pointer whitespace-nowrap"
              >
                Buy Dried Larvae
              </Link>
            </div>
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
              <span className="text-sm text-primary font-semibold mb-3 block">WHAT IS BSF?</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
                Understanding Black Soldier Fly Larvae
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Black Soldier Fly (Hermetia illucens) larvae are nature's most efficient bioconverters. These remarkable insects transform organic waste into high-quality protein and organic fertilizer.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Unlike common houseflies, Black Soldier Flies are not pests. They don't bite, sting, or spread disease. The larvae are rich in protein, calcium, and essential amino acids, making them an ideal feed supplement.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The lifecycle is rapid - from egg to harvest in just 2-3 weeks. This efficiency makes BSF larvae farming highly sustainable and scalable for commercial operations.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">42%</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">35%</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">5%</div>
                  <div className="text-sm text-gray-600">Calcium</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px]">
                <img
                  src="https://readdy.ai/api/search-image?query=black%20soldier%20fly%20larvae%20lifecycle%20stages%20infographic%20educational%20diagram%20showing%20egg%20larva%20pupa%20adult%20stages%20clean%20white%20background%20scientific%20illustration&width=700&height=500&seq=lifecycle1&orientation=portrait"
                  alt="BSF Lifecycle"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-semibold mb-3 block">BENEFITS</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              Why Choose BSF Larvae?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <i className={`${benefit.icon} text-3xl text-primary`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-semibold mb-3 block">APPLICATIONS</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              Perfect For Multiple Farming Needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="rounded-2xl overflow-hidden mb-5 h-64">
                  <img
                    src={app.image}
                    alt={app.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{app.title}</h3>
                <p className="text-gray-600 leading-relaxed">{app.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-semibold mb-3 block">HOW TO USE</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              Simple Usage Guide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {usageSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-5">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < usageSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <i className="ri-arrow-right-line text-3xl text-primary"></i>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-semibold mb-3 block">COMPARISON</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
              BSF Larvae vs Traditional Feed
            </h2>
          </div>

          <div className="bg-cream rounded-3xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold">BSF Larvae</th>
                    <th className="px-6 py-4 text-left font-semibold">Soybean Meal</th>
                    <th className="px-6 py-4 text-left font-semibold">Fish Meal</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-beige'}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-primary font-bold">{row.bsf}</td>
                      <td className="px-6 py-4 text-gray-600">{row.soybean}</td>
                      <td className="px-6 py-4 text-gray-600">{row.fishmeal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of farmers across Kerala who have switched to sustainable BSF larvae feeding
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products?category=bsf"
              className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all cursor-pointer whitespace-nowrap"
            >
              Order Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all cursor-pointer whitespace-nowrap"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}