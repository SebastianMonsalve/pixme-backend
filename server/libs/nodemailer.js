import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "pixmerecovery@gmail.com",
    pass: "dtfa gdal kefh aayh",
  },
});

transporter.verify().then(() => {
  console.log("Connect to NodeMailer");
});
