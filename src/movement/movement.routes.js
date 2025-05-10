import { Router } from 'express';
import { createMovement,getMovements, getMovementById, updateMovement, deleteMovement } from './movement.controller.js';
import { validarMovimiento, validarEdicionMovimiento, validarEliminarMovimiento } from '../middlewares/movement-validator.js';
import { canCreateMovement, canUpdateMovement, canDeleteMovement } from '../middlewares/validate-movement.js';
import {validarRol} from "../middlewares/validar-rol.js"
import {validateJWT} from "../middlewares/validar-jwt.js"

const router = Router();

router.post(
  "/",
  validateJWT,
  canCreateMovement,
  createMovement
);
router.put(
  "/:id",
  validateJWT,
  validarRol("ADMIN_ROLE"),
  canUpdateMovement,
  updateMovement
);
router.delete(
  "/:id",
  validateJWT,
  validarRol("ADMIN_ROLE"),
  canDeleteMovement,
  deleteMovement
);
router.get(
    "/",
    validateJWT,
    getMovements
);
router.get(
    "/:id", 
    validateJWT, 
    getMovementById
); 

export default router;
