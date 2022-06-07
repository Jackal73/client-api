const nodemailer = require("nodemailer");

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'dan.jones61@ethereal.email',
        pass: 'UA9xcUKBRtWFFCmjCm',
    },
});

const send = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send mail with defined transport object
      let result = await transporter.sendMail(info);

      console.log("Message sent: %s", result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      resolve(result);

    } catch (error) {
      console.log(error);
    }
  });
};

const emailProcessor = ({ email, pin, type, verificationLink= "" }) => {
  let info = "";
  switch (type) {
    case "request-new-password":
      info = {
        from: '"Tikkit Company" <i4ews3i3bmx2jywn@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password Reset PIN", // Subject line
        text: "Here is your Password Reset PIN: " + pin + " This PIN will expire in 1 day.", // plain text body
        html: `<b>Hello</b>.
        Here is your PIN:
        <b> ${pin}</b>.
        This PIN will expire in 24 hours.
        <p></p>`, // html body
      };

      send(info);
      break;

    case "update-password-success":

      info = {
        from: '"Tikkit Company" <i4ews3i3bmx2jywn@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password updated", // Subject line
        text: "Your new password has been updated.", // plain text body
        html: `<b>Hello,</b>.
        <p>Your new password has been updated.</p>`, // html body
      };

      send(info);
      break;

      case "new-user-confirmation-required":

        info = {
          from: '"CMR Company" <abe.kohler59@ethereal.email>', // sender address
          to: email, // list of receivers
          subject: "Please verify your new user", // Subject line
          text: "Please follow the link to verify your account.", // plain text body
          html: `<b>Hello </b>
            <p>Please follow the link to verify your account.</p>
            <p>${verificationLink}</P>`, // html body
        };

        send(info);
        break;

    default:
      break;
  }
};

module.exports = { emailProcessor };