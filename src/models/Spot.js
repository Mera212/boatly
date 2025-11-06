import mongoose from 'mongoose';

const SpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a spot name'],
    trim: true,
  },
  size: {
    type: String,
    required: [true, 'Please provide a spot size'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a spot price'],
    min: [0, 'Price cannot be negative'],
  },
  marinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marina',
    required: [true, 'Marina ID is required'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Spot || mongoose.model('Spot', SpotSchema);