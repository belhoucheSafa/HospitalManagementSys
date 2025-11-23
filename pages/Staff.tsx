import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Doctor, Role } from '../types';
import { Plus, Mail, Clock, Trash2, Edit2, X, Check, Lock, Wand2 } from 'lucide-react';

export const Staff: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Doctor>({
    id: '',
    name: '',
    email: '',
    password: '',
    specialty: '',
    contact: '',
    availability: ''
  });

  useEffect(() => {
    setDoctors(db.getDoctors());
    const userStr = localStorage.getItem('hms_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === Role.ADMIN);
    }
  }, []);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$";
    let pass = "";
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData({...formData, password: pass});
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ id: '', name: '', email: '', password: '', specialty: '', contact: '', availability: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (doc: Doctor) => {
    setIsEditMode(true);
    setFormData(doc);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      db.updateDoctor(formData);
    } else {
      const newDoc = { ...formData, id: Date.now().toString() };
      db.addDoctor(newDoc);
    }
    setDoctors(db.getDoctors());
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      db.deleteDoctor(id);
      setDoctors(db.getDoctors());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Medical Staff</h2>
        {isAdmin && (
          <button 
            onClick={openAddModal}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-teal-500/20 transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Staff
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700 hover:shadow-md transition-all flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-teal-50 dark:from-teal-900/20 to-transparent opacity-50" />
            
            <div className="relative">
                <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl font-bold mb-4 relative z-10 border-4 border-white dark:border-sombre-900 shadow-sm transition-all group-hover:scale-105">
                {doc.name.charAt(0)}
                </div>
                <div className={`absolute bottom-4 right-0 w-5 h-5 border-2 border-white dark:border-sombre-900 rounded-full ${doc.availability ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            </div>

            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{doc.name}</h3>
            <p className="text-xs text-slate-400 mb-1">{doc.email}</p>
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium mt-1 mb-4">
              {doc.specialty}
            </span>
            
            <div className="w-full space-y-3 border-t border-slate-50 dark:border-sombre-800 pt-4 mt-2">
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-gray-400 text-sm">
                <Mail size={16} className="text-slate-400 dark:text-gray-500" />
                {doc.contact}
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-gray-400 text-sm">
                <Clock size={16} className="text-slate-400 dark:text-gray-500" />
                {doc.availability}
              </div>
            </div>
            
            {isAdmin && (
              <div className="mt-6 flex gap-3 w-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <button 
                    onClick={() => openEditModal(doc)}
                    className="flex-1 py-2 bg-slate-50 dark:bg-sombre-800 text-slate-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-sombre-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="flex-1 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Centered Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white dark:bg-sombre-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-100 dark:border-sombre-700">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-sombre-800 flex justify-between items-center bg-white dark:bg-sombre-900 rounded-t-2xl">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {isEditMode ? 'Edit Staff Member' : 'Register New Staff'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-sombre-800 text-slate-500 dark:text-gray-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-sombre-950/50">
                    <form id="staffForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white dark:bg-sombre-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-800 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Full Name</label>
                                    <input 
                                    required 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Email (Login ID)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                        required 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Password</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input required type="text" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white transition-all"
                                            value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
                                        </div>
                                        <button type="button" onClick={generatePassword} className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 flex items-center gap-2 transition-colors">
                                            <Wand2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Specialty</label>
                                    <input 
                                    required 
                                    type="text" 
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Contact Info</label>
                                    <input 
                                    required 
                                    type="text" 
                                    value={formData.contact}
                                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Availability Schedule</label>
                                    <input 
                                    required 
                                    type="text" 
                                    value={formData.availability}
                                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="px-8 py-6 border-t border-slate-100 dark:border-sombre-800 bg-white dark:bg-sombre-900 flex justify-end gap-4 rounded-b-2xl">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)} 
                        className="px-6 py-3 text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-sombre-800 rounded-xl transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="staffForm"
                        className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-2 font-medium"
                    >
                        <Check size={18} />
                        {isEditMode ? 'Update Staff' : 'Register Staff'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};