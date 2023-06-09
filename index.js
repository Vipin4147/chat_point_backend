const connection = require("./config/db.js");
const mongoose = require("mongoose");
const express = require("express");
const { user } = require("./routes/user");
const { admin } = require("./routes/admin");
const { logger } = require("./middleware/logger.js");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
// app.use(cors());

app.use(cors({ origin: "*" }));

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vipin4147@gmail.com",
    pass: process.env.App_Password,
  },
});

let loggerTouse = (req, res, next) => {
  logger.log("info", `A ${req.method} request is made on url:${req.url}`);
  let email = req.body.email || req.user.email;

  let mailOptions = {
    from: "vipin4147@gmail.com",
    to: email,
    subject: "Email from Chat Point",
    text: "info" + " " + `A ${req.method} request is made on url:${req.url}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.send("email sent successfully");
    }
  });
  next();
};
app.get("/", (req, res) => {
  res.send("welcome user");
});
app.use(loggerTouse);

app.use("/admin", admin);
app.use("/user", user);
// const {admin} = require("./routes/admin");

// require("dotenv").config();

// const myredis = createClient({
//   url: "",
// });

// myredis.on("error", (err) => console.log("Redis Client Error", err));

// app.get("/", (req, res) => {
//   res.send("welcome user");
// });

// app.get("/protected", authenticate, (req, res) => {
//   res.send("only verified users can use this");
// });

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
