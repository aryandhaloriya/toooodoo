const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const User = require('./user'); 
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.exists({ email });
    if (userExist) {
      return res.status(409).json({ msg: "Email already in use" }); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ msg: "User created successfully" }); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }
        return res.status(200).json({ msg: "Login successful" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Internal server error" });
    }
});

  

mongoose.connect("mongodb://localhost:27017/tooodoo")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1); 
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
