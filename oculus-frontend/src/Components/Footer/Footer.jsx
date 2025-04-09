import { NavLink, Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-0 h-screen flex flex-col justify-between relative overflow-hidden">
      {/* OCULUS Background Text */}
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden opacity-5">
        <span className="text-gray-800 font-grotesk font-bold text-[30rem] leading-none tracking-wider">
          OCULUS
        </span>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <div className="max-w-7xl px-10 flex flex-col lg:flex-row lg:justify-between items-center lg:items-start pt-20">
          {/* Logo */}
         

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center lg:justify-start space-x-6 mb-6 lg:mb-0 flex-1">
            {["Pricing", "About us", "Features", "Help Center", "Contact us", "FAQs", "Careers"].map((name, index) => (
              <NavLink
                key={index}
                to={`/${name.toLowerCase().replace(/ /g, "")}`}
                className="font-inter hover:text-gray-400 transition-colors duration-300"
              >
                {name}
              </NavLink>
            ))}
          </div>

          {/* Newsletter Subscription */}
          <div className="w-full lg:w-auto flex-shrink-0 max-w-sm">
            <p className="text-center lg:text-left mb-2 font-dmsans">
            <span className="bg-gradient-to-r mr-2 from-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Subscribe 
            </span>
              
              to our newsletter</p>
            <div className="flex flex-col w-full">
              <div className="flex items-center border-b border-gray-600 pb-2 w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent text-white px-2 py-2 outline-none flex-1 font-worksans"
                />
              </div>
              <div className="relative mt-6 w-60 max-w-xl mx-auto">
                <button
                  className="relative group w-full py-3 bg-transparent uppercase rounded-full text-gray-100 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 font-grotesk text-sm hover:text-gray-600 font-light flex justify-center items-center"
                >
                  Subscribe
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center transition-all duration-300 group-hover:translate-x-1 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300">
                      <ArrowRight
                        size={20}
                        className="text-4xl font-bold"
                      />
                    </div>
                  </div>
                </button>
              </div>
              <div
          className="text-[5rem] sm:text-[10rem] md:text-[15rem] lg:text-[20rem] font-bold text-gray-500 opacity-10 absolute inset-0 flex items-center justify-center select-none pointer-events-none tracking-tighter z-0"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          OCULUS
        </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center border-t border-gray-700 opacity-35 mb-10 mt-6 pt-6 px-6 text-center lg:text-left">
          {/* Copyright & Social Media */}
          <p className="text-gray-400 font-grotesk">&copy; 2024 Brand, Inc. • Privacy • Terms • Sitemap</p>
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <FaTwitter className="hover:text-gray-400 cursor-pointer transition-colors duration-300" />
            <FaFacebookF className="hover:text-gray-400 cursor-pointer transition-colors duration-300" />
            <FaLinkedinIn className="hover:text-gray-400 cursor-pointer transition-colors duration-300" />
            <FaYoutube className="hover:text-gray-400 cursor-pointer transition-colors duration-300" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;