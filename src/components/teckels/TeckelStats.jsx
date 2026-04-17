import React from 'react';
import { motion } from 'framer-motion';
import { Dog, MapPin, Scissors, Users } from 'lucide-react';

export default function TeckelStats({ teckels }) {
  const totalCount = teckels.length;
  const cantonCount = new Set(teckels.map(t => t.canton)).size;
  const coatTypes = teckels.reduce((acc, t) => {
    acc[t.coat_type] = (acc[t.coat_type] || 0) + 1;
    return acc;
  }, {});
  const maleCount = teckels.filter(t => t.gender === 'Mâle').length;
  const femaleCount = teckels.filter(t => t.gender === 'Femelle').length;

  const stats = [
    { 
      icon: Dog, 
      value: totalCount, 
      label: 'Teckels enregistrés',
      color: 'from-amber-500 to-amber-700'
    },
    { 
      icon: MapPin, 
      value: cantonCount, 
      label: 'Cantons représentés',
      color: 'from-amber-600 to-amber-800'
    },
    { 
      icon: Scissors, 
      value: Object.keys(coatTypes).length, 
      label: 'Types de poil',
      color: 'from-amber-700 to-amber-900'
    },
    { 
      icon: Users, 
      value: `${maleCount}/${femaleCount}`, 
      label: 'Mâles / Femelles',
      color: 'from-amber-800 to-stone-800'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative group"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
          <div className="relative bg-stone-900/80 backdrop-blur-sm rounded-xl border border-amber-900/30 p-5 text-center">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
              <stat.icon className="w-5 h-5 text-amber-100" />
            </div>
            <p className="text-2xl font-bold text-amber-100">{stat.value}</p>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}





