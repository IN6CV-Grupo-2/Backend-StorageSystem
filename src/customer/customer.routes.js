import { Router } from "express";
import { validarRol } from "../middlewares/validar-rol.js";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { saveCustomer, getCustomerById, getCustomers, updateCustomer, deleteCustomer } from "./customer.controller.js";
import { canGetCustomers, customerNotFound } from "../middlewares/validate-cutomer.js";

const router = Router();

router.post(
    '/save', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    saveCustomer
);
router.get(
    '/', 
    validateJWT, 
    canGetCustomers, 
    getCustomers
);
router.get(
    '/search/:id', 
    validateJWT, 
    canGetCustomers, 
    getCustomerById
);
router.put(
    '/update/:id', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    customerNotFound, 
    updateCustomer
);
router.delete(
    '/delete/:id', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    customerNotFound, 
    deleteCustomer
);

export default router;