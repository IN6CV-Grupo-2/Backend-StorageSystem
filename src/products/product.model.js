import {Schema, model} from 'mongoose';

const ProductSchema = Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
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

export default model('Product', ProductSchema);
