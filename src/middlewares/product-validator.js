import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';

export const validarProducto = [
  check('name', 'El nombre del producto es obligatorio').notEmpty(),
  check('category', 'La categoría es obligatoria').notEmpty(),
  check('stock', 'El stock debe ser un número entero positivo').isInt({ min: 0 }),
  check('provider', 'El proveedor es obligatorio').notEmpty(),
  check('entryDate', 'La fecha de entrada es obligatoria').isISO8601(),
  validarCampos
];

export const validarEdicionProducto = [
  check('name', 'El nombre del producto no puede estar vacío').optional().notEmpty(),
  check('stock', 'El stock debe ser un número entero positivo').optional().isInt({ min: 0 }),
  check('category').optional().notEmpty(),
  validarCampos
];

export const validarEliminarProducto = [
  check('confirm', 'Se requiere confirmación para eliminar').equals('true'),
  validarCampos
];
