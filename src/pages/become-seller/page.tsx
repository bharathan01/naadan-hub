import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function BecomeSellerPage() {
    const navigate = useNavigate();

    const roadmapSteps = [
        {
            number: "01",
            title: "Register Your Farm",
            description: "Sign up as a seller and provide details about your farm, location, and the authentic products you want to sell.",
            icon: "ri-user-add-line",
            color: "blue"
        },
        {
            number: "02",
            title: "Get Verified",
            description: "Our team will review your application and verify your farming practices to ensure our customers get the best quality.",
            icon: "ri-shield-check-line",
            color: "green"
        },
        {
            number: "03",
            title: "List Your Products",
            description: "Upload your products with high-quality images and descriptions. Set your own prices and manage your stock levels.",
            icon: "ri-shopping-basket-line",
            color: "purple"
        },
        {
            number: "04",
            title: "Start Selling",
            description: "Your products go live! Receive orders directly via WhatsApp and manage them through your dedicated seller dashboard.",
            icon: "ri-rocket-line",
            color: "orange"
        }
    ];

    const benefits = [
        {
            title: "Direct Reach",
            description: "Connect directly with thousands of customers looking for authentic, traditional Kerala products.",
            icon: "ri-community-line"
        },
        {
            title: "Zero Middlemen",
            description: "Keep 100% of your earnings. We don't take commissions, ensuring you get the full value for your hard work.",
            icon: "ri-hand-coin-line"
        },
        {
            title: "Easy Management",
            description: "A simple, powerful dashboard to track sales, manage products, and grow your digital presence.",
            icon: "ri-dashboard-3-line"
        },
        {
            title: "WhatsApp Integrated",
            description: "No complicated order systems. Customers contact you directly via WhatsApp for a seamless experience.",
            icon: "ri-whatsapp-line"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div>
                {/* Hero Section */}
                <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://readdy.ai/api/search-image?query=traditional%20Kerala%20banana%20chips%20tapioca%20chips%20jackfruit%20chips%20variety%20pack%20on%20simple%20white%20background%20authentic%20homemade%20snacks%20natural%20ingredients&width=600&height=600&seq=cat1&orientation=squarish"
                            alt="Farmers in Kerala"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60 z-10"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight">
                                Empower Your Farm. <br />
                                <span className="text-primary-light">Sell Directly to Customers.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                                Join Kerala's fastest-growing community of authentic sellers.
                                Bring your traditional produce to the digital marketplace and reach
                                customers who value quality and tradition.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/seller-register')}
                                    className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 cursor-pointer"
                                >
                                    Register as Seller Now
                                </button>
                                <a
                                    href="#roadmap"
                                    className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all text-center cursor-pointer"
                                >
                                    See How It Works
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Roadmap Section */}
                <section id="roadmap" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-primary font-bold tracking-widest uppercase text-sm"
                            >
                                The Process
                            </motion.span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 font-serif">Your Journey to Selling</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {roadmapSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative group hover:shadow-xl transition-all h-full"
                                >
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center font-bold text-primary border border-gray-100">
                                        {step.number}
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors`}>
                                        <i className={`${step.icon} text-3xl`}></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-20 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="text-primary font-bold tracking-widest uppercase text-sm"
                                >
                                    Benefits
                                </motion.span>
                                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 mb-8 font-serif leading-tight">
                                    Why Thousands of Farmers Trust Naadan Hub
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <i className={`${benefit.icon} text-3xl text-primary mb-3 block`}></i>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="relative"
                            >
                                <div className="rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=1000"
                                        alt="Success Farmer"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs hidden md:block">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <i className="ri-double-quotes-l text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">100% Organic</p>
                                            <p className="text-xs text-gray-500">Verified Marketplace</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic text-sm">
                                        "Naadan Hub has changed how I do business. Now I can reach customers in the city directly from my farm."
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden"
                        >
                            <div className="absolute inset-0 z-0 opacity-10">
                                <i className="ri-leaf-line text-[200px] absolute -bottom-10 -right-10 rotate-12"></i>
                                <i className="ri-seedling-line text-[150px] absolute -top-10 -left-10 -rotate-12"></i>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 italic">Ready to grow your farm business?</h2>
                                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                                    It only takes 5 minutes to set up your profile and start reaching customers.
                                    Join our mission to promote authentic Kerala products.
                                </p>
                                <button
                                    onClick={() => navigate('/seller-register')}
                                    className="bg-white text-primary px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-xl cursor-pointer"
                                >
                                    Get Started for Free
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>

            <Footer />
            <WhatsAppButton />
        </div>
    );
}
