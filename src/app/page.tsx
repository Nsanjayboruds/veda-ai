"use client";

import React, { useState, useEffect } from "react";
import { useAssessmentStore } from "@/lib/store";
import { FileUploader } from "@/components/upload/FileUploader";
import { ProcessingProgress } from "@/components/processing/ProcessingProgress";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, HelpCircle, Sparkles, ChevronDown, ClipboardList } from "lucide-react";

export default function Home() {
  const { status, loadDemoData, reset } = useAssessmentStore();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#EAEAEA] via-[#DFDFDF] to-[#CBCBCB] overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden" 
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden shadow-2xl"
            >
              <Sidebar isOpen={true} onToggle={() => setIsMobileMenuOpen(false)} isMobileOverlay={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* 
        The main content area floats on top of the app background.
      */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        
        {/* Top Contextual Header (Responsive) */}
        {/* Desktop Header (Floating Pill) */}
        <header className="hidden md:flex w-full px-6 pt-6 shrink-0 z-10 max-w-[1400px] mx-auto">
          <div className="bg-white rounded-[28px] h-[72px] w-full px-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 text-slate-700 pl-2">
              <button onClick={reset} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                <ArrowLeft className="w-[22px] h-[22px] text-[#1F2937]" strokeWidth={2} />
              </button>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-[20px] h-[20px] text-[#9CA3AF]" strokeWidth={2} />
                <span className="font-semibold text-[17px] tracking-tight text-[#9CA3AF]">Exams</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pr-2">
              {status !== 'complete' && (
                <button
                  onClick={loadDemoData}
                  className="text-xs font-bold text-orange-600 bg-orange-100 px-4 py-2.5 rounded-full hover:bg-orange-200 transition-colors shadow-sm mr-2"
                >
                  Try Demo
                </button>
              )}
              
              <button className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors text-[#1F2937]">
                <HelpCircle className="w-[22px] h-[22px]" strokeWidth={2} />
              </button>
              
              <button className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors text-[#1F2937] relative">
                <Bell className="w-[22px] h-[22px]" strokeWidth={2} />
                <span className="absolute top-[6px] right-[8px] w-2.5 h-2.5 bg-[#FF5722] rounded-full border-2 border-white"></span>
              </button>
              
              <button className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors text-[#1F2937]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                </svg>
              </button>
              
              <div className="flex items-center gap-3 pl-3 ml-1 border-l border-transparent">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                  <img 
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Madhur&backgroundColor=e2e8f0" 
                    alt="Madhur Rastogi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[15px] font-bold text-[#1F2937] tracking-tight">Madhur Rastogi</span>
                <ChevronDown className="w-5 h-5 text-[#1F2937]" strokeWidth={2} />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header (Pill Shape) */}
        <header className="md:hidden w-full px-4 pt-4 z-10 shrink-0">
          <div className="bg-white rounded-[24px] h-[60px] px-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 text-[#1F2937]">
              <button onClick={reset} className="hover:text-black transition-colors">
                <ArrowLeft className="w-[22px] h-[22px]" strokeWidth={2.5} />
              </button>
              <span className="font-bold text-[20px] tracking-tight">VedaAI</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Bell Icon in gray circle */}
              <button className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center relative text-slate-700">
                <Bell className="w-[22px] h-[22px]" strokeWidth={2} />
                <span className="absolute top-[8px] right-[10px] w-2.5 h-2.5 bg-[#FF5722] rounded-full border-2 border-white"></span>
              </button>
              
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                <img 
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Madhur&backgroundColor=e2e8f0" 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hamburger */}
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#1F2937] ml-1">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'error' ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0 flex flex-col overflow-auto"
              >
                <div className="flex-1 w-full mx-auto px-6 pt-10 pb-20 flex flex-col items-center">
                  <FileUploader />
                </div>
              </motion.div>
            ) : status === 'uploading' || status === 'processing' ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="absolute inset-0 flex items-center justify-center bg-transparent"
              >
                <ProcessingProgress />
              </motion.div>
            ) : status === 'complete' ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col bg-white"
              >
                <ResultsDashboard />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
