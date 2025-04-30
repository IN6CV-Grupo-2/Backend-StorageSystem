import { Router } from 'express';
import { createMovement,getMovements, getMovementById, updateMovement, deleteMovement } from './movement.controller.js';
import { validarMovimiento, validarEdicionMovimiento, validarEliminarMovimiento } from '../middlewares/movement-validator.js';
import {validarRol} from "../middlewares/validar-rol.js"
import {validateJWT} from "../middlewares/validar-jwt.js"
const router = Router();

router.post('/', validateJWT, validarRol('EMPLOY'), validarMovimiento, createMovement); 
router.put('/:id', validateJWT, validarRol('EMPLOY'), validarEdicionMovimiento, updateMovement); 
router.delete('/:id', validateJWT, validarRol('EMPLOY'), validarEliminarMovimiento, deleteMovement); 
router.get('/', validateJWT, getMovements); 
router.get('/:id', validateJWT, getMovementById); 

export default router;
