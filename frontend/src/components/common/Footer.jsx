import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LearnKartLogo } from './Icons';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <defs>
                  <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#06b6d4', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="14" fill="url(#bgGradient)" />
                <path
                  d="M10 13L16 19L22 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <g transform="translate(20, 9)">
                  <path
                    d="M0 0L0.8 1.5L2.5 2L1 2.5L0.5 4L-0.5 2.5L-2 2L-0.8 1.5Z"
                    fill="white"
                    opacity="0.9"
                  />
                </g>
                <path
                  d="M12 23L20 23"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
              <div>
                <h2 className="font-heading font-black text-2xl block" style={{
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>LearnKart</h2>
                <p className="text-xs font-semibold tracking-wide text-blue-300">Learning Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering learners worldwide with AI-driven, expert-led courses and real-world projects.
            </p>
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:support@learnkart.com" className="hover:text-white transition">support@learnkart.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <a href="tel:+918012345678" className="hover:text-white transition">+91 (80) 1234-5678</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-400" />
                <span>Bangalore, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold mb-5 text-white uppercase text-sm tracking-wider">Platform</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/courses" className="hover:text-blue-300 transition duration-200">Explore Courses</Link></li>
              <li><Link to="/browse" className="hover:text-blue-300 transition duration-200">Browse All</Link></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Learning Paths</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Certifications</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Enterprise</a></li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h3 className="font-heading font-bold mb-5 text-white uppercase text-sm tracking-wider">For Students</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Browse Courses</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">My Learning</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">My Certificates</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Discussion Forum</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Help Center</a></li>
            </ul>
          </div>

          {/* For Instructors */}
          <div>
            <h3 className="font-heading font-bold mb-5 text-white uppercase text-sm tracking-wider">For Instructors</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/register" className="hover:text-blue-300 transition duration-200">Teach on LearnKart</Link></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Course Guidelines</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Resources</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Instructor Hub</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Monetization</a></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="font-heading font-bold mb-5 text-white uppercase text-sm tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400 mb-8">
              <li><a href="#" className="hover:text-blue-300 transition duration-200">About Us</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Careers</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-blue-300 transition duration-200">Press</a></li>
            </ul>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-blue-300 hover:bg-white/20 transition duration-200" title="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-blue-300 hover:bg-white/20 transition duration-200" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-blue-300 hover:bg-white/20 transition duration-200" title="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Copyright and Brand */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <LearnKartLogo size={16} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-300">© {currentYear} LearnKart LMS</span>
            </div>
            <p className="text-gray-500 text-sm">
              – Transforming Education Through AI & Technology
            </p>
          </div>

          {/* Right: Legal Links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-blue-300 transition duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-blue-300 transition duration-200">Terms of Service</a>
            <a href="#" className="hover:text-blue-300 transition duration-200">Cookie Policy</a>
          </div>
        </div>

        {/* Footer Bottom Accent */}
        <div className="mt-8 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-gray-600 text-xs">
            Built by Vineet Salimath <span className="text-red-400">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
