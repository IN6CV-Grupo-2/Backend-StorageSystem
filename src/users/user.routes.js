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

router.put(
    "/profile",
    validateJWT,
    updateProfile // Actualizar el perfil del usuario autenticado
)

router.get(
    "/profile",
    [
        validateJWT, // Verificar que el usuario esté autenticado
    ],
    async (req, res) => {
        try {
            const { id } = req.user; // Obtener el ID del usuario autenticado
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ msg: "Usuario no encontrado." });
            }

            res.status(200).json({
                msg: "Perfil obtenido correctamente.",
                user,
            });
        } catch (error) {
            console.error("Error en GET /users/profile:", error.message);
            res.status(500).json({
                msg: "Error al obtener el perfil.",
                error: error.message,
            });
        }
    }
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