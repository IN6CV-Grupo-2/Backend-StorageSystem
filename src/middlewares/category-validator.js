import { check } from 'express-validator';
import { validateFields } from '../middlewares/validar-campos.js';
import Category from '../categories/category.model.js';

export const validarCategoria = [
  check('name', 'El nombre de la categoría es obligatorio').notEmpty(),
  validateFields
];


export const validarEliminarCategoria = async (req, res, next) => {
  const { id } = req.params;
  const { confirm } = req.body;
      if (confirm !== 'true') {
        return res.status(400).json({
          msg: 'Confirmation required to delete category.'
        });
      }
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({
          msg: 'Category not found.'
        });
      }

  next();
}

