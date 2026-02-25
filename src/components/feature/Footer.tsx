import { Link } from 'react-router-dom';
import { useSiteContent } from '../../hooks/useSiteContent';

export default function Footer() {
  const { content: footerContent, loading } = useSiteContent('footer_info');

  const defaultSocials = {
    facebook: 'https://facebook.com/naadanhub',
    instagram: 'https://instagram.com/naadanhub',
    twitter: 'https://twitter.com/naadanhub',
    whatsapp: 'https://wa.me/919746155376'
  };

  const socials = footerContent?.socials || defaultSocials;
  const address = footerContent?.address || 'Kottayam, Kerala, India';
  const phone = footerContent?.phone || '+91 97461 55376';
  const email = footerContent?.email || 'info@naadanhub.com';

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
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <i className="ri-facebook-fill text-xl"></i>
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <i className="ri-instagram-line text-xl"></i>
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <i className="ri-twitter-fill text-xl"></i>
                </a>
              )}
              {socials.whatsapp && (
                <a
                  href={socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <i className="ri-whatsapp-line text-xl"></i>
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
                <Link to="/blog" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/become-seller" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Products</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products?category=chips" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Naadan Chips
                </Link>
              </li>
              <li>
                <Link to="/products?category=spices" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Organic Spices
                </Link>
              </li>
              <li>
                <Link to="/products?category=powders" className="text-emerald-100 hover:text-white transition-colors cursor-pointer">
                  Spice Powders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <i className="ri-phone-line text-xl mt-1"></i>
                <div>
                  <p className="text-emerald-100">Phone</p>
                  <a href={`tel:${phone}`} className="hover:text-white transition-colors cursor-pointer">
                    {phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <i className="ri-mail-line text-xl mt-1"></i>
                <div>
                  <p className="text-emerald-100">Email</p>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors cursor-pointer">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <i className="ri-map-pin-line text-xl mt-1"></i>
                <div>
                  <p className="text-emerald-100">Location</p>
                  <p>{address}</p>
                </div>
              </li>
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
