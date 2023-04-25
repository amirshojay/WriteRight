const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { loginValidation, registerValidation } = require("./validation");
const runPrompt = require("./routes/gpt");
const verify = require("./routes/verifyToken");
const User = require("./model/User");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

//Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

dotenv.config();

//Connect to db
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//GET
app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/notloggedin", (req, res) => {
  res.render("notLoggedIn");
});
//POST
app.post("/register", async (req, res) => {
  //Validate the data
  console.log(req.body);
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //hecking if there is a account with this email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email aldready exist!");

  //Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  //Create a account
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    wordCount: 0,
    debt: 0,
  });
  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/login", async (req, res) => {
  //Validate the data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if there is a account with this email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is wrong!");
  //Checking the password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send("Email or password is incorrect!");

  // Create the token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.send({ token });
});

app.post("/index", verify, async (req, res) => {
  const response = await runPrompt(req.body.prompt);
  try {
    const user = await User.findById(req.user._id);
    const words = req.body.prompt.split(" ");
    user.wordCount += words.length;
    user.debt += words.length * 2;
    await user.save();
  } catch (error) {
    console.log(error);
  }
  res.json({ response: response });
});

app.get("/debt", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ debt: user.debt });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/register"); // redirect user to login page
});

//Server
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
