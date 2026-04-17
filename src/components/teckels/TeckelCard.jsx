import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TeckelCard({ teckel, index = 0 }) {
  const coatTypeStyles = {
    'Poil long': 'bg-amber-900/20 text-amber-200 border-amber-700/30',
    'Poil ras': 'bg-stone-800/40 text-stone-200 border-stone-600/30',
    'Poil dur': 'bg-yellow-900/20 text-yellow-200 border-yellow-700/30'
  };

  const genderIcon = teckel.gender === 'Mâle' ? '♂' : '♀';
  const genderColor = teckel.gender === 'Mâle' ? 'text-blue-400' : 'text-pink-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-700/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link
        to={`/teckels/${teckel.id}`}
        className="block relative bg-gradient-to-br from-stone-900 to-stone-950 rounded-2xl overflow-hidden border border-amber-900/30 shadow-2xl shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        aria-label={`Voir la fiche de ${teckel.name}`}
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent z-10" />
          
          {teckel.photo_url ? (
            <img
              src={teckel.photo_url}
              alt={teckel.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-stone-900 flex items-center justify-center">
              <span className="text-6xl opacity-40">🐕</span>
            </div>
          )}
          
          {/* Coat Type Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${coatTypeStyles[teckel.coat_type]}`}>
              {teckel.coat_type}
            </span>
          </div>
          
          {/* Gender Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className={`text-2xl ${genderColor}`}>{genderIcon}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Name */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xl font-semibold text-amber-100 tracking-wide">
              {teckel.name}
            </h3>
          </div>
          
          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-400 text-sm">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>{teckel.canton}</span>
            </div>
            
            <div className="flex items-center gap-2 text-stone-400 text-sm">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>
                {teckel.birth_date && format(new Date(teckel.birth_date), 'd MMMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>
          
          {/* Color Tag */}
          {teckel.color && (
            <div className="mt-4 pt-4 border-t border-amber-900/30">
              <span className="text-xs text-stone-500 uppercase tracking-wider">Robe</span>
              <p className="text-amber-200/80 text-sm mt-1">{teckel.color}</p>
            </div>
          )}
        </div>
        
        {/* Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />
      </Link>
    </motion.div>
  );
}





