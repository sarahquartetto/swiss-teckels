import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { base44 } from '@/api/base44Client';

export default function TeckelDetail() {
  const { id } = useParams();

  const { data: teckels = [], isLoading, isError, error } = useQuery({
    queryKey: ['teckels'],
    queryFn: () => base44.entities.Teckel.list('-created_date'),
  });

  const teckel = teckels.find((t) => String(t.id) === String(id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-stone-300 hover:text-amber-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </Link>
        </div>

        {isLoading && (
          <div className="text-stone-400">Chargement…</div>
        )}

        {isError && (
          <div className="text-stone-300">
            <p className="mb-2 text-red-200">Erreur de connexion à la base de données.</p>
            <p className="text-sm text-red-200/80 break-words">{String(error?.message || error)}</p>
          </div>
        )}

        {!isLoading && !teckel && (
          <div className="text-stone-300">
            <p className="mb-4">Teckel introuvable.</p>
            <Link to="/" className="text-amber-300 hover:text-amber-200 underline">
              Revenir à l’accueil
            </Link>
          </div>
        )}

        {!isLoading && teckel && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-3xl border border-amber-900/25 bg-stone-950/40 backdrop-blur"
          >
            {/* Hero image */}
            <div className="relative h-[340px] sm:h-[420px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent z-10" />
              {teckel.photo_url ? (
                <img
                  src={teckel.photo_url}
                  alt={teckel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-stone-900 flex items-center justify-center">
                  <span className="text-7xl opacity-40">🐕</span>
                </div>
              )}

              <div className="absolute left-0 right-0 bottom-0 z-20 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h1 className="text-3xl sm:text-4xl font-semibold text-amber-100 tracking-wide">
                    {teckel.name}
                  </h1>
                </div>
                <p className="text-stone-300/90">
                  {teckel.coat_type} • {teckel.gender} • {teckel.color}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-amber-900/20 bg-stone-900/30 p-4">
                  <div className="flex items-center gap-2 text-stone-300">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="text-sm uppercase tracking-wider text-stone-400">Canton</span>
                  </div>
                  <p className="mt-2 text-lg text-amber-100">{teckel.canton}</p>
                </div>

                <div className="rounded-2xl border border-amber-900/20 bg-stone-900/30 p-4">
                  <div className="flex items-center gap-2 text-stone-300">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="text-sm uppercase tracking-wider text-stone-400">Date de naissance</span>
                  </div>
                  <p className="mt-2 text-lg text-amber-100">
                    {teckel.birth_date
                      ? format(new Date(teckel.birth_date), 'd MMMM yyyy', { locale: fr })
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

