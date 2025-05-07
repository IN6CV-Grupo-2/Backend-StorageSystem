import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory,deleteCategory} from './category.controller.js';
import {validarRol} from "../middlewares/validar-rol.js"
import {validateJWT} from "../middlewares/validar-jwt.js"
import { validarCategoria, validarEliminarCategoria } from '../middlewares/category-validator.js';

const router = Router();

router.post(
    '/save', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    validarCategoria, 
    createCategory
); 
router.put(
    '/update/:id', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    updateCategory
); 
router.delete(
    '/delete/:id', 
    validateJWT, 
    validarRol('ADMIN_ROLE'), 
    validarEliminarCategoria, 
    deleteCategory
); 
router.get(
    '/', 
    validateJWT, 
    getCategories
); 
router.get(
    '/search/:id', 
    validateJWT, 
    getCategoryById
);

export default router;
