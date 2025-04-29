import { Router } from "express";
import { validarRol } from "../middlewares/validar-rol";
import { validateJWT } from "../middlewares/validar-jwt";
import { saveCustomer, getCustomerById, getCustomers, updateCustomer, deleteCustomer } from "../customer/customer.controller";
import { canGetCustomers, customerNotFound } from "../middlewares/validate-cutomer";

const router = Router();

router.post('/', validateJWT, validarRol('ADMIN'), saveCustomer);
router.get('/', validateJWT, validarRol('ADMIN'), canGetCustomers, getCustomers);
router.get('/:id', validateJWT, validarRol('ADMIN'), canGetCustomers, getCustomerById);
router.put('/:id', validateJWT, validarRol('ADMIN'), customerNotFound, updateCustomer);
router.delete('/:id', validateJWT, validarRol('ADMIN'), customerNotFound, deleteCustomer);

export default router;