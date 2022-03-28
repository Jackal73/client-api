const express = require("express");
const router = express.Router();
const { route, post } = require("./ticket.router");

const { insertUser, getUserByEmail } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { json } = require("express/lib/response");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");




router.all("/", (req, res, next) => {
	// res.json({ message: "return from user router" });

  next();
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

  // compare hash password with db

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
  const refreshJWT = await createRefreshJWT(user.email);

  res.json({
    status:'success',
    message: "Login Successful!",
    accessJWT,
    refreshJWT});
  });

module.exports = router;