import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Header from '@/components/common/Header';
import { MessageCircle, Video, Zap, Globe, Code, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-blue-500/20"
  >
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-blue-300">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </motion.div>
);

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white font-sans">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzYTNhM2EiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      <div className="relative">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
              Experience the Future of Social Networking
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Connect, collaborate, and create like never before with our cutting-edge platform.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <Link to={'/login'}>
                Get Started Now
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureItem 
              icon={<MessageCircle size={32} />} 
              title="Real-time Messaging" 
              description="Instantly connect with colleagues and friends through our advanced chat system."
            />
            <FeatureItem 
              icon={<Video size={32} />} 
              title="HD Video Calls" 
              description="Experience crystal-clear video conferences with our cutting-edge technology."
            />
            <FeatureItem 
              icon={<Zap size={32} />} 
              title="Web3 Integration" 
              description="Securely verify your identity and transact using blockchain technology."
            />
            <FeatureItem 
              icon={<Globe size={32} />} 
              title="Global Connectivity" 
              description="Connect with users worldwide through our intelligent networking algorithm."
            />
            <FeatureItem 
              icon={<Code size={32} />} 
              title="Built-in Code Editor" 
              description="Collaborate on code in real-time with our integrated development environment."
            />
            <FeatureItem 
              icon={<ShoppingBag size={32} />} 
              title="Smart Shopping" 
              description="Discover and purchase products seamlessly within your social experience."
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto border border-blue-500/50"
          >
            <h2 className="text-3xl font-semibold mb-4 text-center text-blue-300">Join the Revolution</h2>
            <p className="text-gray-300 mb-6 text-center">
              Be part of the next-gen social platform trusted by millions worldwide.
            </p>
            <div className="flex justify-center">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Link to={'/register'}>
                  Join Now
                </Link>
              </Button>
            </div>
          </motion.div>
        </main>
        <footer className="bg-gray-900 py-8 mt-16 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2024 TcharGram. All rights reserved. made with 💗 by Trishit Char</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;