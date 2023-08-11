const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, content) => {
  try {
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "fjintha@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: "fjintha@gmail.com",
      to: email,
      subject: subject,
      text: JSON.stringify(content),
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error while sending email: Internal Server Error:  ", error);
    return false;
  }
};
