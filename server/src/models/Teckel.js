import mongoose from 'mongoose';

const TeckelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    canton: { type: String, required: true, trim: true },
    birth_date: { type: Date, required: false },
    coat_type: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    color: { type: String, required: false, trim: true },
    photo_url: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

export const Teckel = mongoose.model('Teckel', TeckelSchema);

