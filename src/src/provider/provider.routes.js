import { saveProvider, getProviders, getProviderById, deleteProvider, updateProvider } from "./provider.controller";
import { canSaveProvider,canGetProviders, canUpdateProvider, canDeleteProvider } from "../middlewares/vlidate-provider";
import { Router } from "express";
import { validarRol } from "../middlewares/validar-rol";
import { validateJWT } from "../middlewares/validar-jwt";

const router = Router();

router.post('/', validateJWT, validarRol('ADMIN'), canSaveProvider, saveProvider);
router.get('/', validateJWT, validarRol('ADMIN'), canGetProviders, getProviders);
router.get('/:id', validateJWT, validarRol('ADMIN'), canGetProviders, getProviderById);
router.put('/:id', validateJWT, validarRol('ADMIN'), canUpdateProvider, updateProvider);
router.delete('/:id', validateJWT, validarRol('ADMIN'), canDeleteProvider, deleteProvider);

export default router;  


