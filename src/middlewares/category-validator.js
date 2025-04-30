import { check } from 'express-validator';
import { validateFields } from '../middlewares/validar-campos.js';

export const validarCategoria = [
  check('name', 'El nombre de la categoría es obligatorio').notEmpty(),
  validateFields
];

export const validarEdicionCategoria = [
  check('name', 'El nombre de la categoría no puede estar vacío').optional().notEmpty(),
  validateFields
];

export const validarEliminarCategoria = [
  check('confirm', 'Se requiere confirmación para eliminar').equals('true'),
  validateFields
];

