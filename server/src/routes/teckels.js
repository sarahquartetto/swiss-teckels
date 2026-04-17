import express from 'express';
import { Teckel } from '../models/Teckel.js';

export const teckelsRouter = express.Router();

teckelsRouter.get('/', async (_req, res) => {
  const teckels = await Teckel.find().sort({ createdAt: -1 }).lean();
  res.json(
    teckels.map((t) => ({
      id: t._id.toString(),
      name: t.name,
      canton: t.canton,
      birth_date: t.birth_date ? t.birth_date.toISOString().slice(0, 10) : null,
      coat_type: t.coat_type,
      gender: t.gender,
      color: t.color ?? null,
      photo_url: t.photo_url ?? null,
    }))
  );
});

teckelsRouter.get('/:id', async (req, res) => {
  const teckel = await Teckel.findById(req.params.id).lean();
  if (!teckel) return res.status(404).json({ message: 'Not found' });

  res.json({
    id: teckel._id.toString(),
    name: teckel.name,
    canton: teckel.canton,
    birth_date: teckel.birth_date ? teckel.birth_date.toISOString().slice(0, 10) : null,
    coat_type: teckel.coat_type,
    gender: teckel.gender,
    color: teckel.color ?? null,
    photo_url: teckel.photo_url ?? null,
  });
});

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

teckelsRouter.post('/', async (req, res) => {
  const body = req.body ?? {};

  const payload = {
    name: isNonEmptyString(body.name) ? body.name.trim() : null,
    canton: isNonEmptyString(body.canton) ? body.canton.trim() : null,
    birth_date: body.birth_date ? new Date(body.birth_date) : null,
    coat_type: isNonEmptyString(body.coat_type) ? body.coat_type.trim() : null,
    gender: isNonEmptyString(body.gender) ? body.gender.trim() : null,
    color: isNonEmptyString(body.color) ? body.color.trim() : null,
    photo_url: isNonEmptyString(body.photo_url) ? body.photo_url.trim() : null,
  };

  if (!payload.name || !payload.canton || !payload.coat_type || !payload.gender) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (body.birth_date && Number.isNaN(payload.birth_date?.getTime?.())) {
    return res.status(400).json({ message: 'Invalid birth_date' });
  }

  const created = await Teckel.create({
    name: payload.name,
    canton: payload.canton,
    birth_date: body.birth_date ? payload.birth_date : undefined,
    coat_type: payload.coat_type,
    gender: payload.gender,
    color: payload.color ?? undefined,
    photo_url: payload.photo_url ?? undefined,
  });

  res.status(201).json({
    id: created._id.toString(),
    name: created.name,
    canton: created.canton,
    birth_date: created.birth_date ? created.birth_date.toISOString().slice(0, 10) : null,
    coat_type: created.coat_type,
    gender: created.gender,
    color: created.color ?? null,
    photo_url: created.photo_url ?? null,
  });
});

