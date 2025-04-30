import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
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

export default mongoose.model('Category', CategorySchema);
