import { motion } from "framer-motion";
import { LuPhone, LuMailCheck } from "react-icons/lu";
import { FaFacebookF } from "react-icons/fa";
import { SiInstagram, SiX } from "react-icons/si";

const Footer = () => {
  const footerLinks = {
    Shop: ["New Arrivals", "Sale", "Gift Cards"],
    Support: ["Contact Us", "FAQs", "Delivery", "Returns"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              ShopVerse
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted destination for quality products. We bring you the
              best selection with unbeatable prices and exceptional service.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebookF />, label: "Facebook" },
                { icon: <SiX />, label: "Twitter" },
                { icon: <SiInstagram />, label: "Instagram" },
              ].map((social, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-500 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-lg mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-400">
            <div className="flex items-center gap-3">
              <LuPhone className="w-5 h-5 text-red-500" />
              <span>+234 704 050 6544</span>
            </div>
            <div className="flex items-center gap-3">
              <LuMailCheck className="w-5 h-5 text-red-500" />
              <span>support@shopverse.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>&copy; 2025 ShopVerse. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
