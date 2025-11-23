import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Appointment, Doctor, Patient, User, Role } from '../types';
import { Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [newAppt, setNewAppt] = useState<{patientId: string, doctorId: string, date: string, time: string, notes: string}>({
    patientId: '', doctorId: '', date: '', time: '', notes: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('hms_user');
    if (userStr) {
        const u = JSON.parse(userStr);
        setUser(u);
        setNewAppt(prev => ({...prev, patientId: u.role === Role.PATIENT ? u.id : ''}));
    }
    setAppointments(db.getAppointments());
    setDoctors(db.getDoctors());
    setPatients(db.getPatients());
  }, []);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newAppt.patientId);
    const doctor = doctors.find(d => d.id === newAppt.doctorId);

    if (patient && doctor) {
      const appt: Appointment = {
        id: Date.now().toString(),
        patientId: patient.id,
        doctorId: doctor.id,
        patientName: patient.name,
        doctorName: doctor.name,
        date: newAppt.date,
        time: newAppt.time,
        status: 'Scheduled',
        notes: newAppt.notes
      };
      db.addAppointment(appt);
      setAppointments(db.getAppointments());
      setIsModalOpen(false);
      setNewAppt({ patientId: user?.role === Role.PATIENT ? user.id : '', doctorId: '', date: '', time: '', notes: '' });
    }
  };

  const updateStatus = (id: string, status: Appointment['status']) => {
    db.updateAppointmentStatus(id, status);
    setAppointments(db.getAppointments());
  };

  // Filter appointments if user is a Patient
  const displayAppointments = user?.role === Role.PATIENT 
    ? appointments.filter(a => a.patientId === user.id)
    : appointments;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Appointments</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-teal-500/20"
        >
          <Plus size={18} />
          Schedule Visit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming List */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-200 mb-2">Scheduled</h3>
            {displayAppointments.filter(a => a.status === 'Scheduled').map(appt => (
                <div key={appt.id} className="bg-white dark:bg-sombre-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-sombre-700 flex justify-between items-center hover:border-teal-200 dark:hover:border-teal-900 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-500 dark:text-blue-400">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">{appt.patientName}</h4>
                            <p className="text-sm text-slate-500 dark:text-gray-400 flex items-center gap-1">
                                <span className="text-teal-600 dark:text-teal-400 font-medium">{appt.doctorName}</span> • {appt.date} at {appt.time}
                            </p>
                            {appt.notes && <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Note: {appt.notes}</p>}
                        </div>
                    </div>
                    {user?.role !== Role.PATIENT && (
                    <div className="flex gap-2">
                        <button onClick={() => updateStatus(appt.id, 'Completed')} className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 dark:text-green-400 rounded-full" title="Complete">
                            <CheckCircle size={20} />
                        </button>
                        <button onClick={() => updateStatus(appt.id, 'Cancelled')} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-full" title="Cancel">
                            <XCircle size={20} />
                        </button>
                    </div>
                    )}
                </div>
            ))}
            {displayAppointments.filter(a => a.status === 'Scheduled').length === 0 && <p className="text-slate-400 text-sm">No upcoming appointments.</p>}
        </div>

        {/* History List */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-200 mb-2">History</h3>
            {displayAppointments.filter(a => a.status !== 'Scheduled').map(appt => (
                <div key={appt.id} className="bg-white dark:bg-sombre-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-sombre-700 opacity-75 hover:opacity-100 transition-opacity">
                     <div className="flex justify-between items-center">
                         <div>
                            <h4 className="font-medium text-slate-800 dark:text-white">{appt.patientName}</h4>
                            <p className="text-xs text-slate-500 dark:text-gray-400">{appt.doctorName} • {appt.date}</p>
                         </div>
                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                             appt.status === 'Completed' 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30' 
                                : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                         }`}>
                             {appt.status}
                         </span>
                     </div>
                </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-sombre-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-[fadeIn_0.2s_ease-out] border border-slate-100 dark:border-sombre-700">
            <div className="p-6 border-b border-slate-100 dark:border-sombre-700 bg-slate-50 dark:bg-sombre-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Schedule Appointment</h3>
            </div>
            <form onSubmit={handleSchedule} className="p-6 space-y-4">
                {user?.role !== Role.PATIENT && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Patient</label>
                    <select required className="w-full px-4 py-2 border border-slate-200 dark:border-sombre-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-200 bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                        value={newAppt.patientId} onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}>
                        <option value="">Select Patient</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Doctor</label>
                    <select required className="w-full px-4 py-2 border border-slate-200 dark:border-sombre-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-200 bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                        value={newAppt.doctorId} onChange={e => setNewAppt({...newAppt, doctorId: e.target.value})}>
                        <option value="">Select Doctor</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Date</label>
                        <input required type="date" className="w-full px-4 py-2 border border-slate-200 dark:border-sombre-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-200 bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                            value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Time</label>
                        <input required type="time" className="w-full px-4 py-2 border border-slate-200 dark:border-sombre-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-200 bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                            value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea className="w-full px-4 py-2 border border-slate-200 dark:border-sombre-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-200 h-20 resize-none bg-white text-slate-900 dark:bg-sombre-800 dark:text-white"
                        value={newAppt.notes} onChange={e => setNewAppt({...newAppt, notes: e.target.value})} placeholder="Symptoms, reason for visit..." />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-sombre-800 rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg">Schedule</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};