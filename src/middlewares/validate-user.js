import { hash } from "argon2";
import User from "../users/user.model.js"

export const canUpdateUser = async (req, res, next) => {
    const { id } = req.params;
    const {password,...data} = req.body
    if (req.user.role === 'USER_ROLE' && id !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You are not allowed to perform this action."
        });
    }

    const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                })
            }

    if (password) {
        data.password = await hash(password)
    }

    next(); 
};

export const canDeleteUser = async (req, res, next) => {
    const {id} = req.params
    const {confirm} = req.query

    if (!confirm) {
        return res.status(400).json({
            message: "Are you sure you want to delete your account? Send a 'true' value to confirm."
        })
    }

    const user = await User.findById(id)
    
            if (!user) {
                return res.status(404).json({
                    ss:false,
                    message: "The user you want to delete does not exist."
                })
            }

    next(); 
};