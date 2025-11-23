import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Stethoscope, Calendar, DollarSign, Activity, Clock, CheckCircle, ClipboardList, ArrowRight, User as UserIcon } from 'lucide-react';
import { db } from '../services/db';
import { User, Role } from '../types';

export const Dashboard: React.FC = () => {
  const userString = localStorage.getItem('hms_user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  const patients = db.getPatients();
  const doctors = db.getDoctors();
  const appointments = db.getAppointments();

  const activeAppts = appointments.filter(a => a.status === 'Scheduled').length;

  // --- PATIENT VIEW ---
  if (user?.role === Role.PATIENT) {
    const myAppts = appointments.filter(a => a.patientId === user.id);
    const myScheduled = myAppts.filter(a => a.status === 'Scheduled');
    const myHistory = myAppts.filter(a => a.status !== 'Scheduled');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Dashboard</h2>
                <span className="text-sm text-slate-500 dark:text-gray-400 bg-white dark:bg-sombre-900 px-3 py-1 rounded-full shadow-sm border border-slate-100 dark:border-sombre-700">
                Hello, {user.name}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Upcoming Appointments</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{myScheduled.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-50 dark:bg-teal-900/30 text-teal-500">
                        <Calendar size={24} />
                    </div>
                </div>
                 <div className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Total Visits</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{myHistory.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-50 dark:bg-purple-900/30 text-purple-500">
                        <Activity size={24} />
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700">
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Scheduled Visits</h3>
                     {myScheduled.length > 0 ? (
                         <div className="space-y-3">
                             {myScheduled.map(a => (
                                 <div key={a.id} className="p-4 rounded-xl bg-slate-50 dark:bg-sombre-800 border border-slate-100 dark:border-sombre-700">
                                     <p className="font-semibold text-slate-700 dark:text-gray-200">{a.date} at {a.time}</p>
                                     <p className="text-sm text-slate-500 dark:text-gray-400">with {a.doctorName}</p>
                                 </div>
                             ))}
                         </div>
                     ) : <p className="text-slate-500 dark:text-gray-400">No upcoming appointments.</p>}
                 </div>
            </div>
        </div>
    );
  }

  // --- DOCTOR VIEW ---
  if (user?.role === Role.DOCTOR) {
      const myAppointments = appointments.filter(a => a.doctorId === user.id);
      const todaysAppointments = myAppointments.filter(a => a.status === 'Scheduled');
      const nextPatient = todaysAppointments[0];
      const completedCount = myAppointments.filter(a => a.status === 'Completed').length;

      return (
        <div className="space-y-8 animate-in fade-in duration-500">
           {/* Header with Darker Theme for Contrast */}
           <div className="bg-slate-800 dark:bg-black rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-700 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 font-medium mb-1">Good Morning,</p>
                            <h2 className="text-3xl font-bold mb-4">{user.name}</h2>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded-lg">
                            <Clock className="text-blue-400" />
                        </div>
                    </div>
                    <div className="flex gap-6 mt-4">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold">{todaysAppointments.length}</span>
                            <span className="text-sm text-slate-400">Remaining Today</span>
                        </div>
                        <div className="w-px bg-slate-700 h-12"></div>
                         <div className="flex flex-col">
                            <span className="text-3xl font-bold text-green-400">{completedCount}</span>
                            <span className="text-sm text-slate-400">Completed Total</span>
                        </div>
                    </div>
                </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Next Patient Card */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <UserIcon className="text-blue-600" /> Up Next
                    </h3>
                    {nextPatient ? (
                        <div className="bg-white dark:bg-sombre-900 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                                {nextPatient.patientName.charAt(0)}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{nextPatient.patientName}</h4>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-sombre-800 rounded-full text-sm text-slate-600 dark:text-gray-300 font-medium">
                                        {nextPatient.time}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                        Checkup
                                    </span>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-sombre-800 rounded-xl text-slate-600 dark:text-gray-400 italic text-sm border border-slate-100 dark:border-sombre-700">
                                    "{nextPatient.notes || 'No specific notes provided for this visit.'}"
                                </div>
                                <div className="mt-6 flex gap-4 justify-center md:justify-start">
                                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                                        Start Consultation <ArrowRight size={18} />
                                    </button>
                                    <button className="px-6 py-3 border border-slate-200 dark:border-sombre-700 text-slate-600 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-sombre-800 transition-colors">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-sombre-900 border border-slate-100 dark:border-sombre-700 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center">
                            <CheckCircle size={48} className="text-green-400 mb-4" />
                            <p className="text-lg">You're all caught up for now!</p>
                        </div>
                    )}
                </div>

                {/* Quick List */}
                <div>
                     <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Queue</h3>
                     <div className="bg-white dark:bg-sombre-900 rounded-3xl shadow-sm border border-slate-100 dark:border-sombre-700 overflow-hidden max-h-[500px] overflow-y-auto">
                        {todaysAppointments.length > 0 ? todaysAppointments.slice(1).map((appt, idx) => (
                            <div key={appt.id} className="p-4 border-b border-slate-50 dark:border-sombre-800 hover:bg-slate-50 dark:hover:bg-sombre-800 transition-colors flex items-center gap-4">
                                <div className="text-center min-w-[3rem]">
                                    <p className="font-bold text-slate-800 dark:text-white">{appt.time}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-700 dark:text-gray-200">{appt.patientName}</p>
                                    <p className="text-xs text-slate-400">Regular Visit</p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-400 text-sm">No other patients in queue.</div>
                        )}
                        {todaysAppointments.length > 0 && todaysAppointments.slice(1).length === 0 && (
                             <div className="p-8 text-center text-slate-400 text-sm">Next patient is displayed above.</div>
                        )}
                     </div>
                </div>
           </div>
        </div>
      );
  }
  
  // --- ADMIN/STAFF VIEW ---
  const chartData = [
    { name: 'Mon', visits: 12 },
    { name: 'Tue', visits: 19 },
    { name: 'Wed', visits: 15 },
    { name: 'Thu', visits: 22 },
    { name: 'Fri', visits: 28 },
    { name: 'Sat', visits: 10 },
  ];

  const StatCard = ({ title, value, icon, color, darkColor }: any) => (
    <div className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700 flex items-center justify-between transition-colors">
      <div>
        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} ${darkColor}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Overview</h2>
        <span className="text-sm text-slate-500 dark:text-gray-400 bg-white dark:bg-sombre-900 px-3 py-1 rounded-full shadow-sm border border-slate-100 dark:border-sombre-700">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Patients" 
          value={patients.length} 
          icon={<Users size={24} className="text-blue-500 dark:text-blue-400" />} 
          color="bg-blue-50" 
          darkColor="dark:bg-blue-900/20"
        />
        <StatCard 
          title="Doctors Available" 
          value={doctors.length} 
          icon={<Stethoscope size={24} className="text-teal-500 dark:text-teal-400" />} 
          color="bg-teal-50" 
          darkColor="dark:bg-teal-900/20"
        />
        <StatCard 
          title="Appointments" 
          value={activeAppts} 
          icon={<Calendar size={24} className="text-purple-500 dark:text-purple-400" />} 
          color="bg-purple-50" 
          darkColor="dark:bg-purple-900/20"
        />
        <StatCard 
          title="Daily Revenue" 
          value="$3,240" 
          icon={<DollarSign size={24} className="text-rose-500 dark:text-rose-400" />} 
          color="bg-rose-50" 
          darkColor="dark:bg-rose-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Patient Visits</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="visits" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-sombre-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-sombre-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
             {[1, 2, 3].map((_, i) => (
               <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-sombre-800 rounded-lg transition-colors">
                 <div className="w-2 h-2 rounded-full bg-teal-400 mt-2" />
                 <div>
                   <p className="text-sm font-medium text-slate-800 dark:text-gray-200">New appointment scheduled</p>
                   <p className="text-xs text-slate-500 dark:text-gray-500">2 hours ago</p>
                 </div>
               </div>
             ))}
             <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-sombre-800 rounded-lg transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                <div>
                   <p className="text-sm font-medium text-slate-800 dark:text-gray-200">Dr. Sarah completed surgery</p>
                   <p className="text-xs text-slate-500 dark:text-gray-500">5 hours ago</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};