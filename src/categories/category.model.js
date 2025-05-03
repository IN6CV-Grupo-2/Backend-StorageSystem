import {Schema, model} from 'mongoose';

const CategorySchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
});

CategorySchema.methods.toJSON = function() {
  const { __v, _id, ...category } = this.toObject();
  category.uid = _id;
  return category;
};

export default model('Category', CategorySchema);
