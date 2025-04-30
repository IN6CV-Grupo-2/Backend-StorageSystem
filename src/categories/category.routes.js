import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory,deleteCategory} from './category.controller.js';
import {validarRol} from "../middlewares/validar-rol.js"
import {validateJWT} from "../middlewares/validar-jwt.js"
import { validarCategoria, validarEdicionCategoria, validarEliminarCategoria } from '../middlewares/category-validator.js';
const router = Router();

router.post('/', validateJWT, validarRol('ADMIN'), validarCategoria, createCategory); 
router.put('/:id', validateJWT, validarRol('ADMIN'), validarEdicionCategoria, updateCategory); 
router.delete('/:id', validateJWT, validarRol('ADMIN'), validarEliminarCategoria, deleteCategory); 
router.get('/', validateJWT, getCategories); 
router.get('/:id', validateJWT, getCategoryById);

export default router;
