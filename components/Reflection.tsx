import React, { useEffect, useState } from 'react';
import { PlayerStats } from '../types';
import { generateReflection } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCcw, User } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  history: any[];
  onRestart: () => void;
}

const Reflection: React.FC<Props> = ({ stats, history, onRestart }) => {
  const [advice, setAdvice] = useState<string>("Analyzing your financial timeline...");

  useEffect(() => {
    generateReflection(history).then(setAdvice);
  }, [history]);

  // Mock data for chart based on history count
  const chartData = history.map((h, i) => ({
    name: `Month ${i + 1}`,
    savings: stats.savings - (Math.random() * 5000) + (i * 2000) // Pseudo-curve for visual
  }));

  // Ensure last point matches actual current savings
  if(chartData.length > 0) {
      chartData[chartData.length - 1].savings = stats.savings;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full mx-auto slide-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Future Outlook</h2>
      </div>

      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8 relative">
        <h3 className="text-indigo-900 font-semibold mb-2">Message from "Future You"</h3>
        <p className="text-indigo-800 italic leading-relaxed text-lg">"{advice}"</p>
      </div>

      <div className="mb-8">
        <h3 className="text-gray-500 font-medium mb-4 text-sm uppercase tracking-wide">Savings Trajectory</h3>
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#4F46E5" 
                    strokeWidth={3} 
                    dot={{ fill: '#4F46E5', strokeWidth: 2 }} 
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-gray-50 p-4 rounded-xl text-center">
             <p className="text-gray-500 text-sm">Final Savings</p>
             <p className="text-xl font-bold text-gray-800">₹{stats.savings.toLocaleString('en-IN')}</p>
         </div>
         <div className="bg-gray-50 p-4 rounded-xl text-center">
             <p className="text-gray-500 text-sm">Resilience Score</p>
             <p className="text-xl font-bold text-gray-800">{stats.financialResilience}/100</p>
         </div>
      </div>

      <button 
        onClick={onRestart}
        className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCcw size={20} />
        Start New Life
      </button>
    </div>
  );
};

export default Reflection;
