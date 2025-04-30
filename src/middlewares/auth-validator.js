import { check } from "express-validator";
import { isValidEmail } from "../helpers/db-validator.js";
import { validateFields } from "../middlewares/validar-campos.js";

export const loginValidator = [
  check('email', 'Este no es un correo válido').isEmail(),
  check('password', 'El password es obligatorio').notEmpty(),
  validateFields
];

export const registerValidator = [
  check('email', 'Este no es un correo válido').isEmail(),
  check('email').custom(isValidEmail),
  check('username', 'El username es obligatorio').notEmpty(),
  check('password', 'El password es obligatorio').notEmpty(),
  check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validateFields
];
