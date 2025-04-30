import { saveProvider, getProviders, getProviderById, deleteProvider, updateProvider } from "./provider.controller.js";
import { canSaveProvider,canGetProviders, canUpdateProvider, canDeleteProvider } from "../middlewares/vlidate-provider.js";
import { Router } from "express";
import { validarRol } from "../middlewares/validar-rol.js";
import { validateJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    '/save', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    canSaveProvider, 
    saveProvider
);
router.get(
    '/', 
    validateJWT, 
    canGetProviders, 
    getProviders
);
router.get(
    '/search/:id', 
    validateJWT, 
    canGetProviders, 
    getProviderById
);
router.put(
    '/update/:id', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    canUpdateProvider, 
    updateProvider
);
router.delete(
    '/delete/:id', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    canDeleteProvider, 
    deleteProvider
);

export default router;  


