import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { connectDb } from '../src/lib/db.js';
import { Teckel } from '../src/models/Teckel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function randomBirthDate(rng) {
  const year = 2016 + Math.floor(rng() * 9); // 2016-2024
  const month = 1 + Math.floor(rng() * 12);
  const day = 1 + Math.floor(rng() * 28);
  return new Date(`${year}-${pad2(month)}-${pad2(day)}`);
}

async function main() {
  await connectDb();

  const jsonPath = path.resolve(__dirname, '../../src/data/teckels.json');
  const raw = await fs.readFile(jsonPath, 'utf8');
  const baseTeckels = JSON.parse(raw);

  // If you already added dogs manually, we *fill up* the DB to 100 instead of deleting everything.
  const targetTotal = Number(process.env.SEED_TARGET_TOTAL || 100);
  const existingCount = await Teckel.countDocuments();

  const CANTONS = [
    "Argovie", "Appenzell Rhodes-Extérieures", "Appenzell Rhodes-Intérieures",
    "Bâle-Campagne", "Bâle-Ville", "Berne", "Fribourg", "Genève", "Glaris",
    "Grisons", "Jura", "Lucerne", "Neuchâtel", "Nidwald", "Obwald", "Saint-Gall",
    "Schaffhouse", "Schwyz", "Soleure", "Thurgovie", "Tessin", "Uri", "Valais",
    "Vaud", "Zoug", "Zurich"
  ];

  const COAT_TYPES = ["Poil long", "Poil ras", "Poil dur"];
  const GENDERS = ["Mâle", "Femelle"];
  const COLORS = [
    "Rouge",
    "Noir et feu",
    "Chocolat et feu",
    "Crème",
    "Sanglier",
    "Bringé",
    "Arlequin",
  ];

  const PHOTO_URLS = [
    "https://images.unsplash.com/photo-1604443586815-3272e18c124f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1520087619250-584c0cbd35e8?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1555676407-97678b2fb648?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1618265341355-d0e2d1fdf26b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1749823029771-cb83c07b1daf?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1697939829612-f2ee98421a53?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1746034137968-d0c21ec8111e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1756589046754-f8a2358bac9a?auto=format&fit=crop&w=1600&q=80",
  ];

  // 1) Ensure at least the original JSON set exists (insert missing by name)
  const existingNames = new Set(
    (await Teckel.find({}, { name: 1 }).lean()).map((t) => String(t.name).toLowerCase())
  );

  const toInsertFromJson = baseTeckels
    .filter((t) => t?.name && !existingNames.has(String(t.name).toLowerCase()))
    .map((t) => ({
      name: t.name,
      canton: t.canton,
      birth_date: t.birth_date ? new Date(t.birth_date) : undefined,
      coat_type: t.coat_type,
      gender: t.gender,
      color: t.color,
      photo_url: t.photo_url,
    }));

  if (toInsertFromJson.length > 0) {
    await Teckel.insertMany(toInsertFromJson);
  }

  // 2) Fill up to targetTotal with generated teckels
  const countAfterBase = await Teckel.countDocuments();
  const missing = Math.max(0, targetTotal - countAfterBase);

  if (missing > 0) {
    const rng = mulberry32(1337);

    const NAME_POOL = [
      "Max", "Luna", "Bella", "Charlie", "Sophie", "Oscar", "Milo", "Nala", "Loki", "Ruby",
      "Simba", "Charly", "Nina", "Pablo", "Maya", "Leo", "Iris", "Zoé", "Rocky", "Tina",
      "Jack", "Jade", "Noah", "Olive", "Toby", "Sky", "Poppy", "Rex", "Daisy", "Gus",
      "Moka", "Pluto", "Kira", "Hugo", "Minnie", "Pepper", "Sasha", "Nova", "Lola", "Paco",
      "Oreo", "Cookie", "Lucky", "Joy", "Chips", "Pistache", "Cannelle", "Némo", "Léon", "Ulysse",
      "Mia", "Arya", "Olga", "Lou", "Marius", "Gaston", "Suzie", "Vicky", "Téo", "Nino",
    ];

    const generated = [];
    const used = new Set(existingNames);
    let i = 0;

    while (generated.length < missing && i < missing * 20) {
      i++;
      const name = pick(rng, NAME_POOL);
      const key = name.toLowerCase();
      // Allow duplicate names (realistic); uniqueness is the MongoDB id.

      generated.push({
        name,
        canton: pick(rng, CANTONS),
        birth_date: randomBirthDate(rng),
        coat_type: pick(rng, COAT_TYPES),
        gender: pick(rng, GENDERS),
        color: pick(rng, COLORS),
        photo_url: pick(rng, PHOTO_URLS),
      });
    }

    await Teckel.insertMany(generated);
  }

  const finalCount = await Teckel.countDocuments();
  console.log(
    `Seed done. Existing before: ${existingCount}. Target: ${targetTotal}. Final: ${finalCount}. Added: ${finalCount - existingCount}.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

