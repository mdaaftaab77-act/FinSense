import React from 'react';
import { PlayerStats } from '../types';
import { Wallet, Smile, Shield, BookOpen } from 'lucide-react';

interface Props {
  stats: PlayerStats;
}

const StatsBar: React.FC<Props> = ({ stats }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-orange-200 shadow-md z-50 px-4 py-3 flex justify-between items-center overflow-x-auto">
      <div className="flex space-x-6 min-w-max mx-auto md:mx-0">
        
        {/* Savings */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-full text-green-600">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Wallet</p>
            <p className="font-bold text-gray-800">₹{stats.savings.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Happiness */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
            <Smile size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Joy</p>
            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-full bg-yellow-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, stats.happiness))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Resilience */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Security</p>
            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, stats.financialResilience))}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsBar;
