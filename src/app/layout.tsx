'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth token on load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <html lang="en">
      <head>
        <title>LearnKart - AI-Powered Learning Platform</title>
        <meta name="description" content="Learn smarter with AI-powered education. Personalized courses, intelligent tutoring, and adaptive learning paths." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">LearnKart</h3>
                <p className="text-gray-400 text-sm">
                  AI-powered learning platform for the future of education.
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/courses" className="hover:text-white">Courses</a></li>
                  <li><a href="/ai-tutor" className="hover:text-white">AI Tutor</a></li>
                  <li><a href="#" className="hover:text-white">Certificates</a></li>
                  <li><a href="#" className="hover:text-white">Progress Tracking</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Community</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 LearnKart. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}