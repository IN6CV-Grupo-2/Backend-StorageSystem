import { Router } from 'express';
import { createProduct, getProducts,  getProductById, updateProduct,deleteProduct,  getInventoryReport, getMovementReport, getProductStatistics} from './product.controller.js';
import { validarProducto, validarEdicionProducto, validarEliminarProducto } from '../middlewares/product-validator.js';
import { canCreateProduct, canUpdateProduct, canDeleteProduct } from '../middlewares/validate-product.js';
import {validarRol} from "../middlewares/validar-rol.js"
import {validateJWT} from "../middlewares/validar-jwt.js"

const router = Router();

router.post(
  "/",
  validateJWT,
  validarRol("ADMIN_ROLE"),
  validarProducto,
  canCreateProduct,
  createProduct
);
router.put(
  "/:id",
  validateJWT,
  validarRol("ADMIN"),
  validarEdicionProducto,
canUpdateProduct,
  updateProduct
);
router.delete(
  "/:id",
  validateJWT,
  validarRol("ADMIN"),
  validarEliminarProducto,
  canDeleteProduct,
  deleteProduct
);
router.get(
    "/", 
    validateJWT, 
    getProducts
);
router.get(
    "/:id", 
    validateJWT, 
    getProductById
);
router.get('/report/inventory', validateJWT, validarRol('ADMIN'), getInventoryReport);
router.get('/report/movements', validateJWT, validarRol('ADMIN'), getMovementReport);
router.get('/report/statistics', validateJWT, validarRol('ADMIN'), getProductStatistics);
     

export default router;
