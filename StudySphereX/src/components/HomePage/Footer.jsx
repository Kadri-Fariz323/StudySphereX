import {
  FaFacebook,
  FaDiscord,
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-700">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Mission - Takes 2 columns on Large screens */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="LMS Logo" className="h-16" />
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Empowering learners worldwide with accessible, high-quality
              education and industry-recognized certifications.
            </p>
          </div>

          {/* Academic Links */}
          <div>
            <h2 className="mb-4 text-xs font-bold text-gray-900 uppercase tracking-widest">
              Learning
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
               <li><Link className="hover:text-blue-600 transition-colors" to="/">
               Home
              </Link></li>
              <li>
                <Link
                  className="hover:text-blue-600 transition-colors"
                  to="/courses"
                >
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-600 transition-colors"
                  to="/courses"
                >
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-600 transition-colors"
                  to="/courses"
                >
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section - Takes 2 columns on Large screens to balance the layout */}
         
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-200" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-900">StudySphereX</span>.
            Designed for the future of education.
          </div>

          <div className="flex space-x-5">
            <a
              href="#"
              className="text-xl hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-xl hover:text-blue-700 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="text-xl hover:text-indigo-500 transition-colors"
              aria-label="Discord"
            >
              <FaDiscord />
            </a>
            <a
              href="#"
              className="text-xl hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-xl hover:text-gray-900 transition-colors"
              aria-label="Github"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
