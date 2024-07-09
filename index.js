const express = require("express");
const { GoogleAuth } = require("google-auth-library");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

async function generateAccessToken(keyFilePath) {
  const scopes = ["https://www.googleapis.com/auth/firebase.messaging"];

  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: scopes,
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

// Endpoint to generate an access token
app.post("/generate-access-token", upload.single('file'), async (req, res) => {
  try {
    const keyFilePath = req.file.path;
    const accessToken = await generateAccessToken(keyFilePath);

    // Delete the uploaded file after use
    fs.unlinkSync(keyFilePath);

    res.json({ accessToken });
  } catch (error) {
    console.error("Error generating access token:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});