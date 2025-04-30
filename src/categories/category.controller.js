import Category from './category.model.js';

// Crear nueva categoría
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validar duplicados
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ msg: 'La categoría ya existe' });

    const category = await Category.create({ name, description });
    res.status(201).json({ msg: 'Categoría creada', category });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error al crear categoría' });
  }
};

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener categorías' });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Categoría no encontrada' });
    res.status(200).json(category);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener categoría' });
  }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Categoría no encontrada' });
    res.status(200).json({ msg: 'Categoría actualizada', category: updated });
  } catch (e) {
    res.status(500).json({ msg: 'Error al actualizar categoría' });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
  const { confirm } = req.query;

  if (confirm !== 'true') {
    return res.status(400).json({
      msg: 'Confirmación requerida para eliminar la categoría. Agrega ?confirm=true a la URL.',
    });
  }

  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Categoría no encontrada' });

    res.status(200).json({ msg: 'Categoría eliminada correctamente' });
  } catch (e) {
    res.status(500).json({ msg: 'Error al eliminar categoría' });
  }
};

