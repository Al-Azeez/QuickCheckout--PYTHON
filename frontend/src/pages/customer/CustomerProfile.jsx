import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CustomerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || 'Abdul Khan');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(user?.address || 'Indiranagar 100ft Road, Bengaluru, Karnataka');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name, phone, address });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-qc-canvas py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Customer Profile & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your personal profile and digital invoice communication channels
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h2>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Verified Self-Checkout Member
              </span>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp & SMS Number for Tax Receipts
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Residential Address (Optional)
              </label>
              <textarea
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Save Profile Updates
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CustomerProfile;
