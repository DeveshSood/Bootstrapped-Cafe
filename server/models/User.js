const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' }, // Home, Work, Other
  line1: { type: String, required: true },
  line2: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const cartItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: { type: String, default: '' },
  password: { type: String, required: true, minlength: 6, select: false },
  role: {
    type: String,
    enum: ['user', 'restaurant', 'admin'],
    default: 'user',
  },
  addresses: [addressSchema],
  cart: [cartItemSchema],
}, { timestamps: true });

// Hash password before saving (only if modified)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Get the default address (or first one, or null)
userSchema.methods.getDefaultAddress = function () {
  if (!this.addresses.length) return null;
  const def = this.addresses.find(a => a.isDefault);
  return def || this.addresses[0];
};

module.exports = mongoose.model('User', userSchema);
