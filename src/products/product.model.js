import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  entryDate: {
    type: Date,
    default: Date.now
  },
  expirationDate: {
    type: Date
  },
  stockAlertLevel: {
    type: Number,
    default: 10
  }
});

ProductSchema.methods.toJSON = function() {
  const { __v, _id, ...product } = this.toObject();
  product.uid = _id;
  return product;
};

export default mongoose.model('Product', ProductSchema);
