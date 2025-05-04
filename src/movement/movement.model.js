import {Schema, model} from 'mongoose';

const MovementSchema = Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['entrada', 'salida'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String // para salidas (por ejemplo: "venta", "donación", etc.)
  },
  destination: {
    type: String // para salidas (cliente, área, etc.)
  }
});

MovementSchema.methods.toJSON = function() {
  const { __v, _id, ...movement } = this.toObject();
  movement.uid = _id;
  return movement;
};

export default model('Movement', MovementSchema);
