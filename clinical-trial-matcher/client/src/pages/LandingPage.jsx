// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, Stethoscope } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="text-blue-600 h-8 w-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            NeuroPrint Matcher
          </span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Connecting Patients to <br className="hidden md:block"/>
            <span className="text-blue-600">Lifesaving Clinical Trials</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            AI-powered matching platform for healthcare professionals. Instantly find the right trial protocols for your patients based on deep demographic and condition correlations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-lg font-semibold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
            >
              Start Matching Now
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-lg font-semibold bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition drop-shadow-sm"
            >
              Request Demo
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl px-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start text-left">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Automated AI Matching</h3>
            <p className="text-slate-600 text-sm">Powered by Groq's insanely fast LLMs to determine patient eligibility instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start text-left">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Secure & Compliant</h3>
            <p className="text-slate-600 text-sm">Built robustly with privacy in mind. Ready for modern clinic infrastructure.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start text-left">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Designed for Doctors</h3>
            <p className="text-slate-600 text-sm">Optimized interfaces letting practitioners focus entirely on patient health outcomes.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-slate-500 text-sm">
        <p>&copy; 2026 NeuroPrint Matcher. All rights reserved.</p>
      </footer>
    </div>
  );
}
