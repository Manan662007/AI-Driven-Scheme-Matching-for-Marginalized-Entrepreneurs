import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import VoiceGuide from '../VoiceGuide';
import Chatbot from '../Chatbot';

export default function Layout() {
  return (
    <div className="min-h-screen bg-green-50/50 dark:bg-green-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <BottomNav />
      <VoiceGuide />
      <Chatbot />
      <Toaster position="top-center" />
    </div>
  );
}
