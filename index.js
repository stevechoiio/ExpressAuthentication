const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const PORT = 8000;
const app = express();
const jwt = require("jsonwebtoken");

app.set("JWT_SECRET", process.env.JWT_SECRET || "keyboard cat");
function isValidEmail(email) {
  // TODO
  return true;
}

app.get("/", (req, res) => {
  res.send("🤓 #codeasdfasdflife");
});

app.use(bodyParser.json());

const fakeDB = [];

app.post("/signup", async (req, res) => {
  if (!isValidEmail(req.body.email) || !req.body.password) {
    return res.sendStatus(400);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log(hashedPassword);
  await bcrypt.compare(req.body.password, hashedPassword);

  const newUser = { email: req.body.email, password: hashedPassword };

  // MOCK DB INSERT
  fakeDB.push(newUser);

  const token = jwt.sign(newUser, "keyboard cat", { expiresIn: "2h" });
  res.cookie("super-token", token, { maxAge: 1000 * 60 * 120 });
  res.sendStatus(200);
  console.log(fakeDB);
});

app.post("/login", async (req, res) => {
  const user = fakeDB.find(user => user.email === req.body.email);
  if (!user) return res.sendStatus(401);
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (passwordMatch) {
    const token = jwt.sign(user, "keyboard cat", { expiresIn: "2h" });
    res.cookie("super-token", token, { maxAge: 1000 * 60 * 120 });
    console.log("token givin to the user/logged in");
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.listen(PORT, () => {
  console.log("🍻 go to localhost:8000");
});
