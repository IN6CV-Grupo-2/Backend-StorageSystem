import Category from './category.model.js';

export const createCategory = async (req, res) => {
  try {

    const data = req.body;

    const category = await Category.create({
        name: data.name,
        description: data.description,
    });

    res.status(201).json({
       msg: 'Category added successfully.', 
       category
    });

  } catch (e) {
    res.status(500).json({
      msg: 'Error adding category.', 
      error: e.message
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      msg:'Categories retrieved successfully.',
      categories
    });

  } catch (e) {
    res.status(500).json({
       msg: 'Error retrieving categories.',
       error: e.message
      });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    res.status(200).json({
      msg: 'Category retrieved successfully.',
      category
    });
  } catch (e) {
    res.status(500).json({
      msg: 'Error retrieving category.',
      error: e.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({ 
      msg: 'Category updated successfully.',
      category 
    });
    
  } catch (e) {
    res.status(500).json({
      msg: 'Error updating category.',
      error: e.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    res.status(200).json({
      msg: 'Category deleted successfully.',
      category
    });

  } catch (e) {
    res.status(500).json({
      msg: 'Error deleting category.',
      error: e.message
    });
  }
};

