import React from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CANTONS = [
  "Argovie", "Appenzell Rhodes-Extérieures", "Appenzell Rhodes-Intérieures",
  "Bâle-Campagne", "Bâle-Ville", "Berne", "Fribourg", "Genève", "Glaris",
  "Grisons", "Jura", "Lucerne", "Neuchâtel", "Nidwald", "Obwald", "Saint-Gall",
  "Schaffhouse", "Schwyz", "Soleure", "Thurgovie", "Tessin", "Uri", "Valais",
  "Vaud", "Zoug", "Zurich"
];

const COAT_TYPES = ["Poil long", "Poil ras", "Poil dur"];
const GENDERS = ["Mâle", "Femelle"];

async function createTeckel(payload) {
  const res = await fetch('/api/teckels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `API error (${res.status})`);
  }
  return await res.json();
}

export default function AddTeckelModal({ open, onClose }) {
  const queryClient = useQueryClient();

  const [form, setForm] = React.useState({
    name: '',
    canton: '',
    birth_date: '',
    coat_type: '',
    gender: '',
    color: '',
    photo_url: '',
  });

  React.useEffect(() => {
    if (!open) return;
    setForm({
      name: '',
      canton: '',
      birth_date: '',
      coat_type: '',
      gender: '',
      color: '',
      photo_url: '',
    });
  }, [open]);

  const mutation = useMutation({
    mutationFn: createTeckel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teckels'] });
      onClose?.();
    },
  });

  if (!open) return null;

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[10000]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !mutation.isPending && onClose?.()}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-3xl border border-amber-900/30 bg-gradient-to-br from-stone-900/95 to-stone-950/95 shadow-2xl">
          <div className="flex items-center justify-between px-6 py-5 border-b border-amber-900/20">
            <div>
              <h2 className="text-lg font-semibold text-amber-100">Ajouter un teckel</h2>
              <p className="text-sm text-stone-400">Visible publiquement sur le site.</p>
            </div>
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-stone-800/60 text-stone-300"
              onClick={() => !mutation.isPending && onClose?.()}
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            className="px-6 py-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate({
                name: form.name,
                canton: form.canton,
                birth_date: form.birth_date || null,
                coat_type: form.coat_type,
                gender: form.gender,
                color: form.color || null,
                photo_url: form.photo_url || null,
              });
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider">Nom *</label>
                <Input
                  value={form.name}
                  onChange={update('name')}
                  className="bg-stone-900/60 border-amber-900/30 text-stone-200"
                  placeholder="Ex: Max"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider">Canton *</label>
                <select
                  value={form.canton}
                  onChange={update('canton')}
                  required
                  className="h-10 w-full rounded-md border border-amber-900/30 bg-stone-900/60 px-3 text-sm text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="" disabled>Sélectionner…</option>
                  {CANTONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider">Type de poil *</label>
                <select
                  value={form.coat_type}
                  onChange={update('coat_type')}
                  required
                  className="h-10 w-full rounded-md border border-amber-900/30 bg-stone-900/60 px-3 text-sm text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="" disabled>Sélectionner…</option>
                  {COAT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider">Genre *</label>
                <select
                  value={form.gender}
                  onChange={update('gender')}
                  required
                  className="h-10 w-full rounded-md border border-amber-900/30 bg-stone-900/60 px-3 text-sm text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="" disabled>Sélectionner…</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider">Date de naissance</label>
                <Input
                  type="date"
                  value={form.birth_date}
                  onChange={update('birth_date')}
                  className="bg-stone-900/60 border-amber-900/30 text-stone-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider">Robe</label>
                <Input
                  value={form.color}
                  onChange={update('color')}
                  className="bg-stone-900/60 border-amber-900/30 text-stone-200"
                  placeholder="Ex: Noir et feu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-stone-400 uppercase tracking-wider">Photo (URL)</label>
              <Input
                value={form.photo_url}
                onChange={update('photo_url')}
                className="bg-stone-900/60 border-amber-900/30 text-stone-200"
                placeholder="https://..."
              />
            </div>

            {mutation.isError && (
              <div className="rounded-2xl border border-red-900/30 bg-red-950/20 p-4 text-red-200 text-sm break-words">
                {String(mutation.error?.message || mutation.error)}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="bg-transparent border-amber-700/50 text-amber-300 hover:bg-amber-900/30"
                onClick={() => !mutation.isPending && onClose?.()}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="h-10 px-5 bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 hover:from-amber-600 hover:to-amber-800"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Ajout…' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

