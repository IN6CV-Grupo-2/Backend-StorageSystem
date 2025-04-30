import { Router } from "express";
import { validarRol } from "../middlewares/validar-rol.js";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { saveCustomer, getCustomerById, getCustomers, updateCustomer, deleteCustomer } from "./customer.controller.js";
import { canGetCustomers, customerNotFound } from "../middlewares/validate-cutomer.js";

const router = Router();

router.post('/', validateJWT, validarRol('ADMIN'), saveCustomer);
router.get('/', validateJWT, validarRol('ADMIN'), canGetCustomers, getCustomers);
router.get('/:id', validateJWT, validarRol('ADMIN'), canGetCustomers, getCustomerById);
router.put('/:id', validateJWT, validarRol('ADMIN'), customerNotFound, updateCustomer);
router.delete('/:id', validateJWT, validarRol('ADMIN'), customerNotFound, deleteCustomer);

export default router;