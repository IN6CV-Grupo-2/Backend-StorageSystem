import User from "../users/user.model.js";
import { hash, verify } from "argon2";
import { generateJWT } from "../helpers/generate-JWT.js";

export const register = async (req, res) => {
  try {
      const data = req.body; 

      const encryptedPassword = await hash(data.password);

      const user = await User.create({
            username: data.username,
          email: data.email,
          password: encryptedPassword,
          role: data.role || "USER_ROLE", //cambiar cuando se cree el administrador por default
      });

      res.status(201).json({
          message: "User successfully registered.",
          userDetails: {
              email: user.email,
          },
      });
  } catch (error) {
      console.error(error);
      return res.status(400).json({
          message: "An error occurred during user registration.",
          error: error.message,
      });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({
              message: "User not found.",
          });
      }

      if (!user.estado) {
          return res.status(400).json({
              message: "This account is inactive.",
          });
      }

      const validPassword = await verify(user.password, password);
      if (!validPassword) {
          return res.status(400).json({
              message: "Incorrect password.",
          });
      }

      const token = await generateJWT(user.id);

      return res.status(200).json({
          message: "Login successful.",
          userDetails: {
              email: user.email,
              token: token,
          },
      });
  } catch (error) {
      console.error(error);
      return res.status(400).json({
          message: "An error occurred during login.",
          error: error.message,
      });
  }
};
