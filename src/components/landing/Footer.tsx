'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black border-t border-[#96ff00]/20 py-8">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 relative">
                <div className="absolute inset-0 bg-black rounded-sm border-2 border-[#96ff00] shadow-[0_0_10px_rgba(150,255,0,0.5)]"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#96ff00] font-pixel text-sm">AI</div>
              </div>
              <span className="text-[#96ff00] font-pixel text-sm">SHARKTANK</span>
            </div>
          </div>
          
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>© {currentYear} AI SharkTank. All rights reserved.</p>
            <div className="mt-2">
              <Link href="/terms" className="text-[#96ff00] hover:text-[#b8ff66] transition-colors mr-4">
                Terms
              </Link>
              <Link href="/privacy" className="text-[#96ff00] hover:text-[#b8ff66] transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
