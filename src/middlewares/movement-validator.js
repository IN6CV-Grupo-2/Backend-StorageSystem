import { check } from 'express-validator';
import { validateFields } from '../middlewares/validar-campos.js';

export const validarMovimiento = [
  check('product', 'El ID del producto es obligatorio').notEmpty(),
  check('type', 'El tipo de movimiento debe ser ENTRY o EXIT').isIn(['ENTRY', 'EXIT']),
  check('quantity', 'La cantidad debe ser un número positivo').isInt({ min: 1 }),
  check('date', 'La fecha es obligatoria y debe ser válida').isISO8601(),
  check('employee', 'El ID del empleado es obligatorio').notEmpty(),
  check('destination', 'El destino es requerido en salidas').if(check('type').equals('EXIT')).notEmpty(),
  check('reason', 'El motivo es requerido en salidas').if(check('type').equals('EXIT')).notEmpty(),
  validateFields
];

export const validarEdicionMovimiento = [
  check('quantity', 'La cantidad debe ser un número positivo').optional().isInt({ min: 1 }),
  check('date', 'La fecha debe ser válida').optional().isISO8601(),
  check('destination', 'El destino es requerido en salidas').if(check('type').equals('EXIT')).optional().notEmpty(),
  check('reason', 'El motivo es requerido en salidas').if(check('type').equals('EXIT')).optional().notEmpty(),
  validateFields
];

export const validarEliminarMovimiento = [
  check('confirm', 'Se requiere confirmación para eliminar').equals('true'),
  validateFields
];
