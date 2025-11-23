import React, { useState } from 'react';
import { User, Role } from '../types';
import { Activity, Sun, Moon, Mail, Lock } from 'lucide-react';
import { db } from '../services/db';

interface LoginProps {
  onLogin: (user: User) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check Admin
    if (email === 'admin@pastel.com' && password === 'admin') {
      onLogin({ id: 'a1', email: 'admin@pastel.com', role: Role.ADMIN, name: 'Dr. Admin' });
      return;
    } 
    
    // Check Staff
    if (email === 'staff@pastel.com' && password === 'staff') {
      onLogin({ id: 's1', email: 'staff@pastel.com', role: Role.STAFF, name: 'Nurse Joy' });
      return;
    } 

    // Check Doctors
    const doctors = db.getDoctors();
    const doctor = doctors.find(d => d.email === email && d.password === password);
    if (doctor) {
        onLogin({ id: doctor.id, email: doctor.email, role: Role.DOCTOR, name: doctor.name });
        return;
    }
    
    // Check Patients
    const patients = db.getPatients();
    const patient = patients.find(p => p.email === email && p.password === password);
    
    if (patient) {
        onLogin({ id: patient.id, email: patient.email, role: Role.PATIENT, name: patient.name });
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-green-50 dark:from-sombre-950 dark:via-sombre-900 dark:to-sombre-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme} 
        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/80 dark:bg-sombre-800 shadow-lg text-slate-600 dark:text-yellow-400 transition-all hover:scale-110 hover:shadow-xl border border-white/20 dark:border-sombre-700 backdrop-blur-sm"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Login Form Card */}
      <div className="bg-white dark:bg-sombre-900 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 dark:border-sombre-800 backdrop-blur-sm transition-all duration-300 z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-400/30 mb-4 rotate-3 transform transition-transform hover:rotate-6">
            <Activity size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 dark:text-gray-400">Sign in to PastelCare HMS</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900 text-rose-500 dark:text-rose-400 text-sm rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Email Address</label>
            <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-sombre-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all bg-slate-50 dark:bg-sombre-800 text-slate-900 dark:text-white placeholder-slate-400"
                placeholder="you@hospital.com"
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-sombre-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all bg-slate-50 dark:bg-sombre-800 text-slate-900 dark:text-white placeholder-slate-400"
                placeholder="Enter password"
                />
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-teal-500 focus:ring-teal-400" />
                  Remember me
              </label>
              <button type="button" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium">Forgot password?</button>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98] transform"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};