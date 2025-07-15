const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // For making HTTP requests (Node <18)
const crypto = require("crypto");    // For creating MD5 hash required by Marvel API
require("dotenv").config();

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors({
  origin: "http://localhost:3000" // Allow only the React app to access this backend
}));
app.use(express.json()); // Enable JSON body parsing

const publicKey = process.env.MARVEL_PUBLIC_KEY;
const privateKey = process.env.MARVEL_PRIVATE_KEY;
const superToken = process.env.SUPER_TOKEN

const isValidHero = (hero) => {
  if (!hero || !hero.powerstats) {
    return false;
  }
  const stats = Object.values(hero.powerstats);
  return !stats.includes("null");
};

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// ✅ Character route
app.get("/character", async (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: "Character name is required" });
  }

  const ts = new Date().getTime();
  const hash = crypto
    .createHash("md5")
    .update(ts + privateKey + publicKey)
    .digest("hex");

  const url=`https://www.superheroapi.com/api.php/${superToken}/search/${name}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.results) {
      data.results = data.results.filter(isValidHero);
    }
    res.json(data); 
    console.log("Superhero API response for search:", data);
  } catch (error) {
    console.error("Error fetching character:", error);
    res.status(500).json({ error: "Failed to fetch character." });
  }
});

// ✅ Get a list of characters by ID range
app.get("/heroes", async (req, res) => {
  const heroes = [];
  // You can adjust this range as needed, or make it dynamic with query parameters
  for (let i = 1; i <= 20; i++) { // Fetching first 20 characters as an example
    const url = `https://www.superheroapi.com/api.php/${superToken}/${i}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.response !== "error" && isValidHero(data)) { // Check if data is valid and not an error
        heroes.push(data);
      }
    } catch (error) {
      console.error(`Error fetching character ID ${i}:`, error);
      // Continue to next character even if one fails
    }
  }
  res.json(heroes);
});

// Add a hero to the deck
app.post("/api/addToDeck", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  const { hero } = req.body;
  if (!idToken || !hero) {
    return res.status(400).json({ error: "Missing ID token or hero data" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Use the hero's ID as the document ID to prevent duplicates
    const db = admin.firestore();
    const heroRef = db.collection("users").doc(uid).collection("deck").doc(String(hero.id));

    const doc = await heroRef.get();
    if (doc.exists) {
      return res.status(409).json({ message: "Hero already in deck." }); // 409 Conflict
    }

    await heroRef.set(hero);

    res.status(200).json({ message: "Hero added to deck successfully!" });
  } catch (error) {
    console.error("Error adding hero to deck:", error);
    res.status(500).json({ error: "Failed to add hero to deck." });
  }
});

// Get all heroes in the deck
app.get("/api/deck", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const db = admin.firestore();
    const snapshot = await db.collection("users").doc(uid).collection("deck").get();
    const heroes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(heroes);
  } catch (error) {
    console.error("Error fetching deck:", error);
    res.status(500).json({ error: "Failed to fetch deck." });
  }
});

// Remove a hero from the deck
app.delete("/api/deck/:heroId", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  const { heroId } = req.params;
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const db = admin.firestore();
    await db.collection("users").doc(uid).collection("deck").doc(heroId).delete();
    res.status(200).json({ message: "Hero removed from deck successfully!" });
  } catch (error) {
    console.error("Error removing hero from deck:", error);
    res.status(500).json({ error: "Failed to remove hero from deck." });
  }
});

// Create a new user and initialize tokens
app.post("/api/user", async (req, res) => {
  const { uid, email } = req.body;
  if (!uid || !email) {
    return res.status(400).json({ error: "Missing UID or email" });
  }

  try {
    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    await userRef.set({
      email: email,
      tokens: 100, // Initial token amount
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Get user tokens
app.get("/api/user/tokens", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ tokens: doc.data().tokens });
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    res.status(500).json({ error: "Failed to fetch user tokens" });
  }
});

app.post("/api/user/tokens", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  const { tokens } = req.body;
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (isNaN(tokens)) {
    return res.status(400).json({ error: "Invalid token amount" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    await userRef.update({ tokens });
    res.status(200).json({ message: "Tokens updated successfully" });
  } catch (error) {
    console.error("Error updating user tokens:", error);
    res.status(500).json({ error: "Failed to update user tokens" });
  }
});

// Get two random heroes for battle
app.get("/api/battle/random-heroes", async (req, res) => {
  const heroes = [];
  const fetchedHeroIds = new Set();

  while (heroes.length < 2) {
    const randomId = Math.floor(Math.random() * 731) + 1;
    if (fetchedHeroIds.has(randomId)) {
      continue; // Skip if we've already fetched this hero
    }
    fetchedHeroIds.add(randomId);

    const url = `https://www.superheroapi.com/api.php/${superToken}/${randomId}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.response !== "error" && isValidHero(data)) {
        heroes.push(data);
      }
    } catch (error) {
      console.error(`Error fetching character ID ${randomId}:`, error);
    }
  }

  if (heroes.length === 2) {
    res.status(200).json(heroes);
  } else {
    res.status(500).json({ error: "Failed to fetch two random heroes." });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
