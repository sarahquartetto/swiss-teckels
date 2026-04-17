import { connectDb } from '../src/lib/db.js';
import { Teckel } from '../src/models/Teckel.js';

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

const NAME_POOL = [
  "Max", "Luna", "Bella", "Charlie", "Sophie", "Oscar", "Milo", "Nala", "Loki", "Ruby",
  "Simba", "Charly", "Nina", "Pablo", "Maya", "Leo", "Iris", "Zoé", "Rocky", "Tina",
  "Jack", "Jade", "Noah", "Olive", "Toby", "Sky", "Poppy", "Rex", "Daisy", "Gus",
  "Moka", "Pluto", "Kira", "Hugo", "Minnie", "Pepper", "Sasha", "Nova", "Lola", "Paco",
  "Oreo", "Cookie", "Lucky", "Joy", "Chips", "Pistache", "Cannelle", "Némo", "Léon", "Ulysse",
  "Mia", "Arya", "Olga", "Lou", "Marius", "Gaston", "Suzie", "Vicky", "Téo", "Nino",
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

async function main() {
  await connectDb();

  const rng = mulberry32(20260414);

  // We identify generated teckels by the old pattern: "<name> <4 digits>"
  const cursor = Teckel.find({ name: { $regex: / \d{4}$/ } });
  const docs = await cursor.lean();

  if (docs.length === 0) {
    console.log('No generated teckels found to update.');
    process.exit(0);
  }

  // Update in bulk
  const ops = docs.map((d) => ({
    updateOne: {
      filter: { _id: d._id },
      update: {
        $set: {
          name: pick(rng, NAME_POOL),
          photo_url: pick(rng, PHOTO_URLS),
        },
      },
    },
  }));

  const result = await Teckel.bulkWrite(ops);
  console.log(`Updated ${result.modifiedCount} teckels (names/photos).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

