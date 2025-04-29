import { check, body } from "express-validator";
import { existeEmail } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";

export const loginValidator = [
  check('email', 'Este no es un correo válido').isEmail(),
  check('password', 'El password es obligatorio').notEmpty(),
  validarCampos
];

export const registerValidator = [
  check('email', 'Este no es un correo válido').isEmail(),
  check('email').custom(existeEmail),
  check('username', 'El username es obligatorio').notEmpty(),
  check('password', 'El password es obligatorio').notEmpty(),
  check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
  body('role').custom((value) => {
    if (value && value.toUpperCase() === 'ADMIN') {
      throw new Error('No está permitido registrar usuarios con rol ADMIN');
    }
    return true;
  }),
  validarCampos
];
