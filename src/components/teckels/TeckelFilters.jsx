import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const CANTONS = [
  "Argovie", "Appenzell Rhodes-Extérieures", "Appenzell Rhodes-Intérieures", 
  "Bâle-Campagne", "Bâle-Ville", "Berne", "Fribourg", "Genève", "Glaris", 
  "Grisons", "Jura", "Lucerne", "Neuchâtel", "Nidwald", "Obwald", "Saint-Gall", 
  "Schaffhouse", "Schwyz", "Soleure", "Thurgovie", "Tessin", "Uri", "Valais", 
  "Vaud", "Zoug", "Zurich"
];

const COAT_TYPES = ["Poil long", "Poil ras", "Poil dur"];
const GENDERS = ["Mâle", "Femelle"];

export default function TeckelFilters({ filters, onFilterChange, onReset, years = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-stone-900/95 to-stone-950/95 backdrop-blur-xl rounded-2xl border border-amber-900/30 p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-amber-900/30">
          <Filter className="w-5 h-5 text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-amber-100">Filtres de recherche</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Canton Filter */}
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-wider">Canton</label>
          <Select
            value={filters.canton || "all"}
            onValueChange={(value) => onFilterChange('canton', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="bg-stone-800/50 border-amber-900/30 text-stone-200 hover:bg-stone-800 focus:ring-amber-500/30">
              <SelectValue placeholder="Tous les cantons" />
            </SelectTrigger>
            <SelectContent className="bg-stone-900 border-amber-900/30">
              <SelectItem value="all" className="text-stone-200 hover:bg-amber-900/30">Tous les cantons</SelectItem>
              {CANTONS.map((canton) => (
                <SelectItem key={canton} value={canton} className="text-stone-200 hover:bg-amber-900/30">
                  {canton}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Year Filter */}
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-wider">Année de naissance</label>
          <Select
            value={filters.year || "all"}
            onValueChange={(value) => onFilterChange('year', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="bg-stone-800/50 border-amber-900/30 text-stone-200 hover:bg-stone-800 focus:ring-amber-500/30">
              <SelectValue placeholder="Toutes les années" />
            </SelectTrigger>
            <SelectContent className="bg-stone-900 border-amber-900/30">
              <SelectItem value="all" className="text-stone-200 hover:bg-amber-900/30">Toutes les années</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()} className="text-stone-200 hover:bg-amber-900/30">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Coat Type Filter */}
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-wider">Type de poil</label>
          <Select
            value={filters.coatType || "all"}
            onValueChange={(value) => onFilterChange('coatType', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="bg-stone-800/50 border-amber-900/30 text-stone-200 hover:bg-stone-800 focus:ring-amber-500/30">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent className="bg-stone-900 border-amber-900/30">
              <SelectItem value="all" className="text-stone-200 hover:bg-amber-900/30">Tous les types</SelectItem>
              {COAT_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="text-stone-200 hover:bg-amber-900/30">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Gender Filter */}
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-wider">Genre</label>
          <Select
            value={filters.gender || "all"}
            onValueChange={(value) => onFilterChange('gender', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="bg-stone-800/50 border-amber-900/30 text-stone-200 hover:bg-stone-800 focus:ring-amber-500/30">
              <SelectValue placeholder="Tous les genres" />
            </SelectTrigger>
            <SelectContent className="bg-stone-900 border-amber-900/30">
              <SelectItem value="all" className="text-stone-200 hover:bg-amber-900/30">Tous les genres</SelectItem>
              {GENDERS.map((gender) => (
                <SelectItem key={gender} value={gender} className="text-stone-200 hover:bg-amber-900/30">
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Reset Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={onReset}
          variant="outline"
          className="bg-transparent border-amber-700/50 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </motion.div>
  );
}





