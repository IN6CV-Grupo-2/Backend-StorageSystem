import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';

export const validarCategoria = [
  check('name', 'El nombre de la categoría es obligatorio').notEmpty(),
  validarCampos
];

export const validarEdicionCategoria = [
  check('name', 'El nombre de la categoría no puede estar vacío').optional().notEmpty(),
  validarCampos
];

export const validarEliminarCategoria = [
  check('confirm', 'Se requiere confirmación para eliminar').equals('true'),
  validarCampos
];

