const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.post("/generate-access-token", async (req, res) => {
  res.send("connected Successfully");
});

app.get("/", async (req, res) => {
  res.send("home connected Successfully");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
