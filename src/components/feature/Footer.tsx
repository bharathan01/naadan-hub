import { Link } from 'react-router-dom';
import { useSiteContent } from '../../hooks/useSiteContent';

export default function Footer() {
  const { content: contactContent, loading: contactLoading } = useSiteContent('contact');
  const { content: socialContent, loading: socialLoading } = useSiteContent('social');

  return (
    <footer className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Naadan Hub</h3>
            <p className="text-emerald-100 leading-relaxed">
              Kerala's trusted source for premium agricultural products including BSF larvae, organic fertilizers, and quality farming supplies.
            </p>
            <div className="flex space-x-4">
              {!socialLoading && socialContent?.facebook && (
                <a
                  href={socialContent.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <i className="ri-facebook-fill text-xl"></i>
                </a>
              )}
              {!socialLoading && socialContent?.instagram && (
                <a
                  href={socialContent.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <i className="ri-instagram-line text-xl"></i>
                </a>
              )}
              {!socialLoading && socialContent?.twitter && (
                <a
                  href={socialContent.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <i className="ri-twitter-fill text-xl"></i>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/bsf-education" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  BSF Education
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Products</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products?category=larvae" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  BSF Larvae
                </Link>
              </li>
              <li>
                <Link to="/products?category=dried" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Dried BSF
                </Link>
              </li>
              <li>
                <Link to="/products?category=meal" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  BSF Meal
                </Link>
              </li>
              <li>
                <Link to="/products?category=oil" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  BSF Oil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              {!contactLoading && contactContent?.phone && (
                <li className="flex items-start space-x-3">
                  <i className="ri-phone-line text-xl mt-1"></i>
                  <div>
                    <p className="text-emerald-100">Phone</p>
                    <a href={`tel:${contactContent.phone}`} className="hover:text-white transition-colors cursor-pointer">
                      {contactContent.phone}
                    </a>
                  </div>
                </li>
              )}
              {!contactLoading && contactContent?.email && (
                <li className="flex items-start space-x-3">
                  <i className="ri-mail-line text-xl mt-1"></i>
                  <div>
                    <p className="text-emerald-100">Email</p>
                    <a href={`mailto:${contactContent.email}`} className="hover:text-white transition-colors cursor-pointer">
                      {contactContent.email}
                    </a>
                  </div>
                </li>
              )}
              {!contactLoading && contactContent?.address && (
                <li className="flex items-start space-x-3">
                  <i className="ri-map-pin-line text-xl mt-1"></i>
                  <div>
                    <p className="text-emerald-100">Location</p>
                    <p>{contactContent.address}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-emerald-100 text-sm">
            © {new Date().getFullYear()} Naadan Hub. All rights reserved.
          </p>
          <a 
            href="https://readdy.ai/?ref=logo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-100 hover:text-white text-sm transition-colors cursor-pointer mt-4 md:mt-0"
          >
            Powered by Readdy
          </a>
        </div>
      </div>
    </footer>
  );
}
