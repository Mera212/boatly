import mongoose from 'mongoose';

const MarinaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a marina name'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Please provide a marina address'],
    trim: true,
  },
  landlordId: {
    type: String,
    required: [true, 'Landlord ID is required'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Marina || mongoose.model('Marina', MarinaSchema);