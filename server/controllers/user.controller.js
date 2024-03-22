import User from "../models/User.js";
import bcrypt from "bcrypt";
import { transporter } from "../libs/nodemailer.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, images } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: passwordHash,
      images: images,
    });

    if (password !== confirmPassword)
      return res.send("Las contraseñas deben coincidir");
    const userCreated = await newUser.save();

    const sendEmailWelcome = `
    <h1 style="text-align: center; padding: 20px; background-color: #D1272E; color: white; text-align: center; font-size: 30px;">¡BIENVENID@ A PIXME!</h1>
    <table>
      <tr>
        <td>
          <p style="padding: 0 40px; color: black;">Estamos encantados de tenerte como parte de nuestra comunidad. Tu cuenta ha sido creada con éxito. </p>
          <p style="padding: 5px 40px; color: black;">Atentamente, <br>
          <span style="font-weight: bold;">El Equipo de PixMe</span> </p>
        </td>
      </tr>
    </table>`;
    const info = await transporter.sendMail({
      from: '"PixMe Welcome" <pixmerecovery@gmail.com>',
      to: `${userCreated.email}`,
      subject: "Welcome",
      html: sendEmailWelcome,
    });

    return res.send(userCreated);
  } catch (error) {
    return res.send("Correo ya registrado");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.find({ email }).populate("images").exec();
    if (userFound.length === 0) return res.send("Not found");
    const isMatch = await bcrypt.compare(password, userFound[0].password);
    if (!isMatch) return res.send("Not found");
    return res.send(userFound);
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.find().populate("images").exec();
    if (user.length > 0) {
      return res.send(user);
    } else {
      return res.send("Not found");
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    let Password = null;
    let userUpdate = null;
    if (password) {
      Password = await bcrypt.hash(password, 10);
      userUpdate = {
        name: name,
        password: Password,
      };
    } else {
      userUpdate = { name: name };
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      userUpdate,
      {
        new: true,
      }
    );
    return res.send(updatedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userDeleted = await User.findByIdAndDelete(req.params.id);
    if (!userDeleted) return res.send(500);
    return res.send(userDeleted);
  } catch (error) {
    console.log(error);
  }
};

export const getUserRecovery = async (req, res) => {
  const code = Math.floor(10000 + Math.random() * 90000);
  try {
    const { email } = req.body;
    const userEmail = await User.findOne({ email: email });
    const sendEmail = `
    <table>
      <tr>
        <td>
          <h1 style="padding: 20px; background-color: #D1272E; color: white; text-align: center; font-size: 30px;">PIXME</h1>
        </td>
      </tr>
      <tr>
        <td>
          <h3 style="padding: 0 40px; color: black;">Hola ${userEmail.name},</h3>
        </td>
      </tr>
      <tr>
        <td>
          <p style="padding: 0 40px; color: black;">Hemos recibido una solicitud para usar esta dirección de correo electrónico como método de recuperación de contraseña para la cuenta asociada a este correo. </p>
        </td>
      </tr>
      <tr>
        <td>
          <h1 style="padding: 0 40px; text-align: center; font-size: 30px;">${code}</h1>
        </td>
      </tr>
      <tr>
        <td>
          <p style="padding: 0 40px; color: black;">Deberás ingresar este código en la página habilitada específicamente para esta función. Una vez que ingreses el código correctamente, podrás continuar con el proceso de recuperación de tu cuenta. </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="padding: 0 40px; color: black;">En caso de que no hayas solicitado este código o no reconozcas esta solicitud, por favor ignora este mensaje por motivos de seguridad. </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="padding: 5px 40px; color: black;">Atentamente, <br>
          <span style="font-weight: bold;">El Equipo de PixMe</span> </p>
        </td>
      </tr>
    </table>
    `;
    const info = await transporter.sendMail({
      from: '"PixMe Recovery" <pixmerecovery@gmail.com>',
      to: `${userEmail.email}`,
      subject: "Recovery Password",
      html: sendEmail,
    });
    return res.send({ code: code, user: userEmail });
  } catch (error) {
    return res.send("Correo no existente");
  }
};

export const RecoveryPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.send("Not found");
    const passwordHash = await bcrypt.hash(password, 10);
    const newPassword = {
      password: passwordHash,
    };
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      newPassword,
      {
        new: true,
      }
    );
    return res.send(updatedUser);
  } catch (error) {
    console.log(error);
  }
};
