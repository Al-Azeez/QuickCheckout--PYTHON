import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Database, QrCode } from 'lucide-react';

export const AdminSettings = () => {
  const [storeName, setStoreName] = useState('QUICKCHECKOUT SMART SUPERMARKET');
  const [branch, setBranch] = useState('Express Store #104, Indiranagar');
  const [gstin, setGstin] = useState('29AABCS1429B1Z5');
  const [upiVpa, setUpiVpa] = useState('quickcheckout@icici');
  const [taxPercent, setTaxPercent] = useState('5.0');
  const [turnstileTimeout, setTurnstileTimeout] = useState('15');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Supermarket Node Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure physical store parameters, GST billing identities, and soundbox credentials
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Store configurations updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registered Commercial Supermarket Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Store Branch / Physical Location
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Government GSTIN Number
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Soundbox UPI Merchant VPA
              </label>
              <input
                type="text"
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supermarket GST Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Turnstile Gate Pass Validity (mins)
              </label>
              <input
                type="number"
                value={turnstileTimeout}
                onChange={(e) => setTurnstileTimeout(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Save Store Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
