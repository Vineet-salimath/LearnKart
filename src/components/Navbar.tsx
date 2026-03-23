'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, BookOpen, MessageCircle, Brain, LogOut, Menu, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface NavbarProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LearnKart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Courses
            </Link>
            <Link href="/ai-tutor" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              AI Tutor
            </Link>
            {user && (
              <Link href="/quiz/1" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                Quiz
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link href="/" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/courses" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Courses
            </Link>
            <Link href="/ai-tutor" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
              AI Tutor
            </Link>
            {user && (
              <Link href="/quiz/1" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                Quiz
              </Link>
            )}
            
            <div className="border-t pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </Link>
                  <Link href="/register" className="block bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-base font-medium text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}