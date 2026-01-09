import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function BlogDetailPage() {
  const { id } = useParams();

  const article = {
    id: 1,
    title: 'Sustainable Farming with Black Soldier Fly Larvae',
    category: 'BSF Knowledge',
    author: 'Dr. Vineeth Kumar',
    authorBio: 'Agricultural scientist specializing in sustainable farming practices and insect-based protein solutions.',
    date: 'January 15, 2025',
    readTime: '8 min',
    image: 'https://readdy.ai/api/search-image?query=farmer%20examining%20black%20soldier%20fly%20larvae%20in%20sustainable%20farm%20setting%20with%20green%20fields%20natural%20Kerala%20landscape%20educational%20farming%20scene%20bright%20daylight&width=1200&height=600&seq=blogdetail1&orientation=landscape',
    tags: ['BSF Larvae', 'Sustainable Farming', 'Animal Feed', 'Organic Agriculture'],
  };

  const relatedArticles = [
    { id: 8, title: 'BSF Larvae: The Future of Animal Feed', category: 'BSF Knowledge', image: 'https://readdy.ai/api/search-image?query=black%20soldier%20fly%20larvae%20farming%20facility%20sustainable%20protein%20production%20modern%20agriculture%20technology&width=400&height=300&seq=related1&orientation=landscape' },
    { id: 3, title: 'Organic Farming Practices for Better Yields', category: 'Farming Tips', image: 'https://readdy.ai/api/search-image?query=lush%20organic%20farm%20with%20healthy%20crops%20growing%20in%20Kerala%20countryside%20green%20fields%20natural%20farming%20sustainable%20agriculture%20beautiful%20landscape&width=400&height=300&seq=related2&orientation=landscape' },
    { id: 5, title: 'The Complete Guide to Composting at Home', category: 'Sustainability', image: 'https://readdy.ai/api/search-image?query=composting%20bin%20with%20organic%20waste%20and%20rich%20dark%20compost%20soil%20sustainable%20waste%20management%20eco-friendly%20gardening&width=400&height=300&seq=related3&orientation=landscape' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <article className="pt-32 pb-20">
        <div className="relative h-[60vh] mb-12">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <span className="inline-block px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold mb-4">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              {article.title}
            </h1>
            <div className="flex items-center space-x-4 text-white/90">
              <span>{article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime} read</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary cursor-pointer">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/blog" className="hover:text-primary cursor-pointer">Blog</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900">{article.title}</span>
          </nav>

          <div className="bg-cream rounded-2xl p-8 mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-2xl">
                  {article.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{article.author}</h3>
                <p className="text-gray-600 mb-3">{article.authorBio}</p>
                <div className="flex space-x-3">
                  <a href="#" className="text-primary hover:text-primary/80 cursor-pointer">
                    <i className="ri-twitter-line text-xl"></i>
                  </a>
                  <a href="#" className="text-primary hover:text-primary/80 cursor-pointer">
                    <i className="ri-linkedin-line text-xl"></i>
                  </a>
                  <a href="#" className="text-primary hover:text-primary/80 cursor-pointer">
                    <i className="ri-mail-line text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              In the quest for sustainable agriculture, black soldier fly (BSF) larvae have emerged as a game-changing solution that addresses multiple challenges facing modern farming. This remarkable insect is transforming how we think about animal feed, waste management, and environmental sustainability.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12 font-serif">What Makes BSF Larvae Special?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Black soldier fly larvae are nature's most efficient bioconverters. They can consume a wide variety of organic waste materials and convert them into high-quality protein and fat. With a protein content of up to 42% and fat content of 35%, BSF larvae rival traditional protein sources like fishmeal and soybean meal.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              What sets them apart is their incredible efficiency. BSF larvae can reduce organic waste volume by up to 80% while producing valuable biomass. This dual benefit of waste reduction and protein production makes them invaluable for sustainable farming operations.
            </p>

            <div className="bg-primary/5 border-l-4 border-primary p-6 my-8 rounded-r-xl">
              <p className="text-xl italic text-gray-800 leading-relaxed">
                "BSF larvae farming has reduced our feed costs by 40% while improving the health and growth rate of our poultry. It's been a complete game-changer for our farm."
              </p>
              <p className="text-sm text-gray-600 mt-3">— Rajesh Kumar, Poultry Farmer, Kochi</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12 font-serif">Environmental Benefits</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The environmental advantages of BSF larvae farming are substantial. Traditional protein sources like fishmeal contribute to overfishing and ocean ecosystem degradation. Soybean cultivation requires vast amounts of land, often leading to deforestation.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              In contrast, BSF larvae can be raised on organic waste materials, including food scraps, agricultural residues, and manure. This not only diverts waste from landfills but also reduces greenhouse gas emissions associated with waste decomposition.
            </p>

            <div className="rounded-2xl overflow-hidden my-8 h-96">
              <img
                src="https://readdy.ai/api/search-image?query=sustainable%20BSF%20larvae%20farming%20facility%20with%20organic%20waste%20conversion%20eco-friendly%20agriculture%20modern%20technology%20green%20environment&width=800&height=400&seq=content1&orientation=landscape"
                alt="BSF Larvae Farming"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12 font-serif">Practical Applications in Farming</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              BSF larvae have proven effective across multiple farming sectors:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-3">
                <i className="ri-checkbox-circle-fill text-primary text-xl mt-1"></i>
                <span className="text-gray-700"><strong>Poultry Farming:</strong> Chickens fed with BSF larvae show improved egg production, better meat quality, and enhanced immune function.</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="ri-checkbox-circle-fill text-primary text-xl mt-1"></i>
                <span className="text-gray-700"><strong>Aquaculture:</strong> Fish and prawns thrive on BSF larvae, showing faster growth rates and better survival rates compared to conventional feed.</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="ri-checkbox-circle-fill text-primary text-xl mt-1"></i>
                <span className="text-gray-700"><strong>Pig Farming:</strong> BSF larvae provide essential amino acids and improve digestive health in pigs.</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12 font-serif">Getting Started with BSF Larvae</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For farmers interested in incorporating BSF larvae into their operations, the process is straightforward. Start by introducing larvae gradually, replacing 10-15% of conventional feed initially. Monitor animal health and performance, then adjust ratios based on results.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Both fresh and dried larvae are available, each with specific advantages. Fresh larvae have higher moisture content and are ideal for immediate feeding, while dried larvae offer longer shelf life and easier storage.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-12 font-serif">The Future of Sustainable Farming</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              As global demand for protein continues to rise and environmental concerns intensify, BSF larvae represent a sustainable path forward. They offer a solution that benefits farmers economically while supporting environmental conservation.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              The adoption of BSF larvae in farming is not just a trend—it's a necessary evolution toward more sustainable and resilient agricultural systems. Farmers who embrace this innovation today are positioning themselves for long-term success in an increasingly resource-conscious world.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-cream text-gray-700 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
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
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2">
                    {related.category}
                  </span>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}