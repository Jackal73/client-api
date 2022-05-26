const express = require("express");
const router = express.Router();
const { route, post } = require("./ticket.router");
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT
} = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { userAuthorization } = require("../middlewares/authorization.middleware");
const { setPasswordResetPin, getPinByEmailPin, deletePin } = require("../model/resetPin/resetPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const { resetPassReqValidation, updatePassValidation } = require("../middlewares/formValidation.middleware");
const { deleteJWT } = require("../helpers/redis.helper");

router.all("/", (req, res, next) => {
	 // res.json({ message: "return from user router" });

  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {

  // this data is coming from database
  const _id = req.userId

  const userProf = await getUserById(_id);
  const { name, email } = userProf;
  res.json({
    user: {
      _id,
      name,
      email,
    },
  });
});

// Create new user router
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body

  try {
    // hash password
    const hashedPass = await hashPassword(password);

    const newUserObj = {name, company, address, phone, email, password: hashedPass };

    const result = await insertUser(newUserObj);
    console.log(result);

    res.json({message: "New user created", result });

  } catch (error) {
    console.log(error);
    res.json({ status:'error', message: error.message });
  }

});

// User sign in router
router.post("/login", async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({status:'error', message: "Invalid Form Submission!"});
  }

  // get user data with email from db
  const user = await getUserByEmail(email);

  const passFromDb = user && user._id ? user.password : null;

  if (!passFromDb)
    return res.json({status:'error', message: "Invalid Email or Password"
    });

  const result = await comparePassword(password, passFromDb);

  if(!result){
    return res.json({status:'error', message: "Invalid Email or Password"
  });
};

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status:'success',
    message: "Login Successful!",
    accessJWT,
    refreshJWT});
  });

router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (user && user._id) {
    const setPin = await setPasswordResetPin(email);
    await emailProcessor({
      email,
      pin: setPin.pin,
      type:'request-new-password' });

      return res.json({
        status: "success",
        message: "If the email exists in our database, the password reset PIN will be sent shortly.",
      });
  }

  res.json({
    status: "error",
    message: "If the email exists in our database, the password reset PIN will be sent shortly.",
  });
});

router.patch("/reset-password", updatePassValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;

  const getPin = await getPinByEmailPin(email, pin);

  if (getPin._id) {
    const dbDate = getPin.addedAt;
    const expiresIn = 1;

    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
    const today = new Date();

    if (today > expDate) {
      return res.json({ status: "error", message: "Invalid or expired PIN."});
    }

    // encrypt new password
    const hashedPass = await hashPassword(newPassword);

    const user = await updatePassword(email, hashedPass);

    if (user._id) {
      // send email notification
      await emailProcessor({ email, type:'update-password-success' });

      // delete pin from db
      deletePin(email, pin);

      return res.json({
        status: "success",
        message: "Your password has been updated."
      });
    }
  }

  res.json({
    status: "error",
    message: "Unable to update your password. Please try again later."
  });
});

// User logout and invalidate JWTs

router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;

  // this data  coming from database
  const _id = req.userId;

  // delete accessJWT from mongodb
  deleteJWT(authorization);

  // delete refreshJWT from mongodb
  const result = await storeUserRefreshJWT(_id, "");

  if (result._id) {
    return res.json({ status: "success", message: "Logged out successfully" });
  }

  res.json({
    status: "error",
    message: "Unable to logout. Please try again later.",
  });

});

module.exports = router;