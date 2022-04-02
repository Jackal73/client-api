const express = require("express");
const router = express.Router();
const { route, post } = require("./ticket.router");
const { insertUser, getUserByEmail, getUserById } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { userAuthorization } = require("../middlewares/authorization.middleware");
const { setPasswordResetPin } = require("../model/resetPin/resetPin.model");
const { emailProcessor } = require("../helpers/email.helper");

router.all("/", (req, res, next) => {
	// res.json({ message: "return from user router" });

  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {

  // this data is coming from database
  const _id = req.userId

  const userProf = await getUserById(_id);

  res.json({ user: userProf });
})

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

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (user && user._id) {
    const setPin = await setPasswordResetPin(email);
    const result = await emailProcessor(email, setPin.pin);

    if (result && result.messageId){
      return res.json({
        status: "success",
        message: "If the email exists in our database, the password reset pin will be sent shortly.",
      });
    }

      return res.json({
        status: "success",
        message: "Unable to process your request at this time. Please try again later!",
      });
  }

  res.json({
    status: "error",
    message: "If the email exists in our database, the password reset pin will be sent shortly.",
  });
});

module.exports = router;