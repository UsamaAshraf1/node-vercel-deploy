const express = require("express");
const { GoogleAuth } = require("google-auth-library");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

app.use(bodyParser.json());

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function generateAccessToken(keyFileBuffer) {
  const scopes = ["https://www.googleapis.com/auth/firebase.messaging"];

  // Create a temporary file in memory using a buffer
  const auth = new GoogleAuth({
    credentials: JSON.parse(keyFileBuffer.toString()),
    scopes: scopes,
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

// Endpoint to generate an access token
app.post("/generate-access-token", upload.single('file'), async (req, res) => {
  try {
    const keyFileBuffer = req.file.buffer;
    const accessToken = await generateAccessToken(keyFileBuffer);

    res.json({ accessToken });
  } catch (error) {
    console.error("Error generating access token:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Express Server!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
