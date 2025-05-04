import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { validateFields } from "../middlewares/validar-campos.js"
import { existentUserById } from "../helpers/db-validator.js"
import { canUpdateUser, canDeleteUser } from "../middlewares/validate-user.js"
import { getUsers,updateUser,deleteUser } from "./user.controller.js";


const router = Router()

router.get(
    "/",
    getUsers
)

router.put(
    "/update/:id",
    [
        validateJWT,
        check("id", "Ingresa un id valido para mongo").isMongoId(),
        check("id").custom(existentUserById),
        canUpdateUser,
        validateFields
    ],
    updateUser
)

router.delete(
    "/delete/:id",
    [
        validateJWT,
        check("id", "Ingresa un id valido para mongo").isMongoId(),
        check("id").custom(existentUserById),
        canDeleteUser,
        validateFields
    ],
    deleteUser
)

export default router