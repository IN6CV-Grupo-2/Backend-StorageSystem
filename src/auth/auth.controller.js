import User from "../users/user.model.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generate-JWT.js";

export const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    const salt = bcryptjs.genSaltSync();
    const encryptedPassword = bcryptjs.hashSync(password, salt);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role: role || 'EMPLOY'
    });

    return res.status(201).json({
      msg: "Usuario registrado correctamente",
      userDetails: {
        user: user.username,
        email: user.email,
        role: user.role
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("No se pudo registrar el usuario");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).send("Credenciales incorrectas: correo no registrado");

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) return res.status(400).send("Credenciales incorrectas: contraseña inválida");

    const token = await generarJWT(user.id, user.email, user.role);

    res.status(200).json({
      msg: "Login exitoso",
      userDetails: {
        uid: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        token: token
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error interno. Contacte al administrador.");
  }
};
