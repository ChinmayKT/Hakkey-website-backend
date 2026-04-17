import mongoose from 'mongoose';

const earlyAccessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: 'Phone must be exactly 10 digits',
      },
    },
    type: {
      type: String,
      enum: ['user', 'chef'],
      default: 'user',
    },
  },
  { timestamps: true },
);

const EarlyAccess = mongoose.model('EarlyAccess', earlyAccessSchema);
export default EarlyAccess;
