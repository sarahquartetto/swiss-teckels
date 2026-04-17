import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Dog, Search, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";

import TeckelCard from '@/components/teckels/TeckelCard';
import TeckelFilters from '@/components/teckels/TeckelFilters';
import TeckelStats from '@/components/teckels/TeckelStats';

export default function Home() {
  const [filters, setFilters] = useState({
    canton: '',
    year: '',
    coatType: '',
    gender: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: teckels = [], isLoading } = useQuery({
    queryKey: ['teckels'],
    queryFn: () => base44.entities.Teckel.list('-created_date'),
  });

  // Get unique years from teckels
  const years = useMemo(() => {
    const yearSet = new Set(
      teckels
        .filter(t => t.birth_date)
        .map(t => new Date(t.birth_date).getFullYear())
    );
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [teckels]);

  // Filter teckels
  const filteredTeckels = useMemo(() => {
    return teckels.filter(teckel => {
      const matchesCanton = !filters.canton || teckel.canton === filters.canton;
      const matchesYear = !filters.year || (teckel.birth_date && new Date(teckel.birth_date).getFullYear().toString() === filters.year);
      const matchesCoatType = !filters.coatType || teckel.coat_type === filters.coatType;
      const matchesGender = !filters.gender || teckel.gender === filters.gender;
      const matchesSearch = !searchTerm || teckel.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCanton && matchesYear && matchesCoatType && matchesGender && matchesSearch;
    });
  }, [teckels, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ canton: '', year: '', coatType: '', gender: '' });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 shadow-lg shadow-amber-900/30 mb-6">
            <Dog className="w-10 h-10 text-amber-100" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent mb-4">
            Teckels de Suisse
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            Le registre non-officiel de classification des teckels en Suisse. 
            Découvrez nos compagnons à quatre pattes par canton, type de poil et année de naissance.
          </p>
        </motion.div>

        {/* Stats */}
        {!isLoading && teckels.length > 0 && (
          <div className="mb-10">
            <TeckelStats teckels={teckels} />
          </div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            <Input
              type="text"
              placeholder="Rechercher un teckel par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 bg-stone-900/80 border-amber-900/30 text-stone-200 placeholder:text-stone-500 focus:ring-amber-500/30 focus:border-amber-700/50 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-10">
          <TeckelFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            years={years}
          />
        </div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center"
        >
          <span className="text-stone-400">
            {filteredTeckels.length} teckel{filteredTeckels.length !== 1 ? 's' : ''} trouvé{filteredTeckels.length !== 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-stone-400">Chargement des teckels...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTeckels.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-6 rounded-full bg-stone-800/50 mb-6">
              <Dog className="w-12 h-12 text-stone-600" />
            </div>
            <h3 className="text-xl text-stone-300 mb-2">Aucun teckel trouvé</h3>
            <p className="text-stone-500">Essayez de modifier vos filtres de recherche</p>
          </motion.div>
        )}

        {/* Teckel Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(filters) + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredTeckels.map((teckel, index) => (
              <TeckelCard key={teckel.id} teckel={teckel} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-8 border-t border-amber-900/20 text-center"
        >
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} Classification des Teckels de Suisse. Projet d'étude Sarah Q.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}