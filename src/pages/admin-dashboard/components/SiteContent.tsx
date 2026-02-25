import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { siteService } from '../../../services/site.service';
import toast from 'react-hot-toast';

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  cta1: string;
  cta2: string;
}

interface FooterInfo {
  address: string;
  phone: string;
  email: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
  };
}

interface AboutMission {
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  missionTitle: string;
  missionText: string;
  missionPoints: string[];
}

interface FeaturedCategory {
  name: string;
  count: number;
  path: string;
  image: string;
}

interface Bestseller {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  whatsappLink: string;
}

export default function SiteContent() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hero' | 'categories' | 'bestsellers' | 'about' | 'footer'>('hero');

  // Hero Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  // Featured Categories State
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);

  // Bestsellers State
  const [bestsellers, setBestsellers] = useState<Bestseller[]>([]);

  // About & Mission State
  const [aboutMission, setAboutMission] = useState<AboutMission>({
    aboutTitle: '',
    aboutText: '',
    aboutImage: '',
    missionTitle: '',
    missionText: '',
    missionPoints: []
  });

  // Footer State
  const [footerInfo, setFooterInfo] = useState<FooterInfo>({
    address: '',
    phone: '',
    email: '',
    socials: { facebook: '', instagram: '', twitter: '', whatsapp: '' }
  });

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const [heroData, aboutData, footerData, catsData, bestData] = await Promise.all([
        siteService.getSiteContent('hero_slides'),
        siteService.getSiteContent('about_mission'),
        siteService.getSiteContent('footer_info'),
        siteService.getSiteContent('featured_categories'),
        siteService.getSiteContent('bestsellers')
      ]);

      if (heroData) setHeroSlides(heroData as HeroSlide[]);
      if (aboutData) setAboutMission(aboutData as AboutMission);
      if (footerData) setFooterInfo(footerData as FooterInfo);
      if (catsData) setCategories(catsData as FeaturedCategory[]);
      if (bestData) setBestsellers(bestData as Bestseller[]);
    } catch (error) {
      console.error('Error loading site content:', error);
      toast.error('Failed to load site content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, data: any) => {
    try {
      const loadingToast = toast.loading('Saving changes...');
      await siteService.updateSiteContent(key, data);
      toast.dismiss(loadingToast);
      toast.success('Content updated successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const loadingToast = toast.loading('Uploading image...');
      const url = await siteService.uploadSiteImage(file);
      callback(url);
      toast.dismiss(loadingToast);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['hero', 'categories', 'bestsellers', 'about', 'footer'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md transition-all cursor-pointer capitalize font-medium ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {tab === 'about' ? 'About & Mission' : tab === 'hero' ? 'Hero Section' : tab === 'categories' ? 'Explore Categories' : tab === 'bestsellers' ? 'Bestsellers' : 'Footer & Contact'}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border"
      >
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Hero Carousel Slides</h3>
              <button
                onClick={() => setHeroSlides([...heroSlides, { title: '', subtitle: '', image: '', cta1: '', cta2: '' }])}
                className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
              >
                <i className="ri-add-line"></i> Add Slide
              </button>
            </div>

            {heroSlides.map((slide, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl border relative">
                <button
                  onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== index))}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slide Title</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const newSlides = [...heroSlides];
                          newSlides[index].title = e.target.value;
                          setHeroSlides(newSlides);
                        }}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
                      <textarea
                        value={slide.subtitle}
                        onChange={(e) => {
                          const newSlides = [...heroSlides];
                          newSlides[index].subtitle = e.target.value;
                          setHeroSlides(newSlides);
                        }}
                        rows={3}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                      <div className="flex items-center gap-4">
                        {slide.image && <img src={slide.image} alt="" className="w-20 h-20 object-cover rounded-lg" />}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => {
                            const newSlides = [...heroSlides];
                            newSlides[index].image = url;
                            setHeroSlides(newSlides);
                          })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA 1 Text</label>
                        <input
                          type="text"
                          value={slide.cta1}
                          onChange={(e) => {
                            const newSlides = [...heroSlides];
                            newSlides[index].cta1 = e.target.value;
                            setHeroSlides(newSlides);
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA 2 Text</label>
                        <input
                          type="text"
                          value={slide.cta2}
                          onChange={(e) => {
                            const newSlides = [...heroSlides];
                            newSlides[index].cta2 = e.target.value;
                            setHeroSlides(newSlides);
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => handleSave('hero_slides', heroSlides)}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90"
              >
                Save Hero Configuration
              </button>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Explore Categories</h3>
              <button
                onClick={() => setCategories([...categories, { name: '', count: 0, path: '', image: '' }])}
                className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
              >
                <i className="ri-add-line"></i> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-xl border relative">
                  <button
                    onClick={() => setCategories(categories.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2"
                  >
                    <i className="ri-close-line"></i>
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => {
                          const newCats = [...categories];
                          newCats[index].name = e.target.value;
                          setCategories(newCats);
                        }}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Count</label>
                        <input
                          type="number"
                          value={cat.count}
                          onChange={(e) => {
                            const newCats = [...categories];
                            newCats[index].count = parseInt(e.target.value);
                            setCategories(newCats);
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Path</label>
                        <input
                          type="text"
                          value={cat.path}
                          onChange={(e) => {
                            const newCats = [...categories];
                            newCats[index].path = e.target.value;
                            setCategories(newCats);
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder="/products?category=..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      <div className="flex items-center gap-2">
                        {cat.image && <img src={cat.image} alt="" className="w-10 h-10 object-cover rounded" />}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => {
                            const newCats = [...categories];
                            newCats[index].image = url;
                            setCategories(newCats);
                          })}
                          className="text-xs flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => handleSave('featured_categories', categories)}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90"
              >
                Save Categories
              </button>
            </div>
          </div>
        )}

        {activeTab === 'bestsellers' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Bestselling Products</h3>
              <button
                onClick={() => setBestsellers([...bestsellers, { id: Date.now(), name: '', price: 0, image: '', rating: 5, whatsappLink: '' }])}
                className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
              >
                <i className="ri-add-line"></i> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bestsellers.map((item, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-xl border relative">
                  <button
                    onClick={() => setBestsellers(bestsellers.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2"
                  >
                    <i className="ri-close-line"></i>
                  </button>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newBest = [...bestsellers];
                            newBest[index].name = e.target.value;
                            setBestsellers(newBest);
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const newBest = [...bestsellers];
                              newBest[index].price = parseInt(e.target.value);
                              setBestsellers(newBest);
                            }}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={item.rating}
                            onChange={(e) => {
                              const newBest = [...bestsellers];
                              newBest[index].rating = parseInt(e.target.value);
                              setBestsellers(newBest);
                            }}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Order Link</label>
                        <input
                          type="text"
                          value={item.whatsappLink}
                          onChange={(e) => {
                            const newBest = [...bestsellers];
                            newBest[index].whatsappLink = e.target.value;
                            setBestsellers(newBest);
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder="https://wa.me/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="flex items-center gap-4">
                          {item.image && <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-lg" />}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (url) => {
                              const newBest = [...bestsellers];
                              newBest[index].image = url;
                              setBestsellers(newBest);
                            })}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => handleSave('bestsellers', bestsellers)}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90"
              >
                Save Bestsellers
              </button>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* About Us Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-2">About Us Section</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
                  <input
                    type="text"
                    value={aboutMission.aboutTitle}
                    onChange={(e) => setAboutMission({ ...aboutMission, aboutTitle: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About Content</label>
                  <textarea
                    value={aboutMission.aboutText}
                    onChange={(e) => setAboutMission({ ...aboutMission, aboutText: e.target.value })}
                    rows={6}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                  <div className="flex items-center gap-4">
                    {aboutMission.aboutImage && <img src={aboutMission.aboutImage} alt="" className="w-20 h-20 object-cover rounded-lg" />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setAboutMission({ ...aboutMission, aboutImage: url }))}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Mission Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Our Mission Section</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission Title</label>
                  <input
                    type="text"
                    value={aboutMission.missionTitle}
                    onChange={(e) => setAboutMission({ ...aboutMission, missionTitle: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission Overview</label>
                  <textarea
                    value={aboutMission.missionText}
                    onChange={(e) => setAboutMission({ ...aboutMission, missionText: e.target.value })}
                    rows={4}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
                    Mission Points
                    <button
                      onClick={() => setAboutMission({ ...aboutMission, missionPoints: [...aboutMission.missionPoints, ''] })}
                      className="text-primary text-xs hover:underline"
                    >
                      + Add Point
                    </button>
                  </label>
                  <div className="space-y-2">
                    {aboutMission.missionPoints.map((point, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...aboutMission.missionPoints];
                            newPoints[i] = e.target.value;
                            setAboutMission({ ...aboutMission, missionPoints: newPoints });
                          }}
                          className="flex-1 border rounded-lg px-3 py-2"
                        />
                        <button
                          onClick={() => setAboutMission({ ...aboutMission, missionPoints: aboutMission.missionPoints.filter((_, idx) => idx !== i) })}
                          className="text-red-500"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => handleSave('about_mission', aboutMission)}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90"
              >
                Save About & Mission
              </button>
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Contact Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={footerInfo.address}
                    onChange={(e) => setFooterInfo({ ...footerInfo, address: e.target.value })}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={footerInfo.phone}
                    onChange={(e) => setFooterInfo({ ...footerInfo, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={footerInfo.email}
                    onChange={(e) => setFooterInfo({ ...footerInfo, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Social Media Links</h3>
                {Object.entries(footerInfo.socials).map(([platform, value]) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform} URL</label>
                    <div className="flex gap-2">
                      <span className="bg-gray-100 flex items-center px-3 rounded-l-lg border border-r-0">
                        <i className={`ri-${platform === 'twitter' ? 'twitter-x' : platform}-line text-gray-500`}></i>
                      </span>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setFooterInfo({
                          ...footerInfo,
                          socials: { ...footerInfo.socials, [platform]: e.target.value }
                        })}
                        className="flex-1 border rounded-r-lg px-3 py-2"
                        placeholder={`https://${platform}.com/...`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => handleSave('footer_info', footerInfo)}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90"
              >
                Save Footer Info
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
