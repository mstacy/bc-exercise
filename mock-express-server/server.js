const express = require("express");
const cors = require("cors");
const { users, certificationRequests } = require("./data");
const app = express();

app.use(cors());
app.use(express.json());

let requests = [...certificationRequests];

app.post("/login", (req, res) => {
  console.log({ reqBody: req.body });
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  console.log({ users, user, reqBody: req.body });
  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: "fake-jwt-token",
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/requests", (req, res) => {
  res.json(requests);
});

app.post("/requests", (req, res) => {
  console.log("POST /requests body:", req.body);
  const newRequest = { id: Date.now(), ...req.body };
  requests.push(newRequest);
  res.status(201).json(newRequest);
});

app.patch("/requests/:id", (req, res) => {
  console.log("PATCH /requests/:id params:", req.params, "body:", req.body);
  const { id } = req.params;
  const { status } = req.body;
  const request = requests.find((r) => r.id === parseInt(id));
  if (!request) return res.status(404).json({ message: "Not found" });
  request.status = status;
  res.json(request);
});

app.listen(3000, () => {
  console.log("Express mock server running at http://localhost:3000");
});
