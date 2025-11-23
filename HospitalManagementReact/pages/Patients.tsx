import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Patient } from '../types';
import { Search, Plus, X, Wand2, Mail, Lock, User, Calendar, Phone, MapPin, FileText } from 'lucide-react';

export const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '', email: '', password: '', age: 0, gender: 'Male', bloodType: 'O+', contact: '', address: '', medicalHistory: ''
  });

  useEffect(() => {
    setPatients(db.getPatients());
  }, []);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$";
    let pass = "";
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setNewPatient({...newPatient, password: pass});
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPatient.name && newPatient.contact && newPatient.email && newPatient.password) {
      const p: Patient = {
        ...newPatient as Patient,
        id: Date.now().toString(),
        lastVisit: new Date().toISOString().split('T')[0],
      };
      
      db.addPatient(p);
      setPatients(db.getPatients());
      setIsModalOpen(false);
      setNewPatient({ name: '', email: '', password: '', age: 0, gender: 'Male', bloodType: 'O+', contact: '', address: '', medicalHistory: '' });
      
      alert(`Patient Registered!\nLogin: ${p.email}\nPassword: ${p.password}`);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.contact.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Patients</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-teal-500/20 transition-all"
        >
          <Plus size={18} />
          Register Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-sombre-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700 transition-colors">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by name or contact..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-sombre-700 rounded-lg focus:outline-none focus:border-teal-400 bg-white text-slate-900 dark:bg-sombre-800 dark:text-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-sombre-900 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-sombre-800 border-b border-slate-100 dark:border-sombre-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-gray-300">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-gray-300">Age</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-gray-300">Gender</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-gray-300">Blood</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-gray-300">Contact</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-gray-300">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-sombre-800">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-sombre-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-gray-200">
                    <div>
                        <p>{p.name}</p>
                        <p className="text-xs text-slate-400 font-normal">{p.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{p.age}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${p.gender === 'Female' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300' : 
                        p.gender === 'Male' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                      {p.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400 font-mono text-xs">
                     <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded border border-red-100 dark:border-red-900/30">{p.bloodType || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{p.contact}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{p.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Centered Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white dark:bg-sombre-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-100 dark:border-sombre-700">
                
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-sombre-800 flex justify-between items-center bg-white dark:bg-sombre-900 rounded-t-2xl">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Register New Patient</h3>
                        <p className="text-slate-500 dark:text-gray-400">Create a new patient profile and login credentials.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-sombre-800 text-slate-500 dark:text-gray-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-sombre-950/50">
                    <form id="patientForm" onSubmit={handleAddPatient} className="space-y-6">
                        
                        {/* Account Info Section */}
                        <div className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-800">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Lock size={20} className="text-teal-500" /> Account Credentials
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="email" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white transition-all"
                                        value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} placeholder="patient@email.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Password</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input required type="text" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white transition-all"
                                            value={newPatient.password} onChange={e => setNewPatient({...newPatient, password: e.target.value})} placeholder="Safe password" />
                                        </div>
                                        <button type="button" onClick={generatePassword} className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 flex items-center gap-2 transition-colors">
                                            <Wand2 size={18} /> Gen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Info Section */}
                        <div className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-800">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <User size={20} className="text-blue-500" /> Personal Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Full Name</label>
                                    <input required type="text" className="w-full px-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                    value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Age</label>
                                        <input required type="number" className="w-full px-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                        value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: parseInt(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Gender</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                        value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value as any})}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Blood Type</label>
                                    <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                    value={newPatient.bloodType} onChange={e => setNewPatient({...newPatient, bloodType: e.target.value as any})}>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Contact Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="text" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                        value={newPatient.contact} onChange={e => setNewPatient({...newPatient, contact: e.target.value})} />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input type="text" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                                        value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical Info Section */}
                        <div className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-800">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-rose-500" /> Medical Profile
                            </h4>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Medical History & Notes</label>
                                <textarea className="w-full px-4 py-3 border border-slate-200 dark:border-sombre-700 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none h-32 resize-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white leading-relaxed"
                                value={newPatient.medicalHistory} onChange={e => setNewPatient({...newPatient, medicalHistory: e.target.value})} placeholder="List known allergies, previous surgeries, or chronic conditions..." />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-slate-100 dark:border-sombre-800 bg-white dark:bg-sombre-900 flex justify-end gap-4 rounded-b-2xl">
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-sombre-800 rounded-xl font-medium transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="patientForm" className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-500/20 font-medium transition-transform active:scale-95 flex items-center gap-2">
                        <Plus size={20} /> Register Patient
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};